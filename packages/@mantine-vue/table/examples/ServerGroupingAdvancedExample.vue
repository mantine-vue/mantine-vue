<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_ServerGroupCellContext,
  type MVT_ServerGroupingExpandedState,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Sale {
  amount: number
  id: number
  name: string
}

interface ApiGroup {
  key: string
  label: string
  scope: string
  totals: { amount: number; count: number }
}
interface ApiGroupResponse {
  groups: ApiGroup[]
  total: number
}
interface ApiRecordResponse {
  rows: Sale[]
  total: number
}

const columns: MVT_ColumnDef<Sale, unknown, ApiGroup>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    serverGrouping: {
      getValue: ({ group }: Omit<MVT_ServerGroupCellContext<ApiGroup>, 'value'>) =>
        group.original.totals.amount,
      Cell: ({ value }: MVT_ServerGroupCellContext<ApiGroup>) =>
        typeof value !== 'number'
          ? null
          : new Intl.NumberFormat('en', { currency: 'USD', style: 'currency' }).format(value),
    },
  },
]

const api = {
  async groups(params: Record<string, unknown>, signal: AbortSignal): Promise<ApiGroupResponse> {
    const response = await fetch(
      `/api/sales/groups?q=${encodeURIComponent(JSON.stringify(params))}`,
      { signal },
    )
    return response.json()
  },
  async records(params: Record<string, unknown>, signal: AbortSignal): Promise<ApiRecordResponse> {
    const response = await fetch(`/api/sales?q=${encodeURIComponent(JSON.stringify(params))}`, {
      signal,
    })
    return response.json()
  },
}

const provider = createServerGroupingProvider<Sale, ApiGroup, ApiGroupResponse, ApiRecordResponse>({
  loadGroups: ({
    groupingField,
    parentGroups,
    pagination,
    sorting,
    columnFilters,
    globalFilter,
    signal,
  }) =>
    api.groups(
      {
        filters: columnFilters,
        groupBy: groupingField, // 'createdAt:month' is passed through untouched
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        scope: parentGroups.at(-1)?.meta?.scope ?? null,
        search: globalFilter ?? null,
        sort: sorting,
      },
      signal,
    ),
  groups: (response) => response.groups,
  groupRowCount: (response) => response.total,
  groupId: (group) => group.key,
  groupLabel: (group) => group.label,
  groupCount: (group) => group.totals.count,
  groupMeta: (group) => ({ scope: group.scope }),

  loadRecords: ({ parentGroups, pagination, sorting, signal }) =>
    api.records(
      {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        scope: parentGroups.at(-1)?.meta?.scope,
        sort: sorting,
      },
      signal,
    ),
  records: (response) => response.rows,
  recordRowCount: (response) => response.total,
  rowId: (row) => String(row.id),
})

const grouping = ref<string[]>(['country', 'salesperson', 'createdAt:month'])
const expanded = ref<MVT_ServerGroupingExpandedState>({})

const table = useMantineVueTable<Sale>({
  columns,
  data: [],
  state: {
    get grouping() {
      return grouping.value
    },
    get serverGroupingExpanded() {
      return expanded.value
    },
  },
  onGroupingChange: (updater) => {
    grouping.value = typeof updater === 'function' ? updater(grouping.value) : updater
  },
  onServerGroupingExpandedChange: (updater) => {
    expanded.value = typeof updater === 'function' ? updater(expanded.value) : updater
  },
  serverGrouping: {
    provider,
    initialPageSize: 15,
    cache: { enabled: true, gcTime: 300_000, keepCollapsedGroups: true, staleTime: 30_000 },
    filteringMode: 'shared',
    sortingMode: 'independent',
  },
})

const regroupByDepartment = () => {
  grouping.value = ['department', 'status']
}
const refreshEverything = () => {
  table.invalidateServerGrouping()
  table.reloadServerGrouping()
}
const refreshBahrain = () => {
  table.reloadServerGroupingPath('country:BH')
}
</script>

<template>
  <div>
    <Group mb="md">
      <Button size="xs" variant="default" @click="regroupByDepartment">
        Group by department → status
      </Button>
      <Button size="xs" variant="default" @click="refreshEverything">Refresh all</Button>
      <Button size="xs" variant="default" @click="refreshBahrain">Refresh Bahrain</Button>
    </Group>

    <MantineVueTable :table="table">
      <template #serverGroupLabel="{ group, depth }">
        <strong>{{ group.label }}</strong>
        <small v-if="depth === 0"> (country)</small>
      </template>
      <template #serverGroupEmpty="{ parentGroup }">
        No sales under {{ parentGroup?.label ?? 'this view' }}.
      </template>
    </MantineVueTable>
  </div>
</template>
