import { computed, defineComponent, h, ref } from 'vue'
import { Button, Code, Group, Stack, Text } from '@mantine-vue/core'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_RowSelectionState,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'

interface Sale {
  amount: number
  deal: string
  id: number
  region: string
  rep: string
}

// Fake backend (stands in for your API).
const REGIONS = ['West', 'East', 'South', 'North']
const REPS = ['Jane Doe', 'John Smith', 'Mary Jones', 'Bob Brown']

const DB: Sale[] = Array.from({ length: 160 }, (_, i) => ({
  id: i + 1,
  deal: `Deal #${i + 1}`,
  region: REGIONS[i % REGIONS.length],
  rep: REPS[(i * 3) % REPS.length],
  amount: 250 + ((i * 83) % 900),
}))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const scopedRows = (path: { field: string; value?: unknown }[]) =>
  DB.filter((sale) => path.every((segment) => sale[segment.field as keyof Sale] === segment.value))

async function fetchGroups(params: {
  groupBy: string
  page: number
  pageSize: number
  path: { field: string; value?: unknown }[]
}) {
  await sleep(350)
  const scoped = scopedRows(params.path)
  const values = [...new Set(scoped.map((sale) => String(sale[params.groupBy as keyof Sale])))]
  const groups = values.sort().map((value) => ({
    count: scoped.filter((sale) => String(sale[params.groupBy as keyof Sale]) === value).length,
    value,
  }))
  const start = params.page * params.pageSize
  return { groups: groups.slice(start, start + params.pageSize), total: groups.length }
}

async function fetchRecords(params: {
  page: number
  pageSize: number
  path: { field: string; value?: unknown }[]
}) {
  await sleep(350)
  const scoped = scopedRows(params.path)
  const start = params.page * params.pageSize
  return { rows: scoped.slice(start, start + params.pageSize), total: scoped.length }
}

// A bulk action receives the *query*, never a list of ids — this is what makes
// "select all matching records" work over millions of rows.
async function bulkArchive(payload: {
  excludedRowIds: string[]
  mode: 'exclude' | 'include'
  rowIds: string[]
}) {
  await sleep(350)
  return payload.mode === 'exclude'
    ? DB.length - payload.excludedRowIds.length
    : payload.rowIds.length
}

const columns: MVT_ColumnDef<Sale>[] = [
  { accessorKey: 'deal', enableGrouping: false, header: 'Deal' },
  { accessorKey: 'region', header: 'Region', size: 140 },
  { accessorKey: 'rep', header: 'Sales rep', size: 160 },
  { accessorKey: 'amount', enableGrouping: false, header: 'Amount', size: 120 },
]

const toPath = (parentGroups: { field: string; value?: unknown }[]) =>
  parentGroups.map((group) => ({ field: group.field, value: group.value }))

const makeProvider = () =>
  createServerGroupingProvider<Sale, { count: number; value: string }, any, any>({
    loadGroups: ({ groupingField, pagination, parentGroups }) =>
      fetchGroups({
        groupBy: groupingField,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        path: toPath(parentGroups),
      }),
    groups: (response) => response.groups,
    groupRowCount: (response) => response.total,
    groupId: (group) => group.value,
    groupLabel: (group) => group.value,
    groupValue: (group) => group.value,
    groupCount: (group) => group.count,

    loadRecords: ({ pagination, parentGroups }) =>
      fetchRecords({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        path: toPath(parentGroups),
      }),
    records: (response) => response.rows,
    recordRowCount: (response) => response.total,
    // Selection is keyed by stable row ids.
    rowId: (row) => String(row.id),
  })

