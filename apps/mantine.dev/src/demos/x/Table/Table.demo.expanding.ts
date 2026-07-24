import { defineComponent, h } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'

interface Person {
  city: string
  name: string
  subRows?: Person[]
  title: string
}

const data: Person[] = [
  {
    name: 'Jane Doe',
    title: 'CTO',
    city: 'Austin',
    subRows: [
      {
        name: 'John Smith',
        title: 'Engineering Manager',
        city: 'Denver',
        subRows: [
          { name: 'Mary Jones', title: 'Engineer', city: 'Seattle' },
          { name: 'Bob Brown', title: 'Engineer', city: 'Boston' },
        ],
      },
      { name: 'Alice Green', title: 'Designer', city: 'Portland' },
    ],
  },
  {
    name: 'Tom White',
    title: 'VP Sales',
    city: 'Chicago',
    subRows: [
      { name: 'Sara Khan', title: 'Account Executive', city: 'Miami' },
      { name: 'Mike Reyes', title: 'Account Executive', city: 'Reno' },
    ],
  },
]

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'city', header: 'City' },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
  name: string
  subRows?: Person[]
  title: string
}

// Each row may carry a \`subRows\` array of children.
const data = ref<Person[]>([/* nested people ... */])

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'city', header: 'City' },
]

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableExpanding: true,
  // Tell the table where to find the children of each row.
  getSubRows: (row) => row.subRows,
  // start with everything expanded.
  initialState: { expanded: true },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableExpandingDemo',
  setup() {
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data
      },
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
      initialState: { expanded: true },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const expanding: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
