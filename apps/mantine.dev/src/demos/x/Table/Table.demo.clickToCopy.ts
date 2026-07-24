import { defineComponent, h } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

// Enable copying per-column. Click a cell to copy its value to the clipboard.
const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', enableClickToCopy: false },
  { accessorKey: 'lastName', header: 'Last Name', enableClickToCopy: false },
  { accessorKey: 'email', header: 'Email', enableClickToCopy: true },
  { accessorKey: 'city', header: 'City', enableClickToCopy: true },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
  email: string
  firstName: string
  lastName: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', enableClickToCopy: false },
  { accessorKey: 'lastName', header: 'Last Name', enableClickToCopy: false },
  // Copy the email or city cell by clicking it.
  { accessorKey: 'email', header: 'Email', enableClickToCopy: true },
  { accessorKey: 'city', header: 'City', enableClickToCopy: true },
]

const data = ref<Person[]>([/* ... */])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  // Or turn it on for every column at once with \`enableClickToCopy: true\`.
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableClickToCopyDemo',
  setup() {
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return people
      },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const clickToCopy: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
