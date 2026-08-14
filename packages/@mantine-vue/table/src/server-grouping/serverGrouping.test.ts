// @vitest-environment node

import { effectScope, nextTick, reactive } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { createServerGroupingProvider } from './createServerGroupingProvider'
import {
  MVT_SERVER_GROUPING_ROOT_PATH_ID,
  type MVT_ServerGroupingOptions,
} from './serverGrouping.types'
import {
  createServerGroupPathId,
  getServerGroupPathDepth,
  isAbortError,
  isServerGroupPathOrDescendant,
  parseServerGroupPathId,
  serializeServerGroupingCacheKey,
} from './serverGrouping.utils'
import {
  createMVT_ServerGroupingManager,
  type MVT_ServerGroupingManager,
} from './useMVT_ServerGrouping'

const flush = async () => {
  await nextTick()
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

interface ApiGroup {
  count?: number
  key: string
  name: string
  totals?: Record<string, number>
}
interface ApiGroupResponse {
  items: ApiGroup[]
  total: number
}
interface Sale {
  amount: number
  id: number
  name: string
}
interface ApiRecordResponse {
  data: Sale[]
  totalCount: number
}

const makeProvider = (
  overrides: Partial<
    Parameters<
      typeof createServerGroupingProvider<Sale, ApiGroup, ApiGroupResponse, ApiRecordResponse>
    >[0]
  > = {},
) =>
  createServerGroupingProvider<Sale, ApiGroup, ApiGroupResponse, ApiRecordResponse>({
    groupCount: (group) => group.count,
    groupId: (group) => group.key,
    groupLabel: (group) => group.name,
    groupMeta: (group) => ({ totals: group.totals }),
    groupRowCount: (response) => response.total,
    groups: (response) => response.items,
    loadGroups: vi.fn(async ({ groupingField, pagination }) => ({
      items: [
        { count: 2, key: `${groupingField}-a-p${pagination.pageIndex}`, name: 'Group A' },
        { count: 3, key: `${groupingField}-b-p${pagination.pageIndex}`, name: 'Group B' },
      ],
      total: 40,
    })),
    loadRecords: vi.fn(async ({ pagination }) => ({
      data: [
        { amount: 10, id: pagination.pageIndex * 100 + 1, name: 'r1' },
        { amount: 20, id: pagination.pageIndex * 100 + 2, name: 'r2' },
      ],
      totalCount: 12,
    })),
    recordRowCount: (response) => response.totalCount,
    records: (response) => response.data,
    rowId: (row) => String(row.id),
    ...overrides,
  })

const makeTable = (
  serverGrouping: MVT_ServerGroupingOptions<Sale, any, any, any>,
  tableState: Record<string, unknown> = {},
) => {
  const state = reactive({
    columnFilters: [] as unknown[],
    globalFilter: undefined as unknown,
    grouping: [] as string[],
    // Mirror the root pagination state initialized by useMVT_TableOptions.
    pagination: { pageIndex: 0, pageSize: serverGrouping.initialPageSize ?? 10 },
    sorting: [] as unknown[],
    ...tableState,
  })
  const table = {
    getState: () => state,
    options: {
      initialState: {},
      serverGrouping,
      state: undefined,
    },
    setPageIndex: (pageIndex: number) => {
      state.pagination = { ...state.pagination, pageIndex }
    },
    setPagination: (next: { pageIndex: number; pageSize: number }) => {
      state.pagination = { ...next }
    },
  }
  return { state, table: table as any }
}

const setup = (
  serverGrouping: MVT_ServerGroupingOptions<Sale, any, any, any>,
  tableState: Record<string, unknown> = {},
) => {
  const scope = effectScope()
  const { state, table } = makeTable(serverGrouping, tableState)
  const manager: MVT_ServerGroupingManager<Sale> = scope.run(() =>
    createMVT_ServerGroupingManager<Sale>(table),
  )!
  return { manager, scope, state, table }
}

const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, reject, resolve }
}

