import { defineComponent, h } from 'vue'
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
  // Text filter + switchable filter modes (contains, starts with, equals, …).
  { accessorKey: 'name', header: 'Name', filterVariant: 'text', enableColumnFilterModes: true },
  // Single-select, options auto-derived from the data (faceted values).
  { accessorKey: 'department', header: 'Department', filterVariant: 'select' },
  // Multi-select.
  { accessorKey: 'state', header: 'State', filterVariant: 'multi-select', size: 140 },
  // Numeric min/max range.
  {
    accessorKey: 'salary',
    header: 'Salary',
    filterVariant: 'range',
    Cell: ({ cell }: { cell: MVT_Cell<Employee> }) => usd(cell.getValue<number>()),
  },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Employee {
  department: string
  name: string
  salary: number
  state: string
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const columns: MVT_ColumnDef<Employee>[] = [
  // Each column picks a filter UI via \`filterVariant\`.
  { accessorKey: 'name', header: 'Name', filterVariant: 'text', enableColumnFilterModes: true },
  { accessorKey: 'department', header: 'Department', filterVariant: 'select' },
  { accessorKey: 'state', header: 'State', filterVariant: 'multi-select', size: 140 },
  {
    accessorKey: 'salary',
    header: 'Salary',
    filterVariant: 'range',
    Cell: ({ cell }) => usd(cell.getValue<number>()),
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
  // Column filters are on by default; faceted values populate the select options.
  enableFacetedValues: true,
  // Show the filter inputs immediately (they also live in each column's menu).
  initialState: { showColumnFilters: true },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableColumnFilteringDemo',
  setup() {
    const table = useMantineVueTable<Employee>({
      get columns() {
        return columns
      },
      get data() {
        return employees
      },
      enableFacetedValues: true,
      initialState: { showColumnFilters: true },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const columnFiltering: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