const code = `
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_RowSelectionState,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Sale {
  amount: number
  deal: string
  id: number
  region: string
  rep: string
}

declare function fetchGroups(params: any): Promise<{ groups: any[]; total: number }>
declare function fetchRecords(params: any): Promise<{ rows: Sale[]; total: number }>
// A bulk endpoint that accepts the *query*, not a list of ids.
declare function bulkArchive(payload: {
  columnFilters: unknown
  excludedRowIds: string[]
  globalFilter: unknown
  grouping: string[]
  mode: 'exclude' | 'include'
  rowIds: string[]
  sorting: unknown
}): Promise<number>

const columns: MVT_ColumnDef<Sale>[] = [
  { accessorKey: 'deal', enableGrouping: false, header: 'Deal' },
  { accessorKey: 'region', header: 'Region', size: 140 },
  { accessorKey: 'rep', header: 'Sales rep', size: 160 },
  { accessorKey: 'amount', enableGrouping: false, header: 'Amount', size: 120 },
]

const provider = createServerGroupingProvider({
  loadGroups: ({ groupingField, pagination, parentGroups }) =>
    fetchGroups({
      groupBy: groupingField,
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      path: parentGroups.map((group) => ({ field: group.field, value: group.value })),
    }),
  groups: (response) => response.groups,
  groupRowCount: (response) => response.total,
  groupId: (group) => group.value,
  groupLabel: (group) => group.value,
  groupValue: (group) => group.value,
  groupCount: (group) => group.count,

  loadRecords: ({ pagination, parentGroups }) =>
    fetchRecords({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      path: parentGroups.map((group) => ({ field: group.field, value: group.value })),
    }),
  records: (response) => response.rows,
  recordRowCount: (response) => response.total,
  // selection is keyed by row id — always provide a stable one
  rowId: (row) => String(row.id),
})

// Controlled selection state (uncontrolled works too).
const rowSelection = ref<MVT_RowSelectionState>({})

const table = useMantineVueTable<Sale>({
  columns,
  data: [],

  // Checkboxes appear on record rows only — group rows never get one.
  enableRowSelection: true,
  enableSelectAll: true,

  state: {
    get rowSelection() {
      return rowSelection.value
    },
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value =
      typeof updater === 'function' ? updater(rowSelection.value) : updater
  },

  serverGrouping: {
    defaultGrouping: ['region', 'rep'],
    provider,
    initialPageSize: 5,

    selection: {
      // Shows a "Select all matching records" action in the alert banner once
      // every loaded record is selected. The default \`selectAllMode: 'query'\`
      // makes NO request and stores NO ids: the selection becomes
      // "everything matching the current filters, minus what I unchecked".
      enableSelectAllMatching: true,
    },
  },
})

const payload = computed(() => table.getServerGroupingSelectionPayload())

// Bulk actions read the payload and send the query to the server.
const archiveSelected = async () => {
  // { mode: 'exclude', rowIds: [], excludedRowIds: [...], grouping, sorting,
  //   columnFilters, globalFilter }  ← constant size, even for 10M matches
  await bulkArchive(payload.value)
}

// The header checkbox covers loaded records in *expanded* groups only:
// - checked when they are all selected
// - indeterminate when only some are
// Records in collapsed or unloaded groups are never implicitly selected.
</script>

<template>
  <div>
    <MantineVueTable :table="table" />
    <button :disabled="payload.mode === 'include' && !payload.rowIds.length" @click="archiveSelected">
      Archive selected
    </button>
    <pre>{{ payload }}</pre>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'TableServerGroupingSelectionDemo',
  setup() {
    const archivedCount = ref<number | null>(null)
    const rowSelection = ref<MVT_RowSelectionState>({})

    const table = useMantineVueTable<Sale>({
      columns,
      data: [],
      enableRowSelection: true,
      enableSelectAll: true,
      state: {
        get rowSelection() {
          return rowSelection.value
        },
      },
      onRowSelectionChange: (updater) => {
        rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
      },
      serverGrouping: {
        defaultGrouping: ['region', 'rep'],
        provider: makeProvider(),
        initialPageSize: 5,
        selection: { enableSelectAllMatching: true },
      },
    })

    // A bulk action sends a query to the server, never a list of ids.
    const payload = computed(() => table.getServerGroupingSelectionPayload())
    const archiveSelected = async () => {
      archivedCount.value = await bulkArchive(payload.value)
    }

    return () =>
      h(Stack, { gap: 'sm' } as any, () => [
        h(MantineVueTable, { table }),
        h(Group, { gap: 'sm' } as any, () => [
          h(
            Button,
            {
              disabled: payload.value.mode === 'include' && payload.value.rowIds.length === 0,
              onClick: archiveSelected,
              size: 'xs',
              variant: 'default',
            } as any,
            () => 'Archive selected',
          ),
          h(Text, { c: 'dimmed', size: 'sm' } as any, () => 'Bulk payload:'),
        ]),
        archivedCount.value !== null &&
          h(
            Text,
            { c: 'dimmed', size: 'sm' } as any,
            () => `Archived ${archivedCount.value} records`,
          ),
        h(Code, { block: true } as any, () => JSON.stringify(payload.value, null, 2)),
      ])
  },
})

export const serverGroupingSelection: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
