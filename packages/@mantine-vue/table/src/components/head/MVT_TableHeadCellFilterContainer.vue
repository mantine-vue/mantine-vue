<script setup lang="ts">
import { Collapse, Flex, Menu, ActionIcon, Text, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs, useSlots } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import MVT_FilterCheckbox from '../inputs/MVT_FilterCheckbox.vue'
import MVT_FilterRangeFields from '../inputs/MVT_FilterRangeFields.vue'
import MVT_FilterRangeSlider from '../inputs/MVT_FilterRangeSlider.vue'
import MVT_FilterTextInput from '../inputs/MVT_FilterTextInput.vue'
import MVT_FilterOptionMenu from '../menus/MVT_FilterOptionMenu.vue'
import classes from './MVT_TableHeadCellFilterContainer.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableHeadCellFilterContainer', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: {
    column: MVT_Header<MVT_RowData>['column']
    header: MVT_Header<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()

const column = computed(() => props.header.column)
const columnDef = computed(() => column.value.columnDef)

const showFilterModeMenu = computed(() => {
  const { table } = props
  const allowed = columnDef.value.columnFilterModeOptions ?? table.options.columnFilterModeOptions
  return (
    table.options.enableColumnFilterModes &&
    columnDef.value.enableColumnFilterModes !== false &&
    (allowed === undefined || !!allowed?.length)
  )
})

const isExpanded = computed(
  () =>
    props.table.getState().showColumnFilters ||
    props.table.options.columnFilterDisplayMode === 'popover',
)

const variant = computed(() => {
  const def = columnDef.value
  if (def.filterVariant === 'checkbox') return 'checkbox'
  if (def.filterVariant === 'range-slider') return 'range-slider'
  if (
    ['date-range', 'range'].includes(def.filterVariant ?? '') ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(def._filterFn)
  )
    return 'range-fields'
  return 'text'
})

const hasCustomInput = () => !!slots.default

const renderCustomInput = () => {
  const { header, table } = props
  return slots.default?.({ column: column.value, header, table })
}

const focusFilterInput = () =>
  setTimeout(() => props.table.refs.filterInputRefs.value[`${column.value.id}-0`]?.focus(), 100)

const filterModeLabel = computed(() => {
  const { localization } = props.table.options
  return localization.filterMode.replace(
    '{filterType}',
    localizedFilterOption(localization, columnDef.value._filterFn),
  )
})
</script>

<template>
  <Collapse :expanded="isExpanded">
    <Flex direction="column" v-bind="attrs">
      <Flex align="flex-end">
        <MVT_RenderNode v-if="hasCustomInput()" :node="renderCustomInput()" />
        <MVT_FilterCheckbox v-else-if="variant === 'checkbox'" :column="column" :table="table" />
        <MVT_FilterRangeSlider
          v-else-if="variant === 'range-slider'"
          :header="header"
          :table="table"
        />
        <MVT_FilterRangeFields
          v-else-if="variant === 'range-fields'"
          :header="header"
          :table="table"
        />
        <MVT_FilterTextInput v-else :header="header" :table="table" />
        <Menu
          v-if="showFilterModeMenu"
          :withinPortal="table.options.columnFilterDisplayMode !== 'popover'"
        >
          <Tooltip
            :label="table.options.localization.changeFilterMode"
            position="bottom-start"
            :withinPortal="true"
          >
            <Menu.Target>
              <ActionIcon
                :aria-label="table.options.localization.changeFilterMode"
                color="gray"
                size="md"
                variant="subtle"
              >
                <component :is="table.options.icons.IconFilterCog" />
              </ActionIcon>
            </Menu.Target>
          </Tooltip>
          <MVT_FilterOptionMenu :header="header" :table="table" :onSelect="focusFilterInput" />
        </Menu>
      </Flex>
      <Text
        v-if="showFilterModeMenu"
        c="dimmed"
        :class="classes['filter-mode-label']"
        component="label"
      >
        {{ filterModeLabel }}
      </Text>
    </Flex>
  </Collapse>
</template>
