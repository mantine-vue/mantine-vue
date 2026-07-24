import { defineComponent, h } from 'vue'
import { Menu } from '@mantine-vue/core'
import {
  MantineVueTable,
  useMantineVueTable,
  type MVT_Column,
  type MVT_ColumnDef,
  type MVT_Node,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City', enableColumnActions: false },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '@mantine-vue/core'
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
  { accessorKey: 'age', header: 'Age' },
  // Column actions are on by default; disable per column with \`enableColumnActions: false\`.
  { accessorKey: 'city', header: 'City', enableColumnActions: false },
]

const data = ref<Person[]>([/* ... */])

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
  <MantineVueTable :table="table">
    <!--
      Extend the column actions menu. \`internalColumnMenuItems\` is the built-in
      menu (sort, hide, etc.); render it, then append your own items.
    -->
    <template #columnActionsMenuItems="{ column, internalColumnMenuItems }">
      <component :is="internalColumnMenuItems" />
      <Menu.Divider />
      <Menu.Item @click="() => alert(\`Custom action on \${column.columnDef.header}\`)">
        Custom action
      </Menu.Item>
    </template>
  </MantineVueTable>
</template>
`

const Demo = defineComponent({
  name: 'TableColumnActionsDemo',
  setup() {
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return people
      },
    })
    return () =>
      h(
        MantineVueTable,
        { table },
        {
          columnActionsMenuItems: ({
            column,
            internalColumnMenuItems,
          }: {
            column: MVT_Column<Person>
            internalColumnMenuItems: MVT_Node
          }) => [
            internalColumnMenuItems,
            h(Menu.Divider),
            h(
              Menu.Item,
              // eslint-disable-next-line no-alert
              { onClick: () => window.alert(`Custom action on ${column.columnDef.header}`) },
              () => 'Custom action',
            ),
          ],
        },
      )
  },
})

export const columnActions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
