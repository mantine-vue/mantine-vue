<script setup lang="ts">
import { Highlight, Table } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import { prepareType, type DocgenEmit } from './docgen-data'

defineProps<{ emitsList: DocgenEmit[]; query: string }>()
</script>

<template>
  <Table.ScrollContainer :min-width="800">
    <Table layout="fixed">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="210">Name</Table.Th>
          <Table.Th :w="310">Payload</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="event in emitsList" :key="event.name" data-emits-table-row>
          <Table.Td style="white-space: nowrap">
            <Highlight class="emitName" component="span" :highlight="query" :title="event.name">
              {{ event.name }}
            </Highlight>
          </Table.Td>

          <Table.Td>
            <TableInlineCode>{{ prepareType(event.type.name) }}</TableInlineCode>
          </Table.Td>

          <Table.Td>
            <HtmlText :text="event.description" />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>

<style scoped>
.emitName {
  font-family: var(--mantine-font-family-monospace);
  font-size: 12px;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
