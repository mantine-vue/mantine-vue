<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Row {
  city: string
  id: number
  name: string
  value: number
}

const columns: MVT_ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'value', header: 'Value' },
]

// 10,000 rows — only the visible ones are rendered.
const data = ref<Row[]>(
  Array.from({ length: 10_000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    city: ['Austin', 'Denver', 'Seattle', 'Boston'][i % 4],
    value: Math.round(Math.random() * 1000),
  })),
)

const table = useMantineVueTable<Row>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableRowVirtualization: true,
  enablePagination: false,
  // Give the scroll container a fixed height so virtualization can measure it.
  mantineTableContainerProps: { style: { maxHeight: '600px' } },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
