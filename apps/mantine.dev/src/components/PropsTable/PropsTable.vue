<script setup lang="ts">
import { computed } from 'vue'
import { Highlight, Table, Text } from '@mantine-vue/core'
import HtmlText from '../HtmlText/HtmlText.vue'
import TableError from '../TableError/TableError.vue'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'
import { PROPS_DATA, prepareType, type DocgenProp } from './docgen-data'

const props = defineProps<{ component: string; propsList: DocgenProp[]; query: string }>()

const hasData = computed(() => Boolean(PROPS_DATA[props.component]))

const isDeprecated = (prop: DocgenProp) => prop.description.includes('@deprecated')
</script>

<template>
  <TableError v-if="!hasData" error-of="props" />

  <Text v-else-if="propsList.length === 0" class="noProps">
    {{ component }} does not have any component-specific props. It accepts
    <a href="/styles/style-props">style props</a>,
    <a href="/styles/styles-api">Styles API props</a> and all props supported by the element it
    renders.
  </Text>

  <Table.ScrollContainer v-else :min-width="800">
    <Table layout="fixed">
      <Table.Thead>
        <Table.Tr>
          <Table.Th :w="210">Name</Table.Th>
          <Table.Th :w="310">Type</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="prop in propsList" :key="prop.name" data-props-table-row>
          <Table.Td style="white-space: nowrap">
            <Highlight
              class="propName"
              component="span"
              :highlight="query"
              :data-deprecated="isDeprecated(prop) || undefined"
              :title="prop.name"
            >
              {{ prop.name }}
            </Highlight>
            <Text v-if="prop.required" component="sup" c="red"> *</Text>
          </Table.Td>

          <Table.Td>
            <TableInlineCode>{{ prepareType(prop.type.name) }}</TableInlineCode>
          </Table.Td>

          <Table.Td>
            <HtmlText :text="prop.description" />
            <HtmlText
              v-if="prop.defaultValue"
              class="defaultValue"
              :text="`Default value: \`${prop.defaultValue}\``"
            />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>

<style scoped>
.propName {
  font-family: var(--mantine-font-family-monospace);
  font-size: 12px;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.propName[data-deprecated] {
  color: var(--mantine-color-dimmed);
  text-decoration: line-through;
}

.defaultValue {
  display: block;
}

.noProps {
  color: var(--mantine-color-dimmed);
  padding-bottom: var(--mantine-spacing-md);
}
</style>
