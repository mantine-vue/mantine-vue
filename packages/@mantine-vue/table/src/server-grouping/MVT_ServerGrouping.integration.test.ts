import { defineComponent, h, nextTick } from 'vue'

import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MantineProvider } from '@mantine-vue/core'

import MantineVueTable from '../components/MantineVueTable.vue'
import { useMantineVueTable } from '../hooks/useMantineVueTable'
import { type MVT_ColumnDef, type MVT_TableInstance, type MVT_TableOptions } from '../types'
import { createServerGroupingProvider } from './createServerGroupingProvider'
import { MVT_SERVER_GROUPING_ROOT_PATH_ID } from './serverGrouping.types'

const flush = async (wrapper?: VueWrapper<any>) => {
  await flushPromises()
  await nextTick()
  await flushPromises()
  wrapper?.vm.$forceUpdate()
  await nextTick()
}

interface Sale {
  amount: number
  id: number
  name: string
}

const columns: MVT_ColumnDef<Sale>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    serverGrouping: {
      getValue: ({ group }) => (group.meta as any)?.aggregates?.amount,
      Cell: ({ value }: { value: unknown }) => (value === undefined ? null : `$${value}`),
    },
  },
]

interface FakeBackendOptions {
  failPaths?: Set<string>
}

/** Two-level fake backend: country groups → records. Custom response shapes. */
const makeBackend = ({ failPaths = new Set() }: FakeBackendOptions = {}) => {
  const loadGroups = vi.fn(async ({ groupingField, pagination, pathId }: any) => {
    if (failPaths.has(pathId)) throw new Error(`group load failed: ${pathId}`)
    return {
      payload: {
        entries: [
          {
            aggregate_amount: 100 + pagination.pageIndex,
            display: `Bahrain p${pagination.pageIndex}`,
            record_count: 4,
            uid: `BH-p${pagination.pageIndex}`,
          },
          {
            aggregate_amount: 200 + pagination.pageIndex,
            display: `USA p${pagination.pageIndex}`,
            record_count: 6,
            uid: `US-p${pagination.pageIndex}`,
          },
        ],
        field: groupingField,
        grand_total: 30,
      },
    }
  })
  const loadRecords = vi.fn(async ({ pagination, parentGroup, pathId }: any) => {
    if (failPaths.has(pathId)) throw new Error(`record load failed: ${pathId}`)
    return {
      result: {
        matches: [
          {
            amount: 10,
            id: pagination.pageIndex * 100 + 1,
            name: `${parentGroup?.id ?? 'root'} rec ${pagination.pageIndex * 100 + 1}`,
          },
          {
            amount: 20,
            id: pagination.pageIndex * 100 + 2,
            name: `${parentGroup?.id ?? 'root'} rec ${pagination.pageIndex * 100 + 2}`,
          },
        ],
        total_hits: 25,
      },
    }
  })
  const provider = createServerGroupingProvider<Sale, any, any, any>({
    groupCount: (group) => group.record_count,
    groupId: (group) => group.uid,
    groupLabel: (group) => group.display,
    groupMeta: (group) => ({ aggregates: { amount: group.aggregate_amount } }),
    groupRowCount: (response) => response.payload.grand_total,
    groups: (response) => response.payload.entries,
    loadGroups,
    loadRecords,
    recordRowCount: (response) => response.result.total_hits,
    records: (response) => response.result.matches,
    rowId: (row) => String(row.id),
  })
  return { loadGroups, loadRecords, provider }
}

const mountTable = (
  options: Partial<MVT_TableOptions<Sale>> & { serverGrouping: any },
  slots?: Record<string, any>,
) => {
  let table!: MVT_TableInstance<Sale>
  const serverGrouping = {
    ...options.serverGrouping,
    groupBy: options.serverGrouping.groupBy ?? {
      columns: options.serverGrouping.grouping ?? [],
    },
  }
  const wrapper = mount(
    defineComponent({
      setup() {
        table = useMantineVueTable<Sale>({
          columns,
          data: [],
          ...options,
          serverGrouping,
        } as MVT_TableOptions<Sale>)
        return () =>
          h(MantineProvider, { env: 'test' }, () => h(MantineVueTable, { table } as any, slots))
      },
    }),
  )
  return { table: table!, wrapper }
}

