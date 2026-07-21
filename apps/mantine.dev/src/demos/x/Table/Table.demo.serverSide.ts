import { defineComponent, h, ref, watchEffect } from 'vue'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_PaginationState,
  type MVT_SortingState,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'

interface User {
  city: string
  email: string
  firstName: string
  id: number
  lastName: string
  state: string
}

// ---------------------------------------------------------------------------
// A local dataset that stands in for a database. In a real app this lives on
// your server; here we generate it once so the demo can run without a backend.
// ---------------------------------------------------------------------------
const FIRST = [
  'Jane',
  'John',
  'Mary',
  'Bob',
  'Alice',
  'Tom',
  'Sara',
  'Mike',
  'Lena',
  'Omar',
  'Nina',
  'Paul',
]
const LAST = [
  'Doe',
  'Smith',
  'Jones',
  'Brown',
  'Green',
  'White',
  'Khan',
  'Reyes',
  'Cohen',
  'Ito',
  'Novak',
  'Diaz',
]
const PLACES: [string, string][] = [
  ['Austin', 'TX'],
  ['Denver', 'CO'],
  ['Seattle', 'WA'],
  ['Boston', 'MA'],
  ['Portland', 'OR'],
  ['Chicago', 'IL'],
  ['Miami', 'FL'],
  ['Reno', 'NV'],
]

const DB: User[] = Array.from({ length: 253 }, (_, i) => {
  const firstName = FIRST[i % FIRST.length]
  const lastName = LAST[(i * 7) % LAST.length]
  const [city, state] = PLACES[(i * 3) % PLACES.length]
  return {
    id: i + 1,
    firstName,
    lastName,
    email: `${firstName}.${lastName}${i + 1}@example.com`.toLowerCase(),
    city,
    state,
  }
})

// ---------------------------------------------------------------------------
// Fake API: applies global filtering, sorting, and pagination on the server,
// then returns only the current page plus the total row count, after a delay.
// ---------------------------------------------------------------------------
interface FetchParams {
  globalFilter: string
  pagination: MVT_PaginationState
  sorting: MVT_SortingState
}
interface FetchResult {
  rows: User[]
  total: number
}

function fakeApi({ globalFilter, pagination, sorting }: FetchParams): Promise<FetchResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = DB

      if (globalFilter) {
        const q = globalFilter.toLowerCase()
        result = result.filter((u) =>
          [u.firstName, u.lastName, u.email, u.city, u.state].some((v) =>
            v.toLowerCase().includes(q),
          ),
        )
      }

      if (sorting.length) {
        const { id, desc } = sorting[0]
        result = [...result].sort((a, b) => {
          const av = String(a[id as keyof User])
          const bv = String(b[id as keyof User])
          return (desc ? -1 : 1) * av.localeCompare(bv, undefined, { numeric: true })
        })
      }

      const total = result.length
      const start = pagination.pageIndex * pagination.pageSize
      resolve({ rows: result.slice(start, start + pagination.pageSize), total })
    }, 600) // simulated network latency
  })
}

const columns: MVT_ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 70, enableGlobalFilter: false },
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'state', header: 'State', size: 90 },
]

const code = `
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
  city: string
  email: string
  firstName: string
  id: number
  lastName: string
  state: string
}

// \`fakeApi\` stands in for your server: it filters, sorts, and paginates the
// full dataset and returns only the current page plus the total row count.
// Swap it for a real \`fetch('/api/users?...')\` call.
declare function fakeApi(params: {
  globalFilter: string
  pagination: MVT_PaginationState
  sorting: MVT_SortingState
}): Promise<{ rows: User[]; total: number }>

const columns: MVT_ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 70, enableGlobalFilter: false },
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'state', header: 'State', size: 90 },
]

// --- state the server owns ---
const data = ref<User[]>([])
const rowCount = ref(0)
const isLoading = ref(false)
const isError = ref(false)

// --- state the table controls, mirrored here so we can send it to the API ---
const pagination = ref<MVT_PaginationState>({ pageIndex: 0, pageSize: 10 })
const sorting = ref<MVT_SortingState>([])
const globalFilter = ref('')

// Re-fetch whenever pagination, sorting, or the search term change.
watchEffect(async () => {
  isLoading.value = true
  isError.value = false
  try {
    const res = await fakeApi({
      pagination: pagination.value,
      sorting: sorting.value,
      globalFilter: globalFilter.value,
    })
    data.value = res.rows
    rowCount.value = res.total
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

  // Tell the table the server owns these operations.
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,

  // The server knows the real total; the table needs it to render page counts.
  get rowCount() {
    return rowCount.value
  },

  // Controlled state (getters keep it reactive).
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

  // Write changes back so the watcher re-fetches.
  onPaginationChange: (updater) => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    const next = typeof updater === 'function' ? updater(globalFilter.value) : updater
    globalFilter.value = next ?? ''
    // Jump back to the first page when the search changes.
    pagination.value = { ...pagination.value, pageIndex: 0 }
  },

  mantineToolbarAlertBannerProps: isError.value
    ? { color: 'red', children: 'Error loading data' }
    : undefined,
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableServerSideDemo',
  setup() {
    const data = ref<User[]>([])
    const rowCount = ref(0)
    const isLoading = ref(false)
    const isError = ref(false)

    const pagination = ref<MVT_PaginationState>({ pageIndex: 0, pageSize: 10 })
    const sorting = ref<MVT_SortingState>([])
    const globalFilter = ref('')

    watchEffect(async () => {
      isLoading.value = true
      isError.value = false
      try {
        const res = await fakeApi({
          pagination: pagination.value,
          sorting: sorting.value,
          globalFilter: globalFilter.value,
        })
        data.value = res.rows
        rowCount.value = res.total
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
      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,
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
      onPaginationChange: (updater) => {
        pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
      },
      onSortingChange: (updater) => {
        sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
      },
      onGlobalFilterChange: (updater) => {
        const next = typeof updater === 'function' ? updater(globalFilter.value) : updater
        globalFilter.value = next ?? ''
        pagination.value = { ...pagination.value, pageIndex: 0 }
      },
      mantineToolbarAlertBannerProps: isError.value
        ? { color: 'red', children: 'Error loading data' }
        : undefined,
    })

    return () => h(MantineVueTable, { table })
  },
})

export const serverSide: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
