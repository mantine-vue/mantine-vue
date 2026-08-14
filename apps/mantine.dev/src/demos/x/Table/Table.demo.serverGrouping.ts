import { defineComponent, h } from 'vue'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_ColumnFiltersState,
  type MVT_ServerGroupCellContext,
  type MVT_SortingState,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'

interface Sale {
  amount: number
  deal: string
  id: number
  region: string
  rep: string
}

const REGIONS = ['West', 'East', 'South', 'North']
const REPS = ['Jane Doe', 'John Smith', 'Mary Jones', 'Bob Brown', 'Alice Green', 'Tom White']

const DB: Sale[] = Array.from({ length: 240 }, (_, i) => ({
  id: i + 1,
  deal: `Deal #${i + 1}`,
  region: REGIONS[i % REGIONS.length],
  rep: REPS[(i * 7) % REPS.length],
  amount: 250 + ((i * 83) % 900),
}))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface ApiGroup {
  count: number
  totalAmount: number
  value: string
}

interface QueryParams {
  columnFilters: MVT_ColumnFiltersState
  globalFilter: string
  path: { field: string; value?: unknown }[]
  sorting: MVT_SortingState
}

// The server applies the group path, the global search, and every column
// filter before grouping/paginating — so grouped and ungrouped views always
// agree on which records are in scope.
const applyQuery = (params: QueryParams): Sale[] => {
  let rows = DB.filter((sale) =>
    params.path.every((segment) => sale[segment.field as keyof Sale] === segment.value),
  )

  if (params.globalFilter) {
    const needle = params.globalFilter.toLowerCase()
    rows = rows.filter((sale) =>
      [sale.deal, sale.region, sale.rep, String(sale.amount)].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    )
  }

  params.columnFilters.forEach((filter) => {
    const value = filter.value
    if (value === undefined || value === null || value === '') return
    if (filter.id === 'amount' && Array.isArray(value)) {
      const [min, max] = value as (number | string | undefined)[]
      rows = rows.filter(
        (sale) =>
          (min === undefined || min === '' || sale.amount >= Number(min)) &&
          (max === undefined || max === '' || sale.amount <= Number(max)),
      )
    } else if (filter.id === 'region' || filter.id === 'rep') {
      rows = rows.filter((sale) => String(sale[filter.id as keyof Sale]) === String(value))
    } else {
      rows = rows.filter((sale) =>
        String(sale[filter.id as keyof Sale])
          .toLowerCase()
          .includes(String(value).toLowerCase()),
      )
    }
  })

  return rows
}

const sortRows = <T extends Record<string, any>>(rows: T[], sorting: MVT_SortingState): T[] => {
  if (!sorting.length) return rows
  const { id, desc } = sorting[0]
  return [...rows].sort((a, b) => {
    const av = a[id]
    const bv = b[id]
    const result =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true })
    return desc ? -result : result
  })
}

async function fetchGroups(
  params: QueryParams & { groupBy: string; page: number; pageSize: number },
): Promise<{ groups: ApiGroup[]; total: number }> {
  await sleep(400)
  const scoped = applyQuery(params)
  const byValue = new Map<string, Sale[]>()
  scoped.forEach((sale) => {
    const value = String(sale[params.groupBy as keyof Sale])
    byValue.set(value, [...(byValue.get(value) ?? []), sale])
  })
  let groups = [...byValue.entries()].map(([value, sales]) => ({
    count: sales.length,
    totalAmount: sales.reduce((sum, sale) => sum + sale.amount, 0),
    value,
  }))
  // Sorting a group level: `amount` sorts by the aggregate, anything else by
  // the group label.
  const groupSort = params.sorting[0]
  groups = groupSort
    ? sortRows(
        groups.map((group) => ({
          ...group,
          amount: group.totalAmount,
          [params.groupBy]: group.value,
        })),
        params.sorting,
      ).map(({ count, totalAmount, value }) => ({ count, totalAmount, value }))
    : groups.sort((a, b) => a.value.localeCompare(b.value))
  const start = params.page * params.pageSize
  return { groups: groups.slice(start, start + params.pageSize), total: groups.length }
}

async function fetchRecords(
  params: QueryParams & { page: number; pageSize: number },
): Promise<{ rows: Sale[]; total: number }> {
  await sleep(400)
  const scoped = sortRows(applyQuery(params), params.sorting)
  const start = params.page * params.pageSize
  return { rows: scoped.slice(start, start + params.pageSize), total: scoped.length }
}

const currency = (value: unknown) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : ''

const columns: MVT_ColumnDef<Sale, unknown, ApiGroup>[] = [
  { accessorKey: 'deal', enableGrouping: false, header: 'Deal', minSize: 160 },
  {
    accessorKey: 'region',
    filterVariant: 'select',
    header: 'Region',
    mantineFilterSelectProps: { data: REGIONS },
    size: 140,
  },
  {
    accessorKey: 'rep',
    filterVariant: 'select',
    header: 'Sales rep',
    mantineFilterSelectProps: { data: REPS },
    size: 160,
  },
  {
    accessorKey: 'amount',
    enableGrouping: false,
    filterVariant: 'range',
    header: 'Amount',
    size: 140,
    Cell: ({ cell }) => currency(cell.getValue()),
    serverGrouping: {
      getValue: ({ group }: Omit<MVT_ServerGroupCellContext<ApiGroup>, 'value'>) =>
        group.original.totalAmount,
      Cell: ({ value }: MVT_ServerGroupCellContext<ApiGroup>) => currency(value),
    },
  },
]

const toPath = (parentGroups: { field: string; value?: unknown }[]) =>
  parentGroups.map((group) => ({ field: group.field, value: group.value }))

