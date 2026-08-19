// @vitest-environment node

import { effectScope, nextTick, ref } from 'vue'

import { afterEach, describe, expect, it, vi } from 'vitest'

// Stub the large icon and component barrels; this suite does not render them.
vi.mock('@tabler/icons-vue', () => {
  const icon = { render: () => null }
  return new Proxy(
    {},
    {
      get: (_target, key) => (key === 'default' ? undefined : icon),
      has: () => true,
    },
  )
})
vi.mock('@mantine-vue/core', async () => {
  const { ref } = await import('vue')
  const component = { render: () => null }
  const special: Record<string, unknown> = {
    darken: (color: string) => color,
    default: undefined,
    lighten: (color: string) => color,
    useDirection: () => ({ dir: ref('ltr') }),
    useMantineColorScheme: () => ({ colorScheme: ref('light') }),
  }
  return new Proxy(
    {},
    {
      get: (_target, key) => (key in special ? special[key as string] : component),
      has: () => true,
    },
  )
})

import { useMantineVueTable } from '../hooks/useMantineVueTable'
import { type MVT_ColumnDef } from '../types'
import { getMVT_RowSelectionHandler } from '../utils/row.utils'
import { createServerGroupingProvider } from './createServerGroupingProvider'
import {
  getServerGroupableColumns,
  getServerGroupingColumnActions,
  getServerGroupingGroupByContext,
} from './MVT_ServerGroupingGroupBy.vue'
import { MVT_SERVER_GROUPING_ROOT_PATH_ID } from './serverGrouping.types'

const flush = async () => {
  await nextTick()
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

interface Sale {
  amount: number
  id: number
  name: string
}

const columns: MVT_ColumnDef<Sale>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'amount', header: 'Amount' },
]

const makeProvider = () =>
  createServerGroupingProvider<Sale, { key: string; label: string }, any, any>({
    groupId: (group) => group.key,
    groupLabel: (group) => group.label,
    groupRowCount: (response) => response.total,
    groups: (response) => response.items,
    loadGroups: vi.fn(async () => ({
      items: [
        { key: 'BH', label: 'Bahrain' },
        { key: 'US', label: 'USA' },
      ],
      total: 2,
    })),
    loadRecords: vi.fn(async () => ({
      rows: [{ amount: 10, id: 1, name: 'r1' }],
      total: 1,
    })),
    recordRowCount: (response) => response.total,
    records: (response) => response.rows,
  })

