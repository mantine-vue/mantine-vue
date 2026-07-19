import { defineComponent, h, ref } from 'vue'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_Row,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const code = `
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

const data = ref<Person[]>([/* ... */])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableColumnOrdering: true,
  enableColumnPinning: true,
  enableColumnResizing: true,
  enableRowOrdering: true,
  enableSorting: false,
  // The table only tracks the drag state — you own the data, so apply the reorder.
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
`

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
]

const Demo = defineComponent({
  name: 'TableColumnOrderingDemo',
  setup() {
    const data = ref<Person[]>([...people])
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data.value
      },
      enableColumnOrdering: true,
      enableColumnPinning: true,
      enableColumnResizing: true,
      enableRowOrdering: true,
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
    return () => h(MantineVueTable, { table })
  },
})

export const columnOrdering: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
