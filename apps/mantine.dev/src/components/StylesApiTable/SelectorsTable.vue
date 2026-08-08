<script setup lang="ts">
import { Table } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import type { StylesApiData } from './styles-api-data'

withDefaults(defineProps<{ data: StylesApiData; component: string; fixedLayout?: boolean }>(), {
  fixedLayout: true,
})
</script>

<template>
  <Table.ScrollContainer :min-width="800">
    <Table :layout="fixedLayout ? 'fixed' : undefined">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="fixedLayout ? 210 : undefined">Selector</Table.Th>
          <Table.Th :w="fixedLayout ? 310 : undefined">Static selector</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="(description, selector) in data.selectors" :key="selector">
          <Table.Td>{{ selector }}</Table.Td>
          <Table.Td>
            <TableInlineCode>.mantine-{{ component }}-{{ selector }}</TableInlineCode>
          </Table.Td>
          <Table.Td>
            <HtmlText :text="description" />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>
