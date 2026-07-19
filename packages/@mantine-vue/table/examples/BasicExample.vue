<script setup lang="ts">
import { ref } from 'vue'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_Row,
} from '@mantine-vue/table'
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
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
]

const data = ref<Person[]>([
  { age: 30, city: 'Austin', firstName: 'Jane', lastName: 'Doe' },
  { age: 25, city: 'Denver', firstName: 'John', lastName: 'Smith' },
  { age: 42, city: 'Seattle', firstName: 'Mary', lastName: 'Jones' },
  { age: 28, city: 'Boston', firstName: 'Bob', lastName: 'Brown' },
])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },

  enableColumnOrdering: true,
  enableRowOrdering: true,
  enableColumnPinning: true,
  enableColumnResizing: true,
  enableClickToCopy: true,
  enableRowSelection: true,
  enableBatchRowSelection: true,
  enablePagination: true,
  enableSorting: false,
  mantineRowDragHandleProps: ({ table }) => ({
    onDragEnd: () => {
      const { draggingRow, hoveredRow } = table.getState()
      if (hoveredRow && draggingRow) {
        data.value.splice(
          (hoveredRow as MVT_Row<Person>).index,
          0,
          data.value.splice(draggingRow.index, 1)[0],
        )
        data.value = [...data.value]
      }
    },
  }),
})
</script>

<template>
  <MantineVueTable :table="table" />
</template>
