import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_Cell,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Employee, employees } from './_employees'

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const columns: MVT_ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department', enableGrouping: true },
  { accessorKey: 'jobTitle', header: 'Job Title', enableGrouping: true },
  {
    accessorKey: 'salary',
    header: 'Salary',
    enableGrouping: false,
    aggregationFn: 'mean',
    Cell: ({ cell }: { cell: MVT_Cell<Employee> }) => usd(cell.getValue<number>()),
    AggregatedCell: ({ cell }: { cell: MVT_Cell<Employee> }) =>
      h(Text, { c: 'blue', fw: 600 }, () => `Avg: ${usd(cell.getValue<number>())}`),
  },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Employee {
  department: string
  jobTitle: string
  name: string
  salary: number
  state: string
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const columns: MVT_ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department', enableGrouping: true },
  { accessorKey: 'jobTitle', header: 'Job Title', enableGrouping: true },
  {
    accessorKey: 'salary',
    header: 'Salary',
    enableGrouping: false,
    // Built-in aggregations: sum, min, max, mean, median, count, unique, …
    aggregationFn: 'mean',
    Cell: ({ cell }) => usd(cell.getValue<number>()),
    // What to show on a grouped row for this column.
    AggregatedCell: ({ cell }) => h(Text, { c: 'blue', fw: 600 }, () => 'Avg: ' + usd(cell.getValue<number>())),
  },
]

const data = ref<Employee[]>([/* ... */])

const table = useMantineVueTable<Employee>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableGrouping: true,
  // Group by department out of the box (users can drag columns to regroup).
  initialState: { grouping: ['department'], expanded: true },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableAggregationDemo',
  setup() {
    const table = useMantineVueTable<Employee>({
      get columns() {
        return columns
      },
      get data() {
        return employees
      },
      enableGrouping: true,
      initialState: { grouping: ['department'], expanded: true },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const aggregation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
