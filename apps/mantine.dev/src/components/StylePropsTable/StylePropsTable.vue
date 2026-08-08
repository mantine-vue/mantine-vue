<script setup lang="ts">
import { computed } from 'vue'
import { STYLE_PROPS_DATA, Table, type SystemPropData } from '@mantine-vue/core'
import TableInlineCode from '../TableInlineCode/TableInlineCode.vue'

/**
 * Documents the style props that every component inherits from `Box`.
 *
 * Component props tables deliberately omit these see
 * `PropsTable/inherited-props.ts` so this table is where they are documented
 */
const props = withDefaults(
  defineProps<{ source?: Record<string, SystemPropData>; excludeProps?: string[] }>(),
  {
    source: () => STYLE_PROPS_DATA as Record<string, SystemPropData>,
    // Logical-property aliases, hidden for the same reason docgen hides them:
    // they duplicate `ms`/`me`/`ps`/`pe` and only add noise.
    excludeProps: () => ['mis', 'mie', 'pis', 'pie'],
  },
)

/** Style prop types that map onto a theme key. */
const THEME_KEYS: Record<string, string> = {
  color: 'theme.colors',
  textColor: 'theme.colors',
  fontSize: 'theme.fontSizes',
  fontFamily: 'theme.fontFamily',
  spacing: 'theme.spacing',
  lineHeight: 'theme.lineHeights',
  radius: 'theme.radius',
  size: 'theme.spacing',
}

const rows = computed(() =>
  Object.entries(props.source)
    .filter(([name]) => !props.excludeProps.includes(name))
    .map(([name, data]) => ({
      name,
      properties: Array.isArray(data.property) ? data.property : [data.property],
      themeKey: THEME_KEYS[data.type] ?? null,
    })),
)
</script>

<template>
  <Table.ScrollContainer :min-width="600">
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Prop</Table.Th>
          <Table.Th>CSS property</Table.Th>
          <Table.Th>Theme key</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="row in rows" :key="row.name">
          <Table.Td>
            <TableInlineCode>{{ row.name }}</TableInlineCode>
          </Table.Td>
          <Table.Td>
            <span v-for="(property, index) in row.properties" :key="property">
              <TableInlineCode>{{ property }}</TableInlineCode>
              <span v-if="index < row.properties.length - 1">, </span>
            </span>
          </Table.Td>
          <Table.Td>
            <TableInlineCode v-if="row.themeKey">{{ row.themeKey }}</TableInlineCode>
            <span v-else>–</span>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
</template>
