<script setup lang="ts">
import { Highlight, Table, Text } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import { prepareType, type DocgenSlot } from './docgen-data'

defineProps<{ slotsList: DocgenSlot[]; query: string }>()
</script>

<template>
  <Table.ScrollContainer :min-width="800">
    <Table layout="fixed">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="210">Name</Table.Th>
          <Table.Th :w="310">Type</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="slot in slotsList" :key="slot.name" data-slots-table-row>
          <Table.Td style="white-space: nowrap">
            <Highlight class="slotName" component="span" :highlight="query" :title="slot.name">
              {{ slot.name }}
            </Highlight>
            <Text v-if="slot.required" component="sup" c="red"> *</Text>
          </Table.Td>

          <Table.Td>
            <TableInlineCode>{{ prepareType(slot.type.name) }}</TableInlineCode>
          </Table.Td>

          <Table.Td>
            <HtmlText :text="slot.description" />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>

<style scoped>
.slotName {
  font-family: var(--mantine-font-family-monospace);
  font-size: 12px;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
