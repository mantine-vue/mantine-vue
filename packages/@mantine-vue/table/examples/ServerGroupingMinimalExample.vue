<script setup lang="ts">
import {
  createServerGroupingProvider,
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Sale {
  amount: number
  country: string
  id: number
  name: string
}

const columns: MVT_ColumnDef<Sale>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'amount', header: 'Amount' },
]

const DB: Sale[] = Array.from({ length: 60 }, (_, index) => ({
  amount: (index % 9) * 100,
  country: ['Bahrain', 'USA', 'Japan'][index % 3],
  id: index + 1,
  name: `Sale #${index + 1}`,
}))
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const provider = createServerGroupingProvider<Sale, string, string[], Sale[]>({
  loadGroups: async () => {
    await sleep(300)
    return [...new Set(DB.map((sale) => sale.country))]
  },

  loadRecords: async ({ parentGroup, pagination }) => {
    await sleep(300)
    return DB.filter((sale) => sale.country === parentGroup?.value).slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    )
  },
  rowId: (row) => String(row.id),
})

const table = useMantineVueTable<Sale>({
  columns,
  data: [],
  serverGrouping: {
    grouping: ['country'],
    provider,
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
