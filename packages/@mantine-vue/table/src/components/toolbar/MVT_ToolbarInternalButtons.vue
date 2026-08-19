<script setup lang="ts">
import clsx from 'clsx'
import { Flex } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { createRenderable, MVT_RenderNode } from '../../utils/renderable'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ShowHideColumnsButton from '../buttons/MVT_ShowHideColumnsButton.vue'
import MVT_ToggleDensePaddingButton from '../buttons/MVT_ToggleDensePaddingButton.vue'
import MVT_ToggleFiltersButton from '../buttons/MVT_ToggleFiltersButton.vue'
import MVT_ToggleFullScreenButton from '../buttons/MVT_ToggleFullScreenButton.vue'
import MVT_ToggleGlobalFilterButton from '../buttons/MVT_ToggleGlobalFilterButton.vue'
import classes from './MVT_ToolbarInternalButtons.module.css'

defineOptions({ name: 'MVTToolbarInternalButtons', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const customActions = createRenderable(() =>
  parseFromValuesOrFunc(props.table.options.renderToolbarInternalActions, { table: props.table }),
)

const showGlobalFilterToggle = computed(() => {
  const o = props.table.options
  return o.enableFilters && o.enableGlobalFilter && !o.initialState?.showGlobalFilter
})

const showFiltersToggle = computed(() => {
  const o = props.table.options
  return o.enableFilters && o.enableColumnFilters && o.columnFilterDisplayMode !== 'popover'
})

const showColumnsButton = computed(() => {
  const o = props.table.options
  return o.enableHiding || o.enableColumnOrdering || o.enableColumnPinning
})

const rootProps = computed(() => ({
  ...attrs,
  class: clsx('mvt-toolbar-internal-buttons', classes.root, attrs.class),
}))
</script>

<template>
  <Flex v-bind="rootProps">
    <MVT_RenderNode v-if="customActions.has()" :node="customActions.node" />
    <template v-else>
      <MVT_ToggleGlobalFilterButton v-if="showGlobalFilterToggle" :table="table" />
      <MVT_ToggleFiltersButton v-if="showFiltersToggle" :table="table" />
      <MVT_ShowHideColumnsButton v-if="showColumnsButton" :table="table" />
      <MVT_ToggleDensePaddingButton v-if="table.options.enableDensityToggle" :table="table" />
      <MVT_ToggleFullScreenButton v-if="table.options.enableFullScreenToggle" :table="table" />
    </template>
  </Flex>
</template>
