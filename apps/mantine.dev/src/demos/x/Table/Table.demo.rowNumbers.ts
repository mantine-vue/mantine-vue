import { defineComponent, h } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
  firstName: string
  lastName: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
]

const data = ref<Person[]>([/* ... */])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableRowNumbers: true,
  // 'static'  -> 1, 2, 3 … in render order (the default)
  // 'original' -> the row's index in the original data, unaffected by sort/filter
  rowNumberDisplayMode: 'static',
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableRowNumbersDemo',
  setup() {
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return people
      },
      enableRowNumbers: true,
      rowNumberDisplayMode: 'static',
    })
    return () => h(MantineVueTable, { table })
  },
})

export const rowNumbers: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
