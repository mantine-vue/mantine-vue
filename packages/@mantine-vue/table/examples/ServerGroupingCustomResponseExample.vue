<script setup lang="ts">
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Ticket {
  id: number
  priority: string
  subject: string
}

interface ApiGroupResponse {
  payload: {
    entries: { display: string; record_count: number; uid: string }[]
    grand_total: number
  }
}
interface ApiRecordResponse {
  result: { matches: Ticket[]; total_hits: number }
}

const columns: MVT_ColumnDef<Ticket>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'priority', header: 'Priority' },
]

const fetchJson = async <T>(url: string, signal: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<T>
}

const provider = createServerGroupingProvider<
  Ticket,
  ApiGroupResponse['payload']['entries'][number],
  ApiGroupResponse,
  ApiRecordResponse
>({
  loadGroups: ({ groupingField, pagination, signal }) =>
    fetchJson<ApiGroupResponse>(
      `/api/tickets/groups?by=${groupingField}&page=${pagination.pageIndex}&size=${pagination.pageSize}`,
      signal,
    ),
  groups: (response) => response.payload.entries,
  groupRowCount: (response) => response.payload.grand_total,
  groupId: (group) => group.uid,
  groupLabel: (group) => group.display,
  groupCount: (group) => group.record_count,

  loadRecords: ({ parentGroup, pagination, sorting, signal }) =>
    fetchJson<ApiRecordResponse>(
      `/api/tickets?group=${parentGroup?.id}&page=${pagination.pageIndex}&size=${pagination.pageSize}` +
        `&sort=${sorting.map((sort) => `${sort.id}:${sort.desc ? 'desc' : 'asc'}`).join(',')}`,
      signal,
    ),
  records: (response) => response.result.matches,
  recordRowCount: (response) => response.result.total_hits,
  rowId: (row) => String(row.id),
})

const table = useMantineVueTable<Ticket>({
  columns,
  data: [],
  serverGrouping: {
    grouping: ['priority'],
    initialPageSize: 15,
    provider,
    sortingMode: 'records-only',
  },
})
</script>

<template>
  <MantineVueTable :table="table">
    <template #serverGroupCount="{ group }">{{ group.count }} tickets</template>
    <template #serverGroupError="{ retry }">
      Could not reach the ticket service.
      <a href="#" @click.prevent="retry">Try again</a>
    </template>
  </MantineVueTable>
</template>
