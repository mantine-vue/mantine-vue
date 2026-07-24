import { defineComponent, h } from 'vue'
import { ActionIcon, Group, Tooltip } from '@mantine-vue/core'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import { PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { type Person, people } from './_data'

const columns: MVT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ActionIcon, Group, Tooltip } from '@mantine-vue/core'
import { MantineVueTable, useMantineVueTable, type MVT_ColumnDef } from '@mantine-vue/table'
import { PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import '@mantine-vue/table/styles.css'

interface Person {
  city: string
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
  // 'first' | 'last'  where the actions column is placed.
  positionActionsColumn: 'last',
})
</script>

<template>
  <MantineVueTable :table="table">
    <!-- \`#rowActions\` renders a custom cell for each row's actions column. -->
    <template #rowActions="{ row }">
      <Group :gap="4" wrap="nowrap">
        <Tooltip label="Edit">
          <ActionIcon variant="subtle" color="gray" @click="() => editRow(row)">
            <PhPencilSimple :size="18" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon variant="subtle" color="red" @click="() => deleteRow(row)">
            <PhTrash :size="18" />
          </ActionIcon>
        </Tooltip>
      </Group>
    </template>
  </MantineVueTable>
</template>
`

const Demo = defineComponent({
  name: 'TableRowActionsDemo',
  setup() {
    const table = useMantineVueTable<Person>({
      get columns() {
        return columns
      },
      get data() {
        return people
      },
      enableRowActions: true,
      positionActionsColumn: 'last',
    })
    return () =>
      h(
        MantineVueTable,
        { table },
        {
          rowActions: ({ row }: { row: { original: Person } }) =>
            h(Group, { gap: 4, wrap: 'nowrap' }, () => [
              h(Tooltip, { label: 'Edit' }, () =>
                h(
                  ActionIcon,
                  {
                    variant: 'subtle',
                    color: 'gray',
                    // eslint-disable-next-line no-alert
                    onClick: () => window.alert(`Edit ${row.original.firstName}`),
                  },
                  () => h(PhPencilSimple, { size: 18 }),
                ),
              ),
              h(Tooltip, { label: 'Delete' }, () =>
                h(
                  ActionIcon,
                  {
                    variant: 'subtle',
                    color: 'red',
                    // eslint-disable-next-line no-alert
                    onClick: () => window.alert(`Delete ${row.original.firstName}`),
                  },
                  () => h(PhTrash, { size: 18 }),
                ),
              ),
            ]),
        },
      )
  },
})

export const rowActions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