describe('server grouping path utils', () => {
  it('builds stable path ids from the root', () => {
    expect(createServerGroupPathId(MVT_SERVER_GROUPING_ROOT_PATH_ID, 'country', 'BH')).toBe(
      'country:BH',
    )
    expect(createServerGroupPathId('country:BH', 'salesperson', '42')).toBe(
      'country:BH/salesperson:42',
    )
  })

  it('escapes reserved characters so ids may contain : and /', () => {
    const pathId = createServerGroupPathId(MVT_SERVER_GROUPING_ROOT_PATH_ID, 'a:b', 'x/y:z')
    expect(parseServerGroupPathId(pathId)).toEqual([{ field: 'a:b', groupId: 'x/y:z' }])
  })

  it('parses path ids back into segments', () => {
    expect(parseServerGroupPathId(MVT_SERVER_GROUPING_ROOT_PATH_ID)).toEqual([])
    expect(parseServerGroupPathId('country:BH/salesperson:42')).toEqual([
      { field: 'country', groupId: 'BH' },
      { field: 'salesperson', groupId: '42' },
    ])
  })

  it('computes depth', () => {
    expect(getServerGroupPathDepth(MVT_SERVER_GROUPING_ROOT_PATH_ID)).toBe(0)
    expect(getServerGroupPathDepth('country:BH')).toBe(1)
    expect(getServerGroupPathDepth('country:BH/salesperson:42')).toBe(2)
  })

  it('detects descendants', () => {
    expect(isServerGroupPathOrDescendant('country:BH', MVT_SERVER_GROUPING_ROOT_PATH_ID)).toBe(true)
    expect(isServerGroupPathOrDescendant('country:BH/salesperson:42', 'country:BH')).toBe(true)
    expect(isServerGroupPathOrDescendant('country:BHX', 'country:BH')).toBe(false)
    expect(isServerGroupPathOrDescendant('country:US', 'country:BH')).toBe(false)
  })

  it('serializes cache keys deterministically regardless of object key order', () => {
    expect(serializeServerGroupingCacheKey([{ a: 1, b: 2 }])).toBe(
      serializeServerGroupingCacheKey([{ b: 2, a: 1 }]),
    )
    expect(serializeServerGroupingCacheKey([{ a: 1 }])).not.toBe(
      serializeServerGroupingCacheKey([{ a: 2 }]),
    )
  })

  it('identifies abort errors', () => {
    expect(isAbortError(new DOMException('x', 'AbortError'))).toBe(true)
    expect(isAbortError(new Error('nope'))).toBe(false)
    expect(isAbortError(undefined)).toBe(false)
  })
})

describe('createServerGroupingProvider', () => {
  it('normalizes groups through concise adapters', async () => {
    const provider = makeProvider()
    const response = await provider.loadGroups({
      groupingField: 'country',
      pagination: { pageIndex: 0, pageSize: 10 },
    } as any)
    const groups = provider.getGroups(response)
    const context = {} as any
    expect(provider.getGroupId(groups[0], context)).toBe('country-a-p0')
    expect(provider.getGroupLabel(groups[0], context)).toBe('Group A')
    expect(provider.getGroupCount?.(groups[0], context)).toBe(2)
    expect(provider.getGroupRowCount(response)).toBe(40)
  })

  it('defaults groupValue to the group object and meta to {}', () => {
    const provider = createServerGroupingProvider<Sale, string, string[], Sale[]>({
      loadGroups: async () => ['x'],
      loadRecords: async () => [],
    })
    const context = {} as any
    expect(provider.getGroupValue?.('x', context)).toBe('x')
    expect(provider.getGroupMeta?.('x', context)).toEqual({})
    expect(provider.getGroupId('x', context)).toBe('x')
    expect(provider.getGroupLabel('x', context)).toBe('x')
  })

  it('defaults groups/records to array responses and row counts to lengths', () => {
    const provider = createServerGroupingProvider<Sale, string, string[], Sale[]>({
      loadGroups: async () => ['a', 'b'],
      loadRecords: async () => [],
    })
    expect(provider.getGroups(['a', 'b'])).toEqual(['a', 'b'])
    expect(provider.getGroupRowCount(['a', 'b'])).toBe(2)
    expect(provider.getRecordRowCount([])).toBe(0)
  })

  it('prefers explicit adapter names over concise aliases', () => {
    const provider = createServerGroupingProvider<
      Sale,
      ApiGroup,
      ApiGroupResponse,
      ApiRecordResponse
    >({
      getGroupId: (group) => `explicit-${group.key}`,
      groupId: (group) => `concise-${group.key}`,
      loadGroups: async () => ({ items: [], total: 0 }),
      loadRecords: async () => ({ data: [], totalCount: 0 }),
    })
    expect(provider.getGroupId({ key: 'k', name: 'n' }, {} as any)).toBe('explicit-k')
  })
})

