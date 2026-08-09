<script setup lang="ts">
import { computed } from 'vue'
import { Table } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import type { StylesApiData } from './styles-api-data'

const props = withDefaults(defineProps<{ data: StylesApiData; fixedLayout?: boolean }>(), {
  fixedLayout: true,
})

const modifiers = computed(() => props.data.modifiers ?? [])
const hasConditions = computed(() => modifiers.value.some((modifier) => !!modifier.condition))
const hasValues = computed(() => modifiers.value.some((modifier) => !!modifier.value))

const formatSelector = (selector: string | string[]) =>
  Array.isArray(selector) ? selector.join(', ') : selector
</script>

<template>
  <Table.ScrollContainer :min-width="800">
    <Table :layout="fixedLayout ? 'fixed' : undefined">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="fixedLayout ? 210 : undefined">Selector</Table.Th>
          <Table.Th :w="fixedLayout ? 310 : undefined">Attribute</Table.Th>
          <Table.Th v-if="hasConditions">Condition</Table.Th>
          <Table.Th v-if="hasValues">Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="(modifier, index) in modifiers" :key="index">
          <Table.Td>{{ formatSelector(modifier.selector) }}</Table.Td>
          <Table.Td>
            <TableInlineCode>{{ modifier.modifier }}</TableInlineCode>
          </Table.Td>
          <Table.Td v-if="hasConditions">
            <HtmlText :text="modifier.condition || '–'" />
          </Table.Td>
          <Table.Td v-if="hasValues">
            <HtmlText :text="modifier.value || '–'" />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>
