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

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age', mantineEditTextInputProps: { type: 'number' } },
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
  enableEditing: true,
  editDisplayMode: 'modal', // 'cell' | 'row' | 'table' | 'modal'
  onEditingRowSave: ({ row, values, exitEditingMode }) => {
    data.value[row.index] = values as Person
    data.value = [...data.value]
    exitEditingMode()
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
  { accessorKey: 'age', header: 'Age', mantineEditTextInputProps: { type: 'number' } },
  { accessorKey: 'city', header: 'City' },
]

const Demo = defineComponent({
  name: 'TableEditingDemo',
  setup() {
    const data = ref<Person[]>([...people])
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data.value
      },
      enableEditing: true,
      editDisplayMode: 'modal',
      onEditingRowSave: ({ row, values, exitEditingMode }) => {
        data.value[row.index] = values as Person
        data.value = [...data.value]
        exitEditingMode()
      },
    })
    return () => h(MantineVueTable, { table })
  },
})

export const editing: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
