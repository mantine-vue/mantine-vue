<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '@mantine-vue/core'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  bio: string
  name: string
  role: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
]

const data = ref<Person[]>([
  { name: 'Jane Doe', role: 'Engineer', bio: 'Builds tables in Vue.' },
  { name: 'John Smith', role: 'Designer', bio: 'Loves whitespace.' },
])

const table = useMantineVueTable<Person>({
  get columns() {
    return columns
  },
  get data() {
    return data.value
  },
  enableRowActions: true,
})
function viewRow(name: string) {
  // eslint-disable-next-line no-alert
  window.alert(`Viewing ${name}`)
}

function deleteRow(name: string) {
  // eslint-disable-next-line no-alert
  window.alert(`Deleting ${name}`)
}
</script>

<template>
  <!--
    Renderable sections can be customized with Vue named slots. A `#detailPanel`
    slot also enables the expand column automatically. Each slot is scoped with
    the same argument as the equivalent `renderX` option.
  -->
  <MantineVueTable :table="table">
    <template #detailPanel="{ row }">
      <div style="padding: 8px">{{ row.original.bio }}</div>
    </template>

    <template #rowActionMenuItems="{ row }">
      <Menu.Item @click="viewRow(row.original.name)"> View </Menu.Item>

      <Menu.Item color="red" @click="deleteRow(row.original.name)"> Delete </Menu.Item>
    </template>
  </MantineVueTable>
</template>
