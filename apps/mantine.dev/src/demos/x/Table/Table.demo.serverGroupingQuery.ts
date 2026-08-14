import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'

interface Order {
  customer: string
  id: number
  status: string
  total: number
}

const STATUSES = ['Pending', 'Paid', 'Shipped']
const CUSTOMERS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Stark', 'Wayne']

let VERSION = 0

const makeDb = (): Order[] =>
  Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    customer: `${CUSTOMERS[(i * 5) % CUSTOMERS.length]}${VERSION ? ` (v${VERSION + 1})` : ''}`,
    status: STATUSES[i % STATUSES.length],
    total: 100 + ((i * 37) % 500),
  }))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const searchOrders = (orders: Order[], search: string) => {
  if (!search) return orders
  const needle = search.toLowerCase()
  return orders.filter((order) =>
    [order.customer, order.status, String(order.total)].some((value) =>
      value.toLowerCase().includes(needle),
    ),
  )
}

const sortOrders = (orders: Order[], sort: { desc: boolean; id: string } | undefined) => {
  if (!sort) return orders
  return [...orders].sort((a, b) => {
    const av = a[sort.id as keyof Order]
    const bv = b[sort.id as keyof Order]
    const result =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true })
    return sort.desc ? -result : result
  })
}

async function apiGroups(params: {
  groupBy: string
  page: number
  pageSize: number
  search: string
  sort?: { desc: boolean; id: string }
}) {
  await sleep(500)
  const db = searchOrders(makeDb(), params.search)
  const values = [...new Set(db.map((order) => String(order[params.groupBy as keyof Order])))]
  let groups = values.sort().map((value) => ({
    count: db.filter((order) => String(order[params.groupBy as keyof Order]) === value).length,
    value,
  }))
  if (params.sort) {
    const desc = params.sort.desc
    groups = [...groups].sort((a, b) => (desc ? -1 : 1) * a.value.localeCompare(b.value))
  }
  const start = params.page * params.pageSize
  return { items: groups.slice(start, start + params.pageSize), total: groups.length }
}

async function apiRecords(params: {
  page: number
  pageSize: number
  search: string
  sort?: { desc: boolean; id: string }
  status: unknown
}) {
  await sleep(500)
  const scoped = makeDb().filter(
    (order) => params.status === undefined || order.status === params.status,
  )
  const db = sortOrders(searchOrders(scoped, params.search), params.sort)
  const start = params.page * params.pageSize
  return { items: db.slice(start, start + params.pageSize), total: db.length }
}

/**
 * Minimal stand-in for TanStack Query's QueryClient so the demo runs without
 * the dependency. The displayed code uses the real @tanstack/vue-query API it is identical except for the imports.
 */
interface CacheEntry {
  promise: Promise<unknown>
  updatedAt: number
}
class DemoQueryClient {
  private cache = new Map<string, CacheEntry>()

  fetchQuery<T>(options: {
    queryFn: () => Promise<T>
    queryKey: unknown[]
    staleTime?: number
  }): Promise<T> {
    const key = JSON.stringify(options.queryKey)
    const entry = this.cache.get(key)
    if (entry && Date.now() - entry.updatedAt <= (options.staleTime ?? 0)) {
      return entry.promise as Promise<T>
    }
    const promise = options.queryFn()
    this.cache.set(key, { promise, updatedAt: Date.now() })
    promise.catch(() => this.cache.delete(key))
    return promise
  }

  invalidateQueries(filters: { queryKey: unknown[] }): void {
    const prefix = JSON.stringify(filters.queryKey).slice(0, -1)
    this.cache.forEach((_entry, key) => {
      if (key.startsWith(prefix)) this.cache.delete(key)
    })
  }
}

const columns: MVT_ColumnDef<Order>[] = [
  { accessorKey: 'customer', enableGrouping: false, header: 'Customer' },
  { accessorKey: 'status', header: 'Status', size: 120 },
  { accessorKey: 'total', enableGrouping: false, header: 'Total', size: 100 },
]