describe('server grouping manager', () => {
  it('loads the root group page on creation', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: ['country', 'salesperson'], provider })
    await flush()
    const root = manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!
    expect(provider.loadGroups).toHaveBeenCalledTimes(1)
    expect(root.kind).toBe('groups')
    expect(root.groups).toHaveLength(2)
    expect(root.rowCount).toBe(40)
    expect(root.isLoading).toBe(false)
    expect(root.error).toBeNull()
    scope.stop()
  })

  it('loads records at the root when grouping is empty', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: [], provider })
    await flush()
    const root = manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)
    expect(root.kind).toBe('records')
    expect(root.rows).toHaveLength(2)
    expect(root.rowCount).toBe(12)
    scope.stop()
  })

  it('lazily loads child groups on expand and records after the last level', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: ['country', 'salesperson'], provider })
    await flush()
    expect(provider.loadGroups).toHaveBeenCalledTimes(1)

    const childPathId = 'country:country-a-p0'
    manager.expand(childPathId)
    await flush()
    expect(provider.loadGroups).toHaveBeenCalledTimes(2)
    const childRequest = (provider.loadGroups as any).mock.calls[1][0]
    expect(childRequest.groupingField).toBe('salesperson')
    expect(childRequest.depth).toBe(1)
    expect(childRequest.parentGroup.id).toBe('country-a-p0')
    expect(childRequest.parentGroups).toHaveLength(1)
    expect(manager.getPathState(childPathId)?.kind).toBe('groups')

    const leafPathId = createServerGroupPathId(childPathId, 'salesperson', 'salesperson-a-p0')
    manager.expand(leafPathId)
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)
    const recordRequest = (provider.loadRecords as any).mock.calls[0][0]
    expect(recordRequest.depth).toBe(2)
    expect(recordRequest.parentGroups).toHaveLength(2)
    expect(manager.getPathState(leafPathId)?.rows).toHaveLength(2)
    scope.stop()
  })

  it('keeps pagination independent per path', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: ['country'], initialPageSize: 15, provider })
    await flush()
    manager.expand('country:country-a-p0')
    manager.expand('country:country-b-p0')
    await flush()

    manager.setPagination('country:country-a-p0', { pageIndex: 2 })
    await flush()

    expect(manager.getPathState('country:country-a-p0')?.pagination).toMatchObject({
      pageIndex: 2,
      pageSize: 15,
    })
    expect(manager.getPathState('country:country-b-p0')?.pagination).toMatchObject({
      pageIndex: 0,
      pageSize: 15,
    })
    expect(manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageIndex).toBe(0)
    const recordCalls = (provider.loadRecords as any).mock.calls
    expect(
      recordCalls.filter((call: any[]) => call[0].pathId === 'country:country-a-p0'),
    ).toHaveLength(2)
    expect(
      recordCalls.filter((call: any[]) => call[0].pathId === 'country:country-b-p0'),
    ).toHaveLength(1)
    scope.stop()
  })

  it('per-path sorting resets only that path pagination', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: ['country'], provider })
    await flush()
    manager.expand('country:country-a-p0')
    manager.expand('country:country-b-p0')
    await flush()
    manager.setPagination('country:country-b-p0', { pageIndex: 3 })
    manager.setPagination('country:country-a-p0', { pageIndex: 3 })
    await flush()

    manager.setSorting('country:country-a-p0', [{ desc: true, id: 'amount' }])
    await flush()

    expect(manager.getPathState('country:country-a-p0')?.pagination.pageIndex).toBe(0)
    expect(manager.getPathState('country:country-a-p0')?.sorting).toEqual([
      { desc: true, id: 'amount' },
    ])
    expect(manager.getPathState('country:country-b-p0')?.pagination.pageIndex).toBe(3)
    const lastCall = (provider.loadRecords as any).mock.calls.at(-1)[0]
    expect(lastCall.sorting).toEqual([{ desc: true, id: 'amount' }])
    scope.stop()
  })

  it('aborts the previous request when a newer one replaces it', async () => {
    const first = deferred<ApiRecordResponse>()
    const signals: AbortSignal[] = []
    const provider = makeProvider({
      loadRecords: vi.fn(({ signal }: any) => {
        signals.push(signal)
        return signals.length === 1
          ? first.promise
          : Promise.resolve({ data: [{ amount: 1, id: 99, name: 'new' }], totalCount: 1 })
      }) as any,
    })
    const { manager, scope } = setup({ grouping: [], provider })
    await flush()
    manager.setPagination(MVT_SERVER_GROUPING_ROOT_PATH_ID, { pageIndex: 1 })
    await flush()
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
    scope.stop()
  })

  it('ignores stale responses (page 1 must not replace page 2)', async () => {
    const page1 = deferred<ApiRecordResponse>()
    const page2 = deferred<ApiRecordResponse>()
    const provider = makeProvider({
      loadRecords: vi.fn(({ pagination }: any) =>
        pagination.pageIndex === 0 ? page1.promise : page2.promise,
      ) as any,
    })
    const { manager, scope } = setup({ grouping: [], provider })
    await flush()
    manager.setPagination(MVT_SERVER_GROUPING_ROOT_PATH_ID, { pageIndex: 1 })
    page2.resolve({ data: [{ amount: 2, id: 2, name: 'page2' }], totalCount: 100 })
    await flush()
    page1.resolve({ data: [{ amount: 1, id: 1, name: 'page1' }], totalCount: 100 })
    await flush()
    const root = manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!
    expect(root.rows?.[0].name).toBe('page2')
    expect(root.isFetching).toBe(false)
    scope.stop()
  })

  it('does not surface aborted requests as errors', async () => {
    const never = deferred<ApiRecordResponse>()
    const provider = makeProvider({
      loadRecords: vi.fn(({ signal }: any) => {
        signal.addEventListener('abort', () =>
          never.reject(new DOMException('aborted', 'AbortError')),
        )
        return never.promise
      }) as any,
    })
    const { manager, scope } = setup({ grouping: [], provider })
    await flush()
    scope.stop()
    await flush()
    expect(manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.error).toBeFalsy()
  })

  it('isolates errors per path and supports retry', async () => {
    let shouldFail = true
    const onError = vi.fn()
    const provider = makeProvider({
      loadRecords: vi.fn(async ({ pathId }: any) => {
        if (pathId === 'country:country-a-p0' && shouldFail) {
          throw new Error('boom')
        }
        return { data: [{ amount: 1, id: 1, name: 'ok' }], totalCount: 1 }
      }) as any,
    })
    const { manager, scope } = setup({ grouping: ['country'], onError, provider })
    await flush()
    manager.expand('country:country-a-p0')
    manager.expand('country:country-b-p0')
    await flush()

    expect((manager.getPathState('country:country-a-p0')!.error as Error).message).toBe('boom')
    expect(manager.getPathState('country:country-b-p0')?.error).toBeNull()
    expect(manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.error).toBeNull()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0].pathId).toBe('country:country-a-p0')

    shouldFail = false
    manager.retry('country:country-a-p0')
    await flush()
    expect(manager.getPathState('country:country-a-p0')?.error).toBeNull()
    expect(manager.getPathState('country:country-a-p0')?.rows).toHaveLength(1)
    scope.stop()
  })

  it('cancels pending loads when a group is collapsed', async () => {
    const pending = deferred<ApiRecordResponse>()
    let signal: AbortSignal | undefined
    const provider = makeProvider({
      loadRecords: vi.fn((request: any) => {
        signal = request.signal
        return pending.promise
      }) as any,
    })
    const { manager, scope } = setup({ grouping: ['country'], provider })
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    expect(manager.getPathState('country:country-a-p0')?.isFetching).toBe(true)
    manager.collapse('country:country-a-p0')
    await flush()
    expect(signal?.aborted).toBe(true)
    expect(manager.getPathState('country:country-a-p0')?.isFetching).toBe(false)
    scope.stop()
  })

  it('serves fresh cache hits without refetching and honors invalidation', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({
      cache: { enabled: true, staleTime: 60_000 },
      grouping: [],
      provider,
    })
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)

    manager.setPagination(MVT_SERVER_GROUPING_ROOT_PATH_ID, { pageIndex: 1 })
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(2)
    manager.setPagination(MVT_SERVER_GROUPING_ROOT_PATH_ID, { pageIndex: 0 })
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(2)
    expect(manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.rows?.[0].id).toBe(1)

    manager.invalidate()
    manager.reload(MVT_SERVER_GROUPING_ROOT_PATH_ID)
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(3)
    scope.stop()
  })

  it('includes provider getCacheKey parts in the cache key', async () => {
    const provider = makeProvider({ getCacheKey: () => ['tenant-1'] })
    const providerB = makeProvider({ getCacheKey: () => ['tenant-2'] })
    const requestStub = {
      columnFilters: [],
      depth: 0,
      globalFilter: null,
      grouping: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      pathId: '__root__',
      sorting: [],
    }
    const keyA = serializeServerGroupingCacheKey([
      requestStub.pathId,
      ...(provider.getCacheKey?.(requestStub as any) ?? []),
    ])
    const keyB = serializeServerGroupingCacheKey([
      requestStub.pathId,
      ...(providerB.getCacheKey?.(requestStub as any) ?? []),
    ])
    expect(keyA).not.toBe(keyB)
  })

  it('resets and reloads when grouping fields change at runtime', async () => {
    const provider = makeProvider()
    const { manager, scope, state } = setup({ provider }) //grouping from table state
    state.grouping = ['country']
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    expect(manager.isExpanded('country:country-a-p0')).toBe(true)

    state.grouping = ['department', 'status']
    await flush()
    expect(manager.isExpanded('country:country-a-p0')).toBe(false)
    const lastGroupCall = (provider.loadGroups as any).mock.calls.at(-1)[0]
    expect(lastGroupCall.groupingField).toBe('department')
    expect(lastGroupCall.grouping).toEqual(['department', 'status'])
    scope.stop()
  })

  it('treats grouping identifiers as opaque strings', async () => {
    const provider = makeProvider()
    const { scope } = setup({ grouping: ['createdAt:month'], provider })
    await flush()
    const call = (provider.loadGroups as any).mock.calls[0][0]
    expect(call.groupingField).toBe('createdAt:month')
    scope.stop()
  })

  it('shares table filters by default and reloads expanded paths on change', async () => {
    const provider = makeProvider()
    const { manager, scope, state } = setup({ grouping: ['country'], provider })
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    manager.setPagination('country:country-a-p0', { pageIndex: 4 })
    await flush()

    state.columnFilters = [{ id: 'name', value: 'x' }]
    await flush()
    expect(manager.getPathState('country:country-a-p0')?.pagination.pageIndex).toBe(0)
    const lastRootCall = (provider.loadGroups as any).mock.calls.at(-1)[0]
    expect(lastRootCall.columnFilters).toEqual([{ id: 'name', value: 'x' }])
    const lastRecordCall = (provider.loadRecords as any).mock.calls.at(-1)[0]
    expect(lastRecordCall.columnFilters).toEqual([{ id: 'name', value: 'x' }])
    scope.stop()
  })

  it('supports records-only filtering mode', async () => {
    const provider = makeProvider()
    const { manager, scope, state } = setup({
      filteringMode: 'records-only',
      grouping: ['country'],
      provider,
    })
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    const groupCallsBefore = (provider.loadGroups as any).mock.calls.length

    state.globalFilter = 'search'
    await flush()
    expect((provider.loadGroups as any).mock.calls.length).toBe(groupCallsBefore)
    const lastRecordCall = (provider.loadRecords as any).mock.calls.at(-1)[0]
    expect(lastRecordCall.globalFilter).toBe('search')
    scope.stop()
  })

  it('applies table sorting to the root only in independent mode', async () => {
    const provider = makeProvider()
    const { manager, scope, state } = setup({ grouping: ['country'], provider })
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    const recordCallsBefore = (provider.loadRecords as any).mock.calls.length

    state.sorting = [{ desc: false, id: 'name' }]
    await flush()
    const lastGroupCall = (provider.loadGroups as any).mock.calls.at(-1)[0]
    expect(lastGroupCall.pathId).toBe(MVT_SERVER_GROUPING_ROOT_PATH_ID)
    expect(lastGroupCall.sorting).toEqual([{ desc: false, id: 'name' }])
    expect((provider.loadRecords as any).mock.calls.length).toBe(recordCallsBefore)
    scope.stop()
  })

  it('supports controlled expansion state', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const expanded = reactive<Record<string, boolean>>({})
    const onServerGroupingExpandedChange = vi.fn((next: Record<string, boolean>) => {
      Object.keys(expanded).forEach((key) => delete expanded[key])
      Object.assign(expanded, next)
    })
    const { table } = makeTable({ grouping: ['country'], provider })
    table.options.onServerGroupingExpandedChange = onServerGroupingExpandedChange
    const manager = scope.run(() =>
      createMVT_ServerGroupingManager(table, () => ({ ...expanded })),
    )!
    await flush()

    manager.expand('country:country-a-p0')
    expect(onServerGroupingExpandedChange).toHaveBeenCalledWith({ 'country:country-a-p0': true })
    await flush()
    expect(manager.isExpanded('country:country-a-p0')).toBe(true)

    expanded['country:country-a-p0'] = false
    await flush()
    expect(manager.isExpanded('country:country-a-p0')).toBe(false)
    scope.stop()
  })

  it('handles empty group and record responses', async () => {
    const provider = makeProvider({
      loadGroups: vi.fn(async () => ({ items: [], total: 0 })) as any,
      loadRecords: vi.fn(async () => ({ data: [], totalCount: 0 })) as any,
    })
    const { manager, scope } = setup({ grouping: ['country'], provider })
    await flush()
    const root = manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!
    expect(root.groups).toEqual([])
    expect(root.rowCount).toBe(0)
    expect(root.error).toBeNull()
    scope.stop()
  })

  it('keeps counts and aggregates optional', async () => {
    const provider = createServerGroupingProvider<
      Sale,
      ApiGroup,
      ApiGroupResponse,
      ApiRecordResponse
    >({
      groupId: (group) => group.key,
      groupLabel: (group) => group.name,
      groupRowCount: (response) => response.total,
      groups: (response) => response.items,
      loadGroups: async () => ({ items: [{ key: 'k', name: 'No count' }], total: 1 }),
      loadRecords: async () => ({ data: [], totalCount: 0 }),
      recordRowCount: (response) => response.totalCount,
      records: (response) => response.data,
    })
    const { manager, scope } = setup({ grouping: ['country'], provider })
    await flush()
    const node = manager.getPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!.groups![0]
    expect(node.count).toBeUndefined()
    expect(node.meta).toEqual({})
    expect(node.hasChildren).toBe(true)
    scope.stop()
  })

  it('stores cursor metadata in pagination state', async () => {
    const provider = makeProvider()
    const { manager, scope } = setup({ grouping: [], provider })
    await flush()
    manager.setPagination(MVT_SERVER_GROUPING_ROOT_PATH_ID, {
      cursor: 'opaque-cursor',
      pageIndex: 1,
    })
    await flush()
    const lastCall = (provider.loadRecords as any).mock.calls.at(-1)[0]
    expect(lastCall.pagination.cursor).toBe('opaque-cursor')
    scope.stop()
  })

  it('fires lifecycle events', async () => {
    const events: string[] = []
    const provider = makeProvider()
    const { manager, scope } = setup({
      grouping: ['country'],
      onGroupCollapse: () => events.push('collapse'),
      onGroupExpand: () => events.push('expand'),
      onGroupLoadStart: () => events.push('loadStart'),
      onGroupLoadSuccess: () => events.push('groupSuccess'),
      onRecordLoadSuccess: () => events.push('recordSuccess'),
      provider,
    })
    await flush()
    manager.expand('country:country-a-p0')
    await flush()
    manager.collapse('country:country-a-p0')
    await flush()
    expect(events).toContain('expand')
    expect(events).toContain('collapse')
    expect(events).toContain('loadStart')
    expect(events).toContain('groupSuccess')
    expect(events).toContain('recordSuccess')
    scope.stop()
  })
})
