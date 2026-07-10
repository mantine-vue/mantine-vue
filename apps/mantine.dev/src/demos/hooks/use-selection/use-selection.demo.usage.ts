import { defineComponent, h } from 'vue'
import { Checkbox, Table } from '@mantine-vue/core'
import { useSelection } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, Table } from '@mantine-vue/core'
import { useSelection } from '@mantine-vue/hooks'

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
]

const positions = elements.map((element) => element.position)

const [selection, handlers] = useSelection({
  data: positions,
  defaultSelection: [39, 56],
})
</script>

<template>
  <Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>
          <Checkbox
            aria-label="Select deselect all rows"
            :indeterminate="handlers.isSomeSelected()"
            :checked="handlers.isAllSelected()"
            @change="
              () => {
                if (handlers.isAllSelected()) {
                  handlers.resetSelection()
                } else {
                  handlers.setSelection(elements.map((el) => el.position))
                }
              }
            "
          />
        </Table.Th>
        <Table.Th>Element position</Table.Th>
        <Table.Th>Element name</Table.Th>
        <Table.Th>Symbol</Table.Th>
        <Table.Th>Atomic mass</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      <Table.Tr
        v-for="element in elements"
        :key="element.name"
        :bg="selection.value.includes(element.position) ? 'var(--mantine-color-blue-light)' : undefined"
      >
        <Table.Td>
          <Checkbox
            aria-label="Select row"
            :checked="selection.value.includes(element.position)"
            @change="
              (event) => {
                if (event.target.checked) {
                  handlers.select(element.position)
                } else {
                  handlers.deselect(element.position)
                }
              }
            "
          />
        </Table.Td>
        <Table.Td>{{ element.position }}</Table.Td>
        <Table.Td>{{ element.name }}</Table.Td>
        <Table.Td>{{ element.symbol }}</Table.Td>
        <Table.Td>{{ element.mass }}</Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
`

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
]

const positions = elements.map((element) => element.position)

const Demo = defineComponent({
  name: 'UseSelectionUsageDemo',
  setup() {
    const [selection, handlers] = useSelection<number>({
      data: positions,
      defaultSelection: [39, 56],
    })

    return () => {
      const rows = elements.map((element) => {
        const isSelected = selection.value.includes(element.position)
        return h(
          Table.Tr,
          { key: element.name, bg: isSelected ? 'var(--mantine-color-blue-light)' : undefined },
          () => [
            h(Table.Td, () => [
              h(Checkbox, {
                'aria-label': 'Select row',
                checked: isSelected,
                onChange: (event: Event) => {
                  const checked = (event.target as HTMLInputElement).checked
                  if (checked) {
                    handlers.select(element.position)
                  } else {
                    handlers.deselect(element.position)
                  }
                },
              }),
            ]),
            h(Table.Td, () => element.position),
            h(Table.Td, () => element.name),
            h(Table.Td, () => element.symbol),
            h(Table.Td, () => element.mass),
          ],
        )
      })

      return h(Table, () => [
        h(Table.Thead, () => [
          h(Table.Tr, () => [
            h(Table.Th, () => [
              h(Checkbox, {
                'aria-label': 'Select deselect all rows',
                indeterminate: handlers.isSomeSelected(),
                checked: handlers.isAllSelected(),
                onChange: () => {
                  if (handlers.isAllSelected()) {
                    handlers.resetSelection()
                  } else {
                    handlers.setSelection(elements.map((el) => el.position))
                  }
                },
              }),
            ]),
            h(Table.Th, () => 'Element position'),
            h(Table.Th, () => 'Element name'),
            h(Table.Th, () => 'Symbol'),
            h(Table.Th, () => 'Atomic mass'),
          ]),
        ]),
        h(Table.Tbody, () => rows),
      ])
    }
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
