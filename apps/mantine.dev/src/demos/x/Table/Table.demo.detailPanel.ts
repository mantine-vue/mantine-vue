import { defineComponent, h, ref } from 'vue'
import { Menu, Text } from '@mantine-vue/core'
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
import { Menu, Text } from '@mantine-vue/core'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  age: number
  city: string
  email: string
  firstName: string
  lastName: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
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
  enableRowActions: true,
})
</script>

<template>
  <!--
    Any renderable section can be customized with a Vue named slot instead of the
    equivalent \`renderX\` option. A \`#detailPanel\` slot also enables the expand
    column automatically. Each slot receives the same scoped argument as the option.
  -->
  <MantineVueTable :table="table">
    <template #detailPanel="{ row }">
      <Text size="sm">{{ row.original.email }} — age {{ row.original.age }}</Text>
    </template>

    <template #rowActionMenuItems="{ row }">
      <Menu.Item @click="() => window.alert(\`Viewing \${row.original.firstName}\`)">
        View
      </Menu.Item>
      <Menu.Item color="red" @click="() => window.alert(\`Deleting \${row.original.firstName}\`)">
        Delete
      </Menu.Item>
    </template>
  </MantineVueTable>
</template>
`

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
]

const Demo = defineComponent({
  name: 'TableDetailPanelDemo',
  setup() {
    const data = ref<Person[]>([...people])
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return data.value
      },
      enableRowActions: true,
    })
    return () =>
      h(
        MantineVueTable,
        { table },
        {
          detailPanel: ({ row }: { row: MVT_Row<Person> }) =>
            h(Text, { size: 'sm' }, () => `${row.original.email} — age ${row.original.age}`),
          rowActionMenuItems: ({ row }: { row: MVT_Row<Person> }) => [
            h(
              Menu.Item,
              // eslint-disable-next-line no-alert
              { onClick: () => window.alert(`Viewing ${row.original.firstName}`) },
              () => 'View',
            ),
            h(
              Menu.Item,
              // eslint-disable-next-line no-alert
              { color: 'red', onClick: () => window.alert(`Deleting ${row.original.firstName}`) },
              () => 'Delete',
            ),
          ],
        },
      )
  },
})

export const detailPanel: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
