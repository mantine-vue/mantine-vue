import { defineComponent, h, ref } from 'vue'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_Cell,
  type MVT_ColumnDef,
  type MVT_Row,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

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

const data = ref<Person[]>([/* ... */])

const saveCell = (rowIndex: number, key: keyof Person, value: string) => {
  data.value = data.value.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row))
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
].map((col) => ({
  ...col,
  mantineEditTextInputProps: ({ cell, row }) => ({
    onBlur: (event) =>
      saveCell(row.index, cell.column.id as keyof Person, event.target.value),
  }),
}))

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableEditing: true,
  // Every cell is an input at once, no clicking to enter edit mode.
  editDisplayMode: 'table',
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
`

const Demo = defineComponent({
  name: 'TableTableEditingDemo',
  setup() {
    const data = ref<Person[]>(people.map((p) => ({ ...p })))

    const saveCell = (rowIndex: number, key: keyof Person, value: string) => {
      data.value = data.value.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row))
    }

    const columns: MVT_ColumnDef<Person>[] = (
      [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'city', header: 'City' },
      ] as MVT_ColumnDef<Person>[]
    ).map((col) => ({
      ...col,
      mantineEditTextInputProps: ({
        cell,
        row,
      }: {
        cell: MVT_Cell<Person>
        row: MVT_Row<Person>
      }) => ({
        onBlur: (event: FocusEvent) =>
          saveCell(
            row.index,
            cell.column.id as keyof Person,
            (event.target as HTMLInputElement).value,
          ),
      }),
    }))

    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data.value
      },
      enableEditing: true,
      editDisplayMode: 'table',
    })
    return () => h(MantineVueTable, { table })
  },
})

export const tableEditing: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
