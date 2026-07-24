import { defineComponent, h, ref } from 'vue'
import { Divider, Flex, Stack, Title } from '@mantine-vue/core'
import {
  MantineVueTable,
  MVT_EditActionButtons,
  useMantineVueTable,
  type MVT_ColumnDef,
  type MVT_Node,
  type MVT_Row,
  type MVT_TableInstance,
} from '@mantine-vue/table'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'email', header: 'Email' },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Divider, Flex, Stack, Title } from '@mantine-vue/core'
import {
  MantineVueTable,
  MVT_EditActionButtons,
  useMantineVueTable,
  type MVT_ColumnDef,
} from '@mantine-vue/table'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
  email: string
  firstName: string
  lastName: string
}

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'email', header: 'Email' },
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
  editDisplayMode: 'modal',
  onEditingRowSave: ({ row, values, exitEditingMode }) => {
    data.value = data.value.map((r, i) => (i === row.index ? (values as Person) : r))
    exitEditingMode()
  },
})
</script>

<template>
  <MantineVueTable :table="table">
    <!--
      Replace the modal body. \`internalEditComponents\` are the default inputs;
      lay them out however you like, then drop in the built-in save/cancel
      buttons via <MVT_EditActionButtons />.
    -->
    <template #editRowModalContent="{ internalEditComponents, row, table }">
      <Stack :gap="0">
        <Title :order="4">Edit person</Title>
        <Divider my="sm" />
        <Stack :gap="8">
          <component :is="c" v-for="(c, i) in internalEditComponents" :key="i" />
        </Stack>
        <Flex justify="flex-end" mt="md">
          <MVT_EditActionButtons :row="row" :table="table" variant="text" />
        </Flex>
      </Stack>
    </template>
  </MantineVueTable>
</template>
`

const Demo = defineComponent({
  name: 'TableEditModalDemo',
  setup() {
    const data = ref<Person[]>(people.map((p) => ({ ...p })))

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
        data.value = data.value.map((r, i) => (i === row.index ? (values as Person) : r))
        exitEditingMode()
      },
    })

    return () =>
      h(
        MantineVueTable,
        { table },
        {
          editRowModalContent: ({
            internalEditComponents,
            row,
            table: t,
          }: {
            internalEditComponents: MVT_Node[]
            row: MVT_Row<Person>
            table: MVT_TableInstance<Person>
          }) =>
            h(Stack, { gap: 0 }, () => [
              h(Title, { order: 4 }, () => 'Edit person'),
              h(Divider, { my: 'sm' }),
              h(Stack, { gap: 8 }, () => internalEditComponents),
              h(Flex, { justify: 'flex-end', mt: 'md' }, () =>
                h(MVT_EditActionButtons as any, { row, table: t, variant: 'text' }),
              ),
            ]),
        },
      )
  },
})

export const editModal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
