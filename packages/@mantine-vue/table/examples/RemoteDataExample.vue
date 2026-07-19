<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_PaginationState,
  type MVT_SortingState,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface User {
  email: string
  id: number
  name: string
}

const columns: MVT_ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]

// Server-driven state.
const data = ref<User[]>([])
const rowCount = ref(0)
const isLoading = ref(false)
const isError = ref(false)
const pagination = ref<MVT_PaginationState>({ pageIndex: 0, pageSize: 10 })
const sorting = ref<MVT_SortingState>([])
const globalFilter = ref('')

// Re-fetch whenever pagination/sorting/search change.
watchEffect(async () => {
  isLoading.value = true
  isError.value = false
  try {
    const params = new URLSearchParams({
      page: String(pagination.value.pageIndex),
      size: String(pagination.value.pageSize),
      sort: JSON.stringify(sorting.value),
      search: globalFilter.value,
    })
    const res = await fetch(`/api/users?${params}`)
    const json = (await res.json()) as { rows: User[]; total: number }
    data.value = json.rows
    rowCount.value = json.total
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})

const table = useMantineVueTable<User>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  // Tell MVT the server owns filtering/pagination/sorting.
  manualFiltering: true,
  manualPagination: true,
  manualSorting: true,
  get rowCount() {
    return rowCount.value
  },
  state: {
    get globalFilter() {
      return globalFilter.value
    },
    get isLoading() {
      return isLoading.value
    },
    get pagination() {
      return pagination.value
    },
    get showAlertBanner() {
      return isError.value
    },
    get sorting() {
      return sorting.value
    },
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === 'function' ? (updater(globalFilter.value) ?? '') : (updater ?? '')
  },
  onPaginationChange: (updater) => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