describe('server grouping table instance integration', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes safe no-op methods when server grouping is not configured', () => {
    const scope = effectScope()
    const table = scope.run(() => useMantineVueTable<Sale>({ columns, data: [] }))!
    expect(table.getServerGroupingState()).toEqual({
      enabled: false,
      expanded: {},
      grouping: [],
      paths: {},
    })
    expect(table.getServerGroupingPathState('country:BH')).toBeUndefined()
    expect(() => {
      table.expandServerGroup('country:BH')
      table.collapseServerGroup('country:BH')
      table.toggleServerGroup('country:BH')
      table.reloadServerGrouping()
      table.invalidateServerGrouping()
      table.resetServerGroupingState()
    }).not.toThrow()
    expect((table as any)._serverGrouping).toBeUndefined()
    scope.stop()
  })

  it('loads the root page on creation and exposes state through instance methods', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], provider },
      }),
    )!
    await flush()

    expect(provider.loadGroups).toHaveBeenCalledTimes(1)
    const state = table.getServerGroupingState()
    expect(state.enabled).toBe(true)
    expect(state.grouping).toEqual(['country'])
    const root = table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)!
    expect(root.groups?.map((group) => group.label)).toEqual(['Bahrain', 'USA'])
    scope.stop()
  })

  it('expands and collapses through instance methods and tracks expanded state', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], provider },
      }),
    )!
    await flush()

    table.expandServerGroup('country:BH')
    await flush()
    expect(table.getState().serverGroupingExpanded).toEqual({ 'country:BH': true })
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)
    expect(table.getServerGroupingPathState('country:BH')?.rows).toHaveLength(1)

    table.toggleServerGroup('country:BH')
    await flush()
    expect(table.getState().serverGroupingExpanded).toEqual({ 'country:BH': false })
    scope.stop()
  })

  it('sets per-path query state through instance methods', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], initialPageSize: 5, provider },
      }),
    )!
    await flush()
    table.expandServerGroup('country:BH')
    await flush()

    table.setServerGroupingPagination('country:BH', { pageIndex: 2 })
    await flush()
    expect(table.getServerGroupingPathState('country:BH')?.pagination).toMatchObject({
      pageIndex: 2,
      pageSize: 5,
    })
    expect(
      table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageIndex,
    ).toBe(0)

    table.setServerGroupingSorting('country:BH', [{ desc: true, id: 'amount' }])
    await flush()
    expect(table.getServerGroupingPathState('country:BH')?.pagination.pageIndex).toBe(0)
    expect(table.getServerGroupingPathState('country:BH')?.sorting).toEqual([
      { desc: true, id: 'amount' },
    ])

    table.setServerGroupingColumnFilters('country:BH', (filters) => [
      ...filters,
      { id: 'name', value: 'Alice' },
    ])
    table.setServerGroupingGlobalFilter('country:BH', 'active')
    await flush()
    expect(table.getServerGroupingPathState('country:BH')?.columnFilters).toEqual([
      { id: 'name', value: 'Alice' },
    ])
    expect(table.getServerGroupingPathState('country:BH')?.globalFilter).toBe('active')
    scope.stop()
  })

  it('reuses the table grouping state and reacts to setGrouping at runtime', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        initialState: { grouping: ['country'] },
        serverGrouping: { provider },
      }),
    )!
    await flush()
    expect((provider.loadGroups as any).mock.calls[0][0].groupingField).toBe('country')

    table.expandServerGroup('country:BH')
    await flush()
    table.setGrouping(['department'])
    await flush()

    expect(table.getState().serverGroupingExpanded).toEqual({})
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].groupingField).toBe('department')
    scope.stop()
  })

  it('forces manual modes and keeps the standard bottom toolbar pagination', () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], provider },
      }),
    )!
    expect(table.options.manualPagination).toBe(true)
    expect(table.options.manualSorting).toBe(true)
    expect(table.options.manualFiltering).toBe(true)
    // The root level is paginated by the regular bottom toolbar.
    expect(table.options.positionPagination).toBe('bottom')
    scope.stop()
  })

  it('warns when combined with client-side grouping', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const provider = makeProvider()
    const scope = effectScope()
    scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        enableGrouping: true,
        serverGrouping: { grouping: ['country'], provider },
      }),
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('serverGrouping'))
    scope.stop()
  })

  it('supports controlled expansion through state + onServerGroupingExpandedChange', async () => {
    const provider = makeProvider()
    const expanded = ref<Record<string, boolean>>({})
    const onServerGroupingExpandedChange = vi.fn((next: Record<string, boolean>) => {
      expanded.value = next
    })
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        onServerGroupingExpandedChange,
        serverGrouping: { grouping: ['country'], provider },
        state: {
          get serverGroupingExpanded() {
            return expanded.value
          },
        },
      }),
    )!
    await flush()

    table.expandServerGroup('country:BH')
    expect(onServerGroupingExpandedChange).toHaveBeenCalledWith({ 'country:BH': true })
    await flush()
    expect(table.getState().serverGroupingExpanded).toEqual({ 'country:BH': true })
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('seeds initial grouping from defaultGrouping', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { defaultGrouping: ['name'], provider },
      }),
    )!
    await flush()
    expect(table.getState().grouping).toEqual(['name'])
    expect(table.getServerGroupingState().grouping).toEqual(['name'])
    expect((provider.loadGroups as any).mock.calls[0][0].groupingField).toBe('name')
    scope.stop()
  })

  it('starts in normal (ungrouped) mode when defaultGrouping is omitted or empty', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { defaultGrouping: [], provider },
      }),
    )!
    await flush()
    // Records load directly without group rows or nested levels.
    expect(provider.loadGroups).not.toHaveBeenCalled()
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)
    expect(table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.kind).toBe('records')

    // Grouping can still be enabled from the toolbar.
    const manager = (table as any)._serverGrouping
    getServerGroupingGroupByContext(table as any, manager).addGroup('name')
    await flush()
    expect(provider.loadGroups).toHaveBeenCalledTimes(1)
    expect(table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.kind).toBe('groups')
    scope.stop()
  })

  it('controlled and initial grouping state take precedence over defaultGrouping', async () => {
    const provider = makeProvider()
    const controlledGrouping = ref<string[]>(['amount'])
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        onGroupingChange: (updater) => {
          controlledGrouping.value =
            typeof updater === 'function' ? updater(controlledGrouping.value) : updater
        },
        serverGrouping: { defaultGrouping: ['name'], provider },
        state: {
          get grouping() {
            return controlledGrouping.value
          },
        },
      }),
    )!
    await flush()
    expect(table.getServerGroupingState().grouping).toEqual(['amount'])
    expect((provider.loadGroups as any).mock.calls[0][0].groupingField).toBe('amount')
    scope.stop()
  })

  it('warns on unknown grouping fields unless declared in groupBy.columns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const provider = makeProvider()
    const scope = effectScope()
    scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { defaultGrouping: ['createdAt:month'], provider },
      }),
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('createdAt:month'))
    scope.stop()

    warn.mockClear()
    const scope2 = effectScope()
    scope2.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: {
          defaultGrouping: ['createdAt:month'],
          groupBy: { columns: ['createdAt:month'] },
          provider,
        },
      }),
    )
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('createdAt:month'))
    scope2.stop()
    warn.mockRestore()
  })

  it('offers only groupable columns in the group-by control', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns: [
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'amount', enableGrouping: false, header: 'Amount' },
        ],
        data: [],
        enableRowSelection: true, //adds a display column that must not appear
        serverGrouping: { provider },
      }),
    )!
    await flush()
    expect(getServerGroupableColumns(table as any)).toEqual([{ id: 'name', label: 'Name' }])
    scope.stop()
  })

  it('supports a groupBy.columns whitelist with custom labels', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: {
          groupBy: {
            columns: ['name', 'createdAt:month'],
            getFieldLabel: (field) => (field === 'createdAt:month' ? 'Month' : 'Name'),
          },
          provider,
        },
      }),
    )!
    await flush()
    expect(getServerGroupableColumns(table as any)).toEqual([
      { id: 'name', label: 'Name' },
      { id: 'createdAt:month', label: 'Month' },
    ])
    scope.stop()
  })

  describe('column actions menu', () => {
    it('offers grouping actions for groupable columns only', async () => {
      const provider = makeProvider()
      const scope = effectScope()
      const table = scope.run(() =>
        useMantineVueTable<Sale>({
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'amount', enableGrouping: false, header: 'Amount' },
          ],
          data: [],
          serverGrouping: { provider },
        }),
      )!
      await flush()

      expect(getServerGroupingColumnActions(table as any, 'name')).toBeDefined()
      // Columns with enableGrouping disabled have no grouping actions.
      expect(getServerGroupingColumnActions(table as any, 'amount')).toBeUndefined()
      scope.stop()
    })

    it('groups a column and clears grouping for that column only', async () => {
      const provider = makeProvider()
      const scope = effectScope()
      const table = scope.run(() =>
        useMantineVueTable<Sale>({ columns, data: [], serverGrouping: { provider } }),
      )!
      await flush()

      // Grouping a column adds the first level.
      getServerGroupingColumnActions(table as any, 'name')!.addGroup('name')
      await flush()
      expect(table.getState().grouping).toEqual(['name'])

      // Grouping a second column appends a level.
      getServerGroupingColumnActions(table as any, 'amount')!.addGroup('amount')
      await flush()
      expect(table.getState().grouping).toEqual(['name', 'amount'])

      // Clearing one column removes only that grouping level.
      getServerGroupingColumnActions(table as any, 'name')!.removeGroup('name')
      await flush()
      expect(table.getState().grouping).toEqual(['amount'])

      getServerGroupingColumnActions(table as any, 'amount')!.removeGroup('amount')
      await flush()
      expect(table.getState().grouping).toEqual([])
      scope.stop()
    })

    it('hides the actions for static grouping or when disabled', async () => {
      const provider = makeProvider()
      const scope = effectScope()
      // A static serverGrouping.grouping array cannot be changed from the UI.
      const staticTable = scope.run(() =>
        useMantineVueTable<Sale>({
          columns,
          data: [],
          serverGrouping: { grouping: ['name'], provider },
        }),
      )!
      await flush()
      expect(getServerGroupingColumnActions(staticTable as any, 'name')).toBeUndefined()

      const disabledTable = scope.run(() =>
        useMantineVueTable<Sale>({
          columns,
          data: [],
          serverGrouping: { groupBy: { showInColumnActions: false }, provider },
        }),
      )!
      await flush()
      expect(getServerGroupingColumnActions(disabledTable as any, 'name')).toBeUndefined()
      scope.stop()
    })

    it('is absent without server grouping (client-side grouping unaffected)', () => {
      const scope = effectScope()
      const table = scope.run(() =>
        useMantineVueTable<Sale>({ columns, data: [], enableGrouping: true }),
      )!
      expect(getServerGroupingColumnActions(table as any, 'name')).toBeUndefined()
      scope.stop()
    })
  })

  it('group-by context mutations update grouping and reload the hierarchy', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { defaultGrouping: ['name'], provider },
      }),
    )!
    await flush()
    const manager = (table as any)._serverGrouping
    const context = () => getServerGroupingGroupByContext(table as any, manager)

    table.expandServerGroup('name:BH')
    await flush()

    context().addGroup('amount')
    await flush()
    expect(table.getState().grouping).toEqual(['name', 'amount'])
    // A grouping change resets expansion and reloads the root.
    expect(table.getState().serverGroupingExpanded).toEqual({})
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].grouping).toEqual(['name', 'amount'])

    context().moveGroup('amount', -1)
    await flush()
    expect(table.getState().grouping).toEqual(['amount', 'name'])

    context().removeGroup('amount')
    await flush()
    expect(table.getState().grouping).toEqual(['name'])

    context().clearGrouping()
    await flush()
    expect(table.getState().grouping).toEqual([])
    // In normal table mode, records load at the root.
    expect(table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.kind).toBe('records')
    scope.stop()
  })

  it('changing one path page size does not affect other paths (independent page-size state)', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], initialPageSize: 5, provider },
      }),
    )!
    await flush()
    table.expandServerGroup('country:BH')
    table.expandServerGroup('country:US')
    await flush()

    table.setServerGroupingPagination('country:BH', { pageIndex: 0, pageSize: 25 })
    await flush()
    expect(table.getServerGroupingPathState('country:BH')?.pagination.pageSize).toBe(25)
    expect(table.getServerGroupingPathState('country:US')?.pagination.pageSize).toBe(5)
    expect(
      table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageSize,
    ).toBe(5)
    scope.stop()
  })

  it('validates the configured page size and falls back to 10', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], initialPageSize: -3 as any, provider },
      }),
    )!
    await flush()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('positive integer'))
    expect(
      table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageSize,
    ).toBe(10)
    warn.mockRestore()
    scope.stop()
  })

  it('applies the configured page size to every newly created level', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], initialPageSize: 7, provider },
      }),
    )!
    await flush()
    table.expandServerGroup('country:BH')
    await flush()
    expect(
      table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageSize,
    ).toBe(7)
    expect(table.getServerGroupingPathState('country:BH')?.pagination.pageSize).toBe(7)
    scope.stop()
  })

  it('drives the root level from the table pagination state and reports rowCount', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], initialPageSize: 5, provider },
      }),
    )!
    await flush()
    // The toolbar falls back to the root total for options.rowCount.
    expect(table.getState().pagination).toMatchObject({ pageIndex: 0, pageSize: 5 })
    expect(table.options.rowCount).toBe(2)

    // Standard toolbar pagination reloads the root.
    table.setPageIndex(1)
    await flush()
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].pagination.pageIndex).toBe(1)
    table.setPageSize(25)
    await flush()
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].pagination.pageSize).toBe(25)
    // Nested levels keep the configured fixed page size.
    table.expandServerGroup('country:BH')
    await flush()
    expect(table.getServerGroupingPathState('country:BH')?.pagination.pageSize).toBe(5)
    scope.stop()
  })

  it('sends table sorting, column filters, and the global filter to the provider', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [],
        serverGrouping: { grouping: ['country'], provider, sortingMode: 'shared' },
      }),
    )!
    await flush()
    table.expandServerGroup('country:BH')
    await flush()

    table.setSorting([{ desc: true, id: 'amount' }])
    await flush()
    // Shared sorting reaches group and record levels.
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].sorting).toEqual([
      { desc: true, id: 'amount' },
    ])
    expect((provider.loadRecords as any).mock.calls.at(-1)[0].sorting).toEqual([
      { desc: true, id: 'amount' },
    ])

    table.setPageIndex(1)
    await flush()
    table.setGlobalFilter('acme')
    await flush()
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].globalFilter).toBe('acme')
    // A filter change resets the root to the first page.
    expect(table.getState().pagination.pageIndex).toBe(0)

    table.setColumnFilters([{ id: 'name', value: 'x' }])
    await flush()
    expect((provider.loadGroups as any).mock.calls.at(-1)[0].columnFilters).toEqual([
      { id: 'name', value: 'x' },
    ])
    expect((provider.loadRecords as any).mock.calls.at(-1)[0].columnFilters).toEqual([
      { id: 'name', value: 'x' },
    ])
    scope.stop()
  })

  it('sorting and filtering work in ungrouped (normal) mode too', async () => {
    const provider = makeProvider()
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({ columns, data: [], serverGrouping: { provider } }),
    )!
    await flush()
    expect(provider.loadRecords).toHaveBeenCalledTimes(1)

    table.setSorting([{ desc: false, id: 'name' }])
    await flush()
    expect((provider.loadRecords as any).mock.calls.at(-1)[0].sorting).toEqual([
      { desc: false, id: 'name' },
    ])

    table.setGlobalFilter('needle')
    await flush()
    expect((provider.loadRecords as any).mock.calls.at(-1)[0].globalFilter).toBe('needle')

    table.setColumnFilters([{ id: 'amount', value: [1, 5] }])
    await flush()
    expect((provider.loadRecords as any).mock.calls.at(-1)[0].columnFilters).toEqual([
      { id: 'amount', value: [1, 5] },
    ])
    scope.stop()
  })

  describe('row selection', () => {
    const setupSelection = async (
      serverGrouping: Record<string, unknown> = {},
      tableOptions: Record<string, unknown> = {},
    ) => {
      const provider = makeProvider()
      const scope = effectScope()
      const table = scope.run(() =>
        useMantineVueTable<Sale>({
          columns,
          data: [],
          enableRowSelection: true,
          serverGrouping: { grouping: ['country'], provider, ...serverGrouping } as any,
          ...tableOptions,
        }),
      )!
      await flush()
      return { provider, scope, table }
    }

    it('only counts loaded records inside expanded groups as selectable', async () => {
      const { scope, table } = await setupSelection()
      // Before expansion, no selectable record rows are visible.
      expect(table.getServerGroupingSelectionSummary()).toMatchObject({
        isAll: false,
        isSome: false,
        selectableCount: 0,
      })

      table.expandServerGroup('country:BH')
      await flush()
      expect(table.getServerGroupingSelectionSummary().selectableCount).toBe(1)
      scope.stop()
    })

    it('header selection selects every loaded record in expanded groups only', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      await flush()

      table.toggleAllServerGroupingRecordsSelected(true)
      await flush()
      const summary = table.getServerGroupingSelectionSummary()
      expect(summary.isAll).toBe(true)
      expect(summary.selectedCount).toBe(1)
      // A collapsed sibling does not contribute selectable rows.
      expect(Object.keys(table.getState().rowSelection)).toHaveLength(1)

      table.toggleAllServerGroupingRecordsSelected(false)
      await flush()
      expect(table.getState().rowSelection).toEqual({})
      scope.stop()
    })

    it('reports the indeterminate state when only some records are selected', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      table.expandServerGroup('country:US')
      await flush()
      expect(table.getServerGroupingSelectionSummary().selectableCount).toBe(2)

      const [firstRow] = (table as any)._serverGrouping.getRecordRows('country:BH')
      table.setRowSelection({ [firstRow.id]: true })
      await flush()
      expect(table.getServerGroupingSelectionSummary()).toMatchObject({
        isAll: false,
        isSome: true,
        selectedCount: 1,
      })
      scope.stop()
    })

    it('keeps selection when a group is collapsed (default) and surfaces it', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      await flush()
      table.toggleAllServerGroupingRecordsSelected(true)
      await flush()
      const selectedBefore = { ...table.getState().rowSelection }

      table.collapseServerGroup('country:BH')
      await flush()
      // Collapsing preserves selection while removing records from the header scope.
      expect(table.getState().rowSelection).toEqual(selectedBefore)
      const summary = table.getServerGroupingSelectionSummary()
      expect(summary.selectableCount).toBe(0)
      expect(summary.isAll).toBe(false)
      expect(summary.isSome).toBe(true)
      expect(summary.selectedRowIds).toHaveLength(1)
      scope.stop()
    })

    it('clears a collapsed group selection when clearOnCollapse is enabled', async () => {
      const { scope, table } = await setupSelection({ selection: { clearOnCollapse: true } })
      table.expandServerGroup('country:BH')
      table.expandServerGroup('country:US')
      await flush()
      table.toggleAllServerGroupingRecordsSelected(true)
      await flush()
      expect(Object.keys(table.getState().rowSelection)).toHaveLength(2)

      table.collapseServerGroup('country:BH')
      await flush()
      // Only the collapsed group's records are deselected.
      expect(Object.keys(table.getState().rowSelection)).toEqual(['country:US::0'])
      scope.stop()
    })

    it('unchecking the header clears everything, including off-screen selections', async () => {
      const loadAllMatchingRowIds = vi.fn(async () => ['a', 'b', 'c'])
      const { scope, table } = await setupSelection({
        // Ids mode accumulates matching ids in rowSelection.
        selection: { enableSelectAllMatching: true, loadAllMatchingRowIds, selectAllMode: 'ids' },
      })
      table.expandServerGroup('country:BH')
      await flush()
      table.toggleAllServerGroupingRecordsSelected(true)
      await table.selectAllMatchingServerGroupingRecords()
      await flush()
      // The loaded record and every matching id are selected.
      expect(Object.keys(table.getState().rowSelection)).toHaveLength(4)
      expect(table.getServerGroupingSelectionSummary().isAll).toBe(true)

      table.toggleAllServerGroupingRecordsSelected(false)
      await flush()
      // Unchecking also clears selected ids that are off screen.
      expect(table.getState().rowSelection).toEqual({})
      scope.stop()
    })

    it('unchecking the header also clears records of collapsed groups', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      await flush()
      table.toggleAllServerGroupingRecordsSelected(true)
      await flush()
      table.collapseServerGroup('country:BH')
      await flush()

      table.toggleAllServerGroupingRecordsSelected(false)
      await flush()
      expect(table.getState().rowSelection).toEqual({})
      scope.stop()
    })

    it('respects enableRowSelection predicates', async () => {
      const { scope, table } = await setupSelection(
        {},
        { enableRowSelection: (row: any) => row.original.name !== 'r1' },
      )
      table.expandServerGroup('country:BH')
      await flush()
      expect(table.getServerGroupingSelectionSummary().selectableCount).toBe(0)
      scope.stop()
    })

    it('selects all matching records as a query — no ids fetched or stored', async () => {
      const loadAllMatchingRowIds = vi.fn(async () => ['1', '2', '3'])
      const { scope, table } = await setupSelection({
        selection: { enableSelectAllMatching: true, loadAllMatchingRowIds },
      })
      table.expandServerGroup('country:BH')
      await flush()

      await table.selectAllMatchingServerGroupingRecords()
      await flush()
      // Query mode never asks the server for ids.
      expect(loadAllMatchingRowIds).not.toHaveBeenCalled()
      expect(table.getState().rowSelection).toEqual({})
      expect(table.getServerGroupingSelectAllState()).toEqual({
        active: true,
        excludedRowIds: [],
      })

      const summary = table.getServerGroupingSelectionSummary()
      expect(summary).toMatchObject({ isAll: true, isSelectAllMatching: true, mode: 'exclude' })

      // Bulk actions receive the query rather than a list of ids.
      expect(table.getServerGroupingSelectionPayload()).toMatchObject({
        excludedRowIds: [],
        grouping: ['country'],
        mode: 'exclude',
        rowIds: [],
      })
      scope.stop()
    })

    it('tracks deselections as exclusions while a query selection is active', async () => {
      const { scope, table } = await setupSelection({
        selection: { enableSelectAllMatching: true },
      })
      table.expandServerGroup('country:BH')
      await flush()
      await table.selectAllMatchingServerGroupingRecords()
      await flush()

      const [row] = (table as any)._serverGrouping.getRecordRows('country:BH')
      // Unchecking a visible row records an exclusion.
      getMVT_RowSelectionHandler({ row, table: table as any })(new Event('change'))
      await flush()
      expect(table.getServerGroupingSelectAllState()).toEqual({
        active: true,
        excludedRowIds: [row.id],
      })
      const summary = table.getServerGroupingSelectionSummary()
      expect(summary).toMatchObject({ isAll: false, isSome: true, mode: 'exclude' })
      expect(table.getServerGroupingSelectionPayload().excludedRowIds).toEqual([row.id])

      // Rechecking removes the exclusion.
      getMVT_RowSelectionHandler({ row, table: table as any })(new Event('change'))
      await flush()
      expect(table.getServerGroupingSelectAllState().excludedRowIds).toEqual([])
      scope.stop()
    })

    it('unchecking the header leaves query mode entirely', async () => {
      const { scope, table } = await setupSelection({
        selection: { enableSelectAllMatching: true },
      })
      table.expandServerGroup('country:BH')
      await flush()
      await table.selectAllMatchingServerGroupingRecords()
      await flush()

      table.toggleAllServerGroupingRecordsSelected(false)
      await flush()
      expect(table.getServerGroupingSelectAllState()).toEqual({
        active: false,
        excludedRowIds: [],
      })
      expect(table.getServerGroupingSelectionSummary().mode).toBe('include')
      scope.stop()
    })

    it('drops a query selection when the filters it was made under change', async () => {
      const { scope, table } = await setupSelection({
        selection: { enableSelectAllMatching: true },
      })
      await table.selectAllMatchingServerGroupingRecords()
      await flush()
      expect(table.getServerGroupingSelectAllState().active).toBe(true)

      table.setGlobalFilter('narrower')
      await flush()
      // An all-matching selection must not survive a query change.
      expect(table.getServerGroupingSelectAllState().active).toBe(false)
      scope.stop()
    })

    it('still supports materializing ids for small datasets (selectAllMode: ids)', async () => {
      const loadAllMatchingRowIds = vi.fn(async () => ['1', '2', '3'])
      const { scope, table } = await setupSelection({
        selection: {
          enableSelectAllMatching: true,
          loadAllMatchingRowIds,
          selectAllMode: 'ids',
        },
      })
      await table.selectAllMatchingServerGroupingRecords()
      await flush()
      expect(loadAllMatchingRowIds).toHaveBeenCalledTimes(1)
      expect(table.getState().rowSelection).toEqual({ 1: true, 2: true, 3: true })
      expect(table.getServerGroupingSelectionPayload().mode).toBe('include')
      scope.stop()
    })

    it('works in ungrouped mode (records at the root)', async () => {
      const { scope, table } = await setupSelection({ grouping: [] })
      expect(table.getServerGroupingSelectionSummary().selectableCount).toBe(1)

      table.toggleAllServerGroupingRecordsSelected(true)
      await flush()
      expect(table.getServerGroupingSelectionSummary().isAll).toBe(true)
      scope.stop()
    })

    it('keeps display columns (row select) leading while grouping is active', async () => {
      const { scope, table } = await setupSelection({
        defaultGrouping: ['country'],
        grouping: undefined,
      })
      // Server grouping fields must not trigger TanStack's grouped-column reorder.
      expect(table.getState().columnOrder[0]).toBe('mvt-row-select')
      expect((table as any).getVisibleLeafColumns().map((column: any) => column.id)[0]).toBe(
        'mvt-row-select',
      )
      scope.stop()
    })

    it('toggles a single record without going through the (empty) row model', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      await flush()
      const [row] = (table as any)._serverGrouping.getRecordRows('country:BH')

      // Provider rows are selected outside TanStack's row model.
      expect(() =>
        getMVT_RowSelectionHandler({ row, table: table as any })(new Event('change')),
      ).not.toThrow()
      expect(table.getState().rowSelection).toEqual({ [row.id]: true })

      getMVT_RowSelectionHandler({ row, table: table as any })(new Event('change'))
      expect(table.getState().rowSelection).toEqual({})
      scope.stop()
    })

    it('supports shift-click range selection across loaded records', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      table.expandServerGroup('country:US')
      await flush()
      const manager = (table as any)._serverGrouping
      const first = manager.getRecordRows('country:BH')[0]
      const second = manager.getRecordRows('country:US')[0]

      getMVT_RowSelectionHandler({ row: first, table: table as any })(new Event('change'))
      const shiftEvent = new Event('change') as any
      shiftEvent.shiftKey = true
      getMVT_RowSelectionHandler({ row: second, table: table as any })(shiftEvent)

      expect(Object.keys(table.getState().rowSelection).sort()).toEqual(
        [first.id, second.id].sort(),
      )
      scope.stop()
    })

    it('keeps grouped-column values visible on record rows', async () => {
      const provider = makeProvider()
      const scope = effectScope()
      const table = scope.run(() =>
        useMantineVueTable<Sale>({
          columns,
          data: [],
          // `name` is both the grouping field and a visible column.
          serverGrouping: { defaultGrouping: ['name'], provider },
        }),
      )!
      await flush()
      table.expandServerGroup('name:BH')
      await flush()

      const [row] = (table as any)._serverGrouping.getRecordRows('name:BH')
      const cell = row.getAllCells().find((candidate: any) => candidate.column.id === 'name')
      // Server-grouped leaf cells must ignore TanStack placeholder metadata.
      expect(cell.getValue()).toBe('r1')
      expect(cell.getIsPlaceholder()).toBe(true)
      expect(table.getState().grouping).toEqual(['name'])
      scope.stop()
    })

    it('keeps record row ids stable across re-reads (single source of truth)', async () => {
      const { scope, table } = await setupSelection()
      table.expandServerGroup('country:BH')
      await flush()
      const manager = (table as any)._serverGrouping
      // Cached reads return stable row objects and ids.
      expect(manager.getRecordRows('country:BH')).toBe(manager.getRecordRows('country:BH'))
      // Without rowId, ids fall back to the path-scoped index.
      expect(manager.getRecordRows('country:BH')[0].id).toBe('country:BH::0')
      scope.stop()
    })
  })

  it('leaves client-side grouping untouched when serverGrouping is omitted', () => {
    const scope = effectScope()
    const table = scope.run(() =>
      useMantineVueTable<Sale>({
        columns,
        data: [{ amount: 1, id: 1, name: 'a' }],
        enableGrouping: true,
      }),
    )!
    expect(table.options.enableGrouping).toBe(true)
    expect(table.options.manualGrouping).toBeUndefined()
    expect((table as any)._serverGrouping).toBeUndefined()
    expect(table.getRowModel().rows).toHaveLength(1)
    scope.stop()
  })
})
