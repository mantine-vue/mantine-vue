<script setup lang="ts">
import { computed, ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
  email: string
  name: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'city', header: 'City' },
]

const data = ref<Person[]>([
  { name: 'Jane Doe', email: 'jane@acme.io', city: 'Austin' },
  { name: 'John Smith', email: 'john@acme.io', city: 'Denver' },
  { name: 'Mary Jones', email: 'mary@acme.io', city: 'Seattle' },
  { name: 'Bob Brown', email: 'bob@acme.io', city: 'Boston' },
])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableRowSelection: true,
  // Hold Shift and click a second checkbox to select the whole range.
  enableBatchRowSelection: true,
})

// Reactively read the current selection off the table instance.
const selectedNames = computed(() =>
  table.getSelectedRowModel().rows.map((row) => row.original.name),
)
</script>

<template>
  <div>
    <p>Selected: {{ selectedNames.join(', ') || 'none' }}</p>
    <MantineVueTable :table="table" />
  </div>
</template>