const findExpandButton = (wrapper: VueWrapper<any>, label: string) =>
  wrapper.findAll('button').find((button) => button.attributes('aria-label') === `Expand ${label}`)

describe('MVT server grouping integration', () => {
  it('loads and renders the root group page with labels, counts, and aggregates', async () => {
    const { provider, loadGroups } = makeBackend()
    const { wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)

    expect(loadGroups).toHaveBeenCalledTimes(1)
    const text = wrapper.text()
    expect(text).toContain('Bahrain p0')
    expect(text).toContain('USA p0')
    expect(text).toContain('(4)')
    expect(text).toContain('$100') //aggregate cell
    // Group rows expose hierarchy semantics.
    const groupRow = wrapper.find('tr[data-depth="0"]')
    expect(groupRow.exists()).toBe(true)
    expect(groupRow.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('expands a group lazily and renders final records', async () => {
    const { provider, loadRecords } = makeBackend()
    const { wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    expect(loadRecords).not.toHaveBeenCalled()

    await findExpandButton(wrapper, 'Bahrain p0')!.trigger('click')
    await flush(wrapper)

    expect(loadRecords).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('BH-p0 rec 1')
    expect(wrapper.text()).toContain('BH-p0 rec 2')
    wrapper.unmount()
  })

  it('loads multiple nested group levels', async () => {
    const { provider, loadGroups } = makeBackend()
    const { table, wrapper } = mountTable({
      serverGrouping: { grouping: ['country', 'salesperson'], provider },
    })
    await flush(wrapper)

    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)
    expect(loadGroups).toHaveBeenCalledTimes(2)
    expect(loadGroups.mock.calls[1][0].groupingField).toBe('salesperson')
    // Nested group rows render one level deeper.
    expect(wrapper.find('tr[data-depth="1"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('paginates sibling groups independently through the built-in controls', async () => {
    const { provider, loadRecords } = makeBackend()
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    table.expandServerGroup('country:US-p0')
    await flush(wrapper)

    table.setServerGroupingPagination('country:BH-p0', { pageIndex: 1 })
    await flush(wrapper)

    // Each sibling keeps independent pagination.
    expect(wrapper.text()).toContain('BH-p0 rec 101')
    expect(wrapper.text()).toContain('US-p0 rec 1')
    expect(table.getServerGroupingPathState('country:US-p0')?.pagination.pageIndex).toBe(0)
    expect(
      table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.pagination.pageIndex,
    ).toBe(0)
    expect(loadRecords).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('renders the built-in nested pagination controls', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)

    // Records: 25 total with a page size of 10.
    expect(wrapper.text()).toContain('1-10 of 25')
    const nextButtons = wrapper
      .findAll('button')
      .filter((button) => button.attributes('aria-label') === 'Go to next page')
    expect(nextButtons.length).toBeGreaterThan(0)
    await nextButtons[0].trigger('click')
    await flush(wrapper)
    expect(table.getServerGroupingPathState('country:BH-p0')?.pagination.pageIndex).toBe(1)
    wrapper.unmount()
  })

  it('shows an isolated error state with working retry', async () => {
    const failPaths = new Set(['country:BH-p0'])
    const { provider } = makeBackend({ failPaths })
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    table.expandServerGroup('country:US-p0')
    await flush(wrapper)

    // A failed group does not affect its sibling.
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('US-p0 rec 1')

    failPaths.clear()
    const retryButton = wrapper.findAll('button').find((button) => button.text().includes('Retry'))!
    await retryButton.trigger('click')
    await flush(wrapper)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('BH-p0 rec 1')
    wrapper.unmount()
  })

  it('protects against stale responses when pages change quickly', async () => {
    const { provider } = makeBackend()
    const gate: Record<number, (value: any) => void> = {}
    provider.loadRecords = ({ pagination }: any) =>
      new Promise((resolve) => {
        gate[pagination.pageIndex] = resolve
      })
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)
    table.setServerGroupingPagination('country:BH-p0', { pageIndex: 1 })
    await flush(wrapper)

    // The stale page must be discarded when responses arrive out of order.
    gate[1]({ result: { matches: [{ amount: 1, id: 1, name: 'PAGE-2-ROW' }], total_hits: 25 } })
    await flush(wrapper)
    gate[0]({ result: { matches: [{ amount: 1, id: 2, name: 'PAGE-1-ROW' }], total_hits: 25 } })
    await flush(wrapper)

    expect(wrapper.text()).toContain('PAGE-2-ROW')
    expect(wrapper.text()).not.toContain('PAGE-1-ROW')
    wrapper.unmount()
  })

  it('collapsing a group while its request is pending aborts it silently', async () => {
    const { provider } = makeBackend()
    let capturedSignal: AbortSignal | undefined
    provider.loadRecords = ({ signal }: any) => {
      capturedSignal = signal
      return new Promise(() => {}) //never resolves
    }
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)
    table.collapseServerGroup('country:BH-p0')
    await flush(wrapper)

    expect(capturedSignal?.aborted).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(table.getServerGroupingPathState('country:BH-p0')?.isFetching).toBe(false)
    wrapper.unmount()
  })

  it('reloads the hierarchy when grouping fields change dynamically', async () => {
    const { provider, loadGroups } = makeBackend()
    const { table, wrapper } = mountTable({
      initialState: { grouping: ['country'] },
      serverGrouping: { provider },
    })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)

    table.setGrouping(['department'])
    await flush(wrapper)

    expect(loadGroups.mock.calls.at(-1)![0].groupingField).toBe('department')
    expect(table.getState().serverGroupingExpanded).toEqual({})
    wrapper.unmount()
  })

  it('removes a grouped-alert badge immediately when its remove button is clicked', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({
      initialState: { grouping: ['name', 'amount'] },
      serverGrouping: { provider },
    })
    await flush(wrapper)

    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('Name')
    expect(alert.text()).toContain('Amount')

    const removeName = alert.findAll('button')[0]
    expect(removeName).toBeDefined()
    await removeName.trigger('click')
    await nextTick()

    expect(table.getState().grouping).toEqual(['amount'])
    expect(alert.text()).not.toContain('Name')
    expect(alert.text()).toContain('Amount')
    wrapper.unmount()
  })

  it('renders the grouped column value on final record rows', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({
      // `name` is both the grouping field and a visible column.
      serverGrouping: { defaultGrouping: ['name'], provider },
    })
    await flush(wrapper)
    table.expandServerGroup('name:BH-p0')
    await flush(wrapper)

    // The record value must render instead of a placeholder cell.
    expect(wrapper.text()).toContain('BH-p0 rec 1')
    wrapper.unmount()
  })

  it('omits the misleading row total from the selection alert while grouped', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({
      enableRowSelection: true,
      serverGrouping: { grouping: ['country'], provider },
    })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)
    table.toggleAllServerGroupingRecordsSelected(true)
    await flush(wrapper)

    // In grouped mode, rowCount counts groups rather than records.
    expect(wrapper.text()).toContain('2 row(s) selected')
    expect(wrapper.text()).not.toContain('of 30 row(s) selected')
    wrapper.unmount()
  })

  it('renders the per-column grouping action in the column actions menu', async () => {
    const { provider } = makeBackend()
    const openColumnMenu = async (wrapper: VueWrapper<any>) => {
      const menuButton = wrapper
        .findAll('button')
        .find((button) => button.attributes('aria-label') === 'Column Actions')
      expect(menuButton).toBeDefined()
      await menuButton!.trigger('click')
      await flush(wrapper)
    }

    // The grouped column exposes a scoped clear action.
    const grouped = mountTable({
      serverGrouping: {
        defaultGrouping: ['name'],
        groupBy: { columns: ['name'], getFieldLabel: () => 'Name' },
        provider,
      },
    })
    await flush(grouped.wrapper)
    await openColumnMenu(grouped.wrapper)
    expect(grouped.wrapper.text()).toContain('Clear grouping')
    expect(grouped.wrapper.text()).not.toContain('Group by Name')
    grouped.wrapper.unmount()

    // An ungrouped column exposes a group action without a clear action.
    const ungrouped = mountTable({
      serverGrouping: {
        groupBy: { columns: ['name'], getFieldLabel: () => 'Name' },
        provider,
      },
    })
    await flush(ungrouped.wrapper)
    await openColumnMenu(ungrouped.wrapper)
    expect(ungrouped.wrapper.text()).toContain('Group by')
    expect(ungrouped.wrapper.text()).not.toContain('Clear grouping')
    ungrouped.wrapper.unmount()
  })

  it('does not crash when a grouping field has no matching column', async () => {
    // Backend grouping descriptors may not have matching table columns.
    const { provider } = makeBackend()
    const { wrapper } = mountTable({
      serverGrouping: {
        defaultGrouping: ['createdAt:month'],
        groupBy: { columns: ['createdAt:month'] },
        provider,
      },
    })
    await flush(wrapper)
    // The banner falls back to the raw field id.
    expect(wrapper.text()).toContain('createdAt:month')
    wrapper.unmount()
  })

  it('renders custom slots for group labels', async () => {
    const { provider } = makeBackend()
    const { wrapper } = mountTable(
      { serverGrouping: { grouping: ['country'], provider } },
      {
        serverGroupLabel: ({ group, depth }: any) => `CUSTOM[${depth}]:${group.label}`,
      },
    )
    await flush(wrapper)
    expect(wrapper.text()).toContain('CUSTOM[0]:Bahrain p0')
    wrapper.unmount()
  })

  it('renders expanded content as flat rows of the root table (no nested tables/headers)', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)

    // The hierarchy renders as one table with one header.
    expect(wrapper.findAll('table')).toHaveLength(1)
    expect(wrapper.findAll('thead')).toHaveLength(1)
    // Record rows align directly with the root columns.
    const tbodyRows = wrapper.findAll('tbody > tr')
    expect(tbodyRows.length).toBeGreaterThan(2)
    expect(wrapper.text()).toContain('BH-p0 rec 1')
    // Indentation is limited to the group-label cell.
    expect(wrapper.find('[class*="nested-container"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('paginates the root from the bottom toolbar and keeps nested page sizes fixed', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({
      serverGrouping: { grouping: ['country'], initialPageSize: 5, provider },
    })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)

    // The root uses standard toolbar pagination and the server row count.
    expect(table.getState().pagination.pageSize).toBe(5)
    expect(table.options.rowCount).toBe(30)
    expect(wrapper.text()).toContain('1-5 of 30')
    // Nested pagination has a fixed page size.
    expect(wrapper.text()).toContain('1-5 of 25')
    expect(table.getServerGroupingPathState('country:BH-p0')?.pagination.pageSize).toBe(5)
    wrapper.unmount()
  })

  it('keeps nested rows aligned with root columns while resizing', async () => {
    const { provider } = makeBackend()
    const { table, wrapper } = mountTable({
      enableColumnResizing: true,
      serverGrouping: { grouping: ['country'], provider },
    })
    await flush(wrapper)
    table.expandServerGroup('country:BH-p0')
    await flush(wrapper)

    // Group cells share column-size variables with root body cells.
    const groupCell = wrapper.find('tr[data-depth="0"] td')
    expect(groupCell.attributes('style')).toContain('--col-name-size')
    wrapper.unmount()
  })

  it('renders the group-by toolbar and switches to normal mode when cleared', async () => {
    const { provider, loadRecords } = makeBackend()
    const { table, wrapper } = mountTable({
      serverGrouping: {
        defaultGrouping: ['country'],
        groupBy: { columns: ['country'], getFieldLabel: () => 'Country' },
        provider,
      },
    })
    await flush(wrapper)

    // The toolbar displays the active grouping level.
    expect(wrapper.find('.mvt-server-groupby-control').exists()).toBe(true)
    expect(wrapper.text()).toContain('1. Country')

    // Clearing grouping switches to a regular server-side table.
    table.setGrouping([])
    await flush(wrapper)
    expect(loadRecords.mock.calls.at(-1)![0].pathId).toBe(MVT_SERVER_GROUPING_ROOT_PATH_ID)
    expect(wrapper.find('tr[data-depth]').exists()).toBe(false) //no group rows
    expect(wrapper.text()).toContain('root rec 1') //records render directly
    wrapper.unmount()
  })

  it('supports a completely custom response shape end to end', async () => {
    // Custom response fields do not require normalized property names.
    const { provider, loadGroups } = makeBackend()
    const { wrapper } = mountTable({ serverGrouping: { grouping: ['country'], provider } })
    await flush(wrapper)
    const response = await loadGroups.mock.results[0].value
    expect(Object.keys(response)).toEqual(['payload'])
    expect(wrapper.text()).toContain('Bahrain p0')
    wrapper.unmount()
  })
})