const makeProvider = () =>
  createServerGroupingProvider<
    Sale,
    ApiGroup,
    { groups: ApiGroup[]; total: number },
    { rows: Sale[]; total: number }
  >({
    loadGroups: ({
      columnFilters,
      globalFilter,
      groupingField,
      pagination,
      parentGroups,
      sorting,
    }) =>
      fetchGroups({
        columnFilters,
        globalFilter: (globalFilter as string) ?? '',
        groupBy: groupingField,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        path: toPath(parentGroups),
        sorting,
      }),
    groups: (response) => response.groups,
    groupRowCount: (response) => response.total,
    groupId: (group) => group.value,
    groupLabel: (group) => group.value,
    groupValue: (group) => group.value,
    groupCount: (group) => group.count,

    loadRecords: ({ columnFilters, globalFilter, pagination, parentGroups, sorting }) =>
      fetchRecords({
        columnFilters,
        globalFilter: (globalFilter as string) ?? '',
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        path: toPath(parentGroups),
        sorting,
      }),
    records: (response) => response.rows,
    recordRowCount: (response) => response.total,
    rowId: (row) => String(row.id),
  })

const code = `
<script setup lang="ts">
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_ColumnFiltersState,
  type MVT_ServerGroupCellContext,
  type MVT_SortingState,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Sale {
  amount: number
  deal: string
  id: number
  region: string
  rep: string
}

interface ApiGroup {
  count: number
  totalAmount: number
  value: string
}

// Your API. Both endpoints receive the current sorting, column filters, and
// global filter, so grouped and ungrouped views stay consistent.
declare function fetchGroups(params: {
  columnFilters: MVT_ColumnFiltersState
  globalFilter: string
  groupBy: string
  page: number
  pageSize: number
  path: { field: string; value?: unknown }[]
  sorting: MVT_SortingState
}): Promise<{ groups: ApiGroup[]; total: number }>

declare function fetchRecords(params: {
  columnFilters: MVT_ColumnFiltersState
  globalFilter: string
  page: number
  pageSize: number
  path: { field: string; value?: unknown }[]
  sorting: MVT_SortingState
}): Promise<{ rows: Sale[]; total: number }>

const currency = (value: unknown) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : ''

// Only \`region\` and \`rep\` are groupable — columns with \`enableGrouping: false\`
// never appear in the group-by toolbar. \`filterVariant\` picks the filter UI.
const columns: MVT_ColumnDef<Sale, unknown, ApiGroup>[] = [
  { accessorKey: 'deal', enableGrouping: false, header: 'Deal', minSize: 160 },
  {
    accessorKey: 'region',
    header: 'Region',
    size: 140,
    filterVariant: 'select',
    mantineFilterSelectProps: { data: ['West', 'East', 'South', 'North'] },
  },
  {
    accessorKey: 'rep',
    header: 'Sales rep',
    size: 160,
    filterVariant: 'select',
    mantineFilterSelectProps: { data: ['Jane Doe', 'John Smith', 'Mary Jones'] },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 140,
    enableGrouping: false,
    filterVariant: 'range',
    Cell: ({ cell }) => currency(cell.getValue()),
    serverGrouping: {
      getValue: ({ group }: Omit<MVT_ServerGroupCellContext<ApiGroup>, 'value'>) =>
        group.original.totalAmount,
      Cell: ({ value }: MVT_ServerGroupCellContext<ApiGroup>) => currency(value),
    },
  },
]

const toPath = (parentGroups) =>
  parentGroups.map((group) => ({ field: group.field, value: group.value }))

const provider = createServerGroupingProvider({
  // Forward sorting + filters at every level.
  loadGroups: ({ columnFilters, globalFilter, groupingField, pagination, parentGroups, sorting }) =>
    fetchGroups({
      columnFilters,
      globalFilter: globalFilter ?? '',
      groupBy: groupingField,
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      path: toPath(parentGroups),
      sorting,
    }),
  groups: (response) => response.groups,
  groupRowCount: (response) => response.total,
  groupId: (group) => group.value,
  groupLabel: (group) => group.value,
  groupValue: (group) => group.value,
  groupCount: (group) => group.count,

  loadRecords: ({ columnFilters, globalFilter, pagination, parentGroups, sorting }) =>
    fetchRecords({
      columnFilters,
      globalFilter: globalFilter ?? '',
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      path: toPath(parentGroups),
      sorting,
    }),
  records: (response) => response.rows,
  recordRowCount: (response) => response.total,
  rowId: (row) => String(row.id),
})

const table = useMantineVueTable<Sale>({
  columns,
  data: [], // Rows come from the provider.

  // Regular table features keep working in grouped and ungrouped modes.
  enableColumnResizing: true,
  columnResizeMode: 'onChange',

  serverGrouping: {
    // Initial hierarchy: region groups → rep groups → records. Clear the levels
    // in the toolbar for a normal server-side table; add them back any time.
    defaultGrouping: ['region', 'rep'],
    provider,

    // Fixed page size for nested levels; the root level is paginated by the
    // regular bottom toolbar (and seeds its page size from here).
    initialPageSize: 5,

    // Header sorting applies to every level; filters are shared by default.
    sortingMode: 'shared',
    filteringMode: 'shared',
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableServerGroupingDemo',
  setup() {
    const table = useMantineVueTable<Sale>({
      columns,
      data: [],
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      serverGrouping: {
        defaultGrouping: ['region', 'rep'],
        provider: makeProvider(),
        initialPageSize: 5,
        sortingMode: 'shared',
        filteringMode: 'shared',
      },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const serverGrouping: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
