<script setup lang="ts">
import { computed } from 'vue'
import { Table } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import type { StylesApiData } from './styles-api-data'

const props = withDefaults(defineProps<{ data: StylesApiData; fixedLayout?: boolean }>(), {
  fixedLayout: true,
})

interface VariableRow {
  key: string
  selector: string
  variable: string
  description: string
  /** Set on the first row of a selector so the selector cell can be merged */
  rowSpan: number | null
}

const rows = computed<VariableRow[]>(() =>
  Object.entries(props.data.vars).flatMap(([selector, variables]) =>
    Object.entries(variables ?? {}).map(([variable, description], index) => ({
      key: `${selector}-${variable}`,
      selector,
      variable,
      description,
      rowSpan: index === 0 ? Object.keys(variables ?? {}).length : null,
    })),
  ),
)
</script>

<template>
  <Table.ScrollContainer :min-width="800">
    <Table :layout="fixedLayout ? 'fixed' : undefined">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="fixedLayout ? 210 : undefined">Selector</Table.Th>
          <Table.Th :w="fixedLayout ? 310 : undefined">Variable</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="row in rows" :key="row.key">
          <Table.Td v-if="row.rowSpan" :rowspan="row.rowSpan">{{ row.selector }}</Table.Td>
          <Table.Td>
            <TableInlineCode>{{ row.variable }}</TableInlineCode>
          </Table.Td>
          <Table.Td>
            <HtmlText :text="row.description" />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>
