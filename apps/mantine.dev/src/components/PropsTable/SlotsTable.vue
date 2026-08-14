<script setup lang="ts">
import { Anchor, Highlight, Table, Text } from '@mantine-vue/core'
import { REPO_BASE } from '@/links'
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
            <div v-if="slot.typeReferences?.length" class="typeReferences">
              <Anchor
                v-for="reference in slot.typeReferences"
                :key="`${reference.declaredIn}:${reference.line}`"
                :href="`${REPO_BASE}/${reference.declaredIn}#L${reference.line}`"
                target="_blank"
                rel="noreferrer"
                size="xs"
              >
                View {{ reference.name }} definition
              </Anchor>
            </div>
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

.typeReferences {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: var(--mantine-spacing-xs);
}
</style>
