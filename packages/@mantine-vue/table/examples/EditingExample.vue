<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  age: number
  firstName: string
  lastName: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  {
    accessorKey: 'age',
    header: 'Age',
    // Props forwarded to the Mantine edit input for this column.
    mantineEditTextInputProps: { required: true, type: 'number' },
  },
]

const data = ref<Person[]>([
  { firstName: 'Jane', lastName: 'Doe', age: 30 },
  { firstName: 'John', lastName: 'Smith', age: 25 },
])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableEditing: true,
  // 'cell' | 'row' | 'table' | 'modal' : modal shows an edit button per row.
  editDisplayMode: 'modal',
  onEditingRowSave: ({ exitEditingMode, row, values }) => {
    const next = [...data.value]
    next[row.index] = { ...next[row.index], ...(values as Partial<Person>) }
    data.value = next
    exitEditingMode()
  },
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