const code = `
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Order {
  customer: string
  id: number
  status: string
  total: number
}

// Your API can use any response shape. Both endpoints receive the current
// sorting and search so grouped and ungrouped views stay consistent:
declare function apiGroups(params: {
  groupBy: string
  page: number
  pageSize: number
  search: string
  sort?: { desc: boolean; id: string }
}): Promise<{ items: { count: number; value: string }[]; total: number }>

declare function apiRecords(params: {
  page: number
  pageSize: number
  search: string
  sort?: { desc: boolean; id: string }
  status: unknown
}): Promise<{ items: Order[]; total: number }>

const columns: MVT_ColumnDef<Order>[] = [
  { accessorKey: 'customer', enableGrouping: false, header: 'Customer' },
  { accessorKey: 'status', header: 'Status', size: 120 },
  { accessorKey: 'total', enableGrouping: false, header: 'Total', size: 100 },
]

// TanStack Query owns caching and deduplication. Leave the table's built-in
// \`serverGrouping.cache\` off and route every provider load through
// \`queryClient.fetchQuery\` instead.
const queryClient = useQueryClient()

const provider = createServerGroupingProvider({
  // The query key must include every request-affecting input — pagination,
  // sorting, and filters — so cached pages never mix up results.
  loadGroups: ({ globalFilter, groupingField, pagination, sorting }) =>
    queryClient.fetchQuery({
      queryKey: [
        'orders',
        'groups',
        groupingField,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        globalFilter ?? '',
      ],
      queryFn: () =>
        apiGroups({
          groupBy: groupingField,
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          search: globalFilter ?? '',
          sort: sorting[0],
        }),
      staleTime: 30_000,
    }),
  groups: (response) => response.items,
  groupRowCount: (response) => response.total,
  groupId: (group) => group.value,
  groupLabel: (group) => group.value,
  groupValue: (group) => group.value, //sent back as \`parentGroup.value\`
  groupCount: (group) => group.count,

  loadRecords: ({ globalFilter, pagination, parentGroup, sorting }) =>
    queryClient.fetchQuery({
      queryKey: [
        'orders',
        'records',
        parentGroup?.id,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        globalFilter ?? '',
      ],
      queryFn: () =>
        apiRecords({
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          search: globalFilter ?? '',
          sort: sorting[0],
          status: parentGroup?.value,
        }),
      staleTime: 30_000,
    }),
  records: (response) => response.items,
  recordRowCount: (response) => response.total,
  rowId: (row) => String(row.id),
})

const table = useMantineVueTable<Order>({
  columns,
  data: [],
  serverGrouping: {
    defaultGrouping: ['status'],
    provider,
    sortingMode: 'shared',
    initialPageSize: 5,
  },
})

// Invalidate Query's cache, then tell the table to reload every visible level.
const refresh = () => {
  queryClient.invalidateQueries({ queryKey: ['orders'] })
  table.reloadServerGrouping()
}
</script>

<template>
  <div>
    <Button size="xs" variant="default" mb="sm" @click="refresh">Refresh</Button>
    <MantineVueTable :table="table" />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'TableServerGroupingQueryDemo',
  setup() {
    const queryClient = new DemoQueryClient()

    const provider = createServerGroupingProvider<
      Order,
      { count: number; value: string },
      { items: { count: number; value: string }[]; total: number },
      { items: Order[]; total: number }
    >({
      // The query key must include every request-affecting input.
      loadGroups: ({ globalFilter, groupingField, pagination, sorting }) =>
        queryClient.fetchQuery({
          queryKey: [
            'orders',
            'groups',
            groupingField,
            pagination.pageIndex,
            pagination.pageSize,
            sorting,
            globalFilter ?? '',
          ],
          queryFn: () =>
            apiGroups({
              groupBy: groupingField,
              page: pagination.pageIndex,
              pageSize: pagination.pageSize,
              search: (globalFilter as string) ?? '',
              sort: sorting[0],
            }),
          staleTime: 30_000,
        }),
      groups: (response) => response.items,
      groupRowCount: (response) => response.total,
      groupId: (group) => group.value,
      groupLabel: (group) => group.value,
      groupValue: (group) => group.value,
      groupCount: (group) => group.count,

      loadRecords: ({ globalFilter, pagination, parentGroup, sorting }) =>
        queryClient.fetchQuery({
          queryKey: [
            'orders',
            'records',
            parentGroup?.id,
            pagination.pageIndex,
            pagination.pageSize,
            sorting,
            globalFilter ?? '',
          ],
          queryFn: () =>
            apiRecords({
              page: pagination.pageIndex,
              pageSize: pagination.pageSize,
              search: (globalFilter as string) ?? '',
              sort: sorting[0],
              status: parentGroup?.value,
            }),
          staleTime: 30_000,
        }),
      records: (response) => response.items,
      recordRowCount: (response) => response.total,
      rowId: (row) => String(row.id),
    })

    const table = useMantineVueTable<Order>({
      columns,
      data: [],
      serverGrouping: {
        defaultGrouping: ['status'],
        provider,
        initialPageSize: 5,
        sortingMode: 'shared',
      },
    })

    const refresh = () => {
      VERSION += 1
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      table.reloadServerGrouping()
    }

    return () =>
      h('div', [
        h(Group, { mb: 'sm' }, () =>
          h(Button, { onClick: refresh, size: 'xs', variant: 'default' }, () => 'Refresh'),
        ),
        h(MantineVueTable, { table }),
      ])
  },
})

export const serverGroupingQuery: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
