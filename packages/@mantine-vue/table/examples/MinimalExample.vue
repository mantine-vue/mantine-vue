<script setup lang="ts">
import { ref } from 'vue'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  age: number
  name: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
]

const data = ref<Person[]>([
  { name: 'Jane Doe', age: 30 },
  { name: 'John Smith', age: 25 },
  { name: 'Mary Jones', age: 42 },
])

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
