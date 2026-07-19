import { defineComponent, h, ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  age: number
  city: string
  firstName: string
  lastName: string
}

// Columns are stable — define them once, outside of reactive state.
const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
]

const data = ref<Person[]>([
  { firstName: 'Jane', lastName: 'Doe', age: 30, city: 'Austin' },
  { firstName: 'John', lastName: 'Smith', age: 25, city: 'Denver' },
])

// Pass \`data\`/\`columns\` as getters so the table stays reactive.
const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
]

const Demo = defineComponent({
  name: 'TableUsageDemo',
  setup() {
    const data = ref<Person[]>([...people])
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data.value
      },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
