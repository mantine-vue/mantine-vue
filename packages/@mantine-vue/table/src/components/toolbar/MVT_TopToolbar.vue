<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { Box, Flex } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { createRenderable, MVT_RenderNode } from '../../utils/renderable'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ServerGroupingGroupBy from '../../server-grouping/MVT_ServerGroupingGroupBy.vue'
import MVT_GlobalFilterTextInput from '../inputs/MVT_GlobalFilterTextInput.vue'
import MVT_ProgressBar from './MVT_ProgressBar.vue'
import MVT_TablePagination from './MVT_TablePagination.vue'
import MVT_ToolbarAlertBanner from './MVT_ToolbarAlertBanner.vue'
import MVT_ToolbarDropZone from './MVT_ToolbarDropZone.vue'
import MVT_ToolbarInternalButtons from './MVT_ToolbarInternalButtons.vue'
import commonClasses from './common.styles.module.css'
import classes from './MVT_TopToolbar.module.css'
import { useMediaQuery } from '@mantine-vue/hooks'

defineOptions({ name: 'MVTTopToolbar', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const isMobile = useMediaQuery('(max-width: 720px)')
const isTablet = useMediaQuery('(max-width: 1024px)')

/**
 * Custom actions and narrow viewports push the alert banner onto its own line.
 * A plain function, not a `computed`: `table.options` is not reactive, so a
 * cached value would survive an options change plus `$forceUpdate`.
 */
const stackAlertBanner = () =>
  isMobile.value ||
  !!props.table.options.renderTopToolbarCustomActions ||
  (props.table.getState().showGlobalFilter && isTablet.value)

const globalFilterProps = computed(() => ({
  style: !isTablet.value ? { zIndex: 3 } : undefined,
  table: props.table,
}))

const setToolbarRef = (el: any, forwardTo?: { value: HTMLDivElement | null }) => {
  const node = (el?.$el ?? el) as HTMLDivElement
  if (node) {
    const { topToolbarRef } = props.table.refs
    topToolbarRef.value = node
    if (forwardTo) forwardTo.value = node
  }
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// slot content below, which depends on more than these props.
const toolbarProps = () => {
  const { table } = props
  const topToolbarProps = {
    ...parseFromValuesOrFunc(table.options.mantineTopToolbarProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    ...topToolbarProps,
    class: clsx(
      commonClasses['common-toolbar-styles'],
      classes['root'],
      table.getState().isFullScreen && classes['root-fullscreen'],
      topToolbarProps.class,
    ),
    ref: (el: any) => setToolbarRef(el, topToolbarProps.ref),
  }
}

const showDropZone = computed(() =>
  ['both', 'top'].includes(props.table.options.positionToolbarDropZone ?? ''),
)

const showLeftGlobalFilter = computed(
  () =>
    props.table.options.enableGlobalFilter && props.table.options.positionGlobalFilter === 'left',
)
const showRightGlobalFilter = computed(
  () =>
    props.table.options.enableGlobalFilter && props.table.options.positionGlobalFilter === 'right',
)

const hasServerGrouping = computed(() => !!(props.table as any)._serverGrouping)

const showPagination = computed(
  () =>
    props.table.options.enablePagination &&
    ['both', 'top'].includes(props.table.options.positionPagination ?? ''),
)

const actionsContainerClass = () => [
  classes['actions-container'],
  stackAlertBanner() ? classes['actions-container-stack-alert'] : undefined,
]

const customActions = createRenderable(() =>
  parseFromValuesOrFunc(props.table.options.renderTopToolbarCustomActions, { table: props.table }),
)
</script>

<template>
  <Box v-bind="toolbarProps()">
    <MVT_ToolbarAlertBanner
      v-if="table.options.positionToolbarAlertBanner === 'top'"
      :stackAlertBanner="stackAlertBanner()"
      :table="table"
    />
    <MVT_ToolbarDropZone v-if="showDropZone" :table="table" />
    <Flex :class="actionsContainerClass()">
      <MVT_GlobalFilterTextInput v-if="showLeftGlobalFilter" v-bind="globalFilterProps" />
      <MVT_ServerGroupingGroupBy v-if="hasServerGrouping" :table="table" />
      <MVT_RenderNode v-if="customActions.has()" :node="customActions.node" />
      <span v-else />
      <Flex v-if="table.options.enableToolbarInternalActions" justify="end" wrap="wrap-reverse">
        <MVT_GlobalFilterTextInput v-if="showRightGlobalFilter" v-bind="globalFilterProps" />
        <MVT_ToolbarInternalButtons :table="table" />
      </Flex>
      <MVT_GlobalFilterTextInput v-else-if="showRightGlobalFilter" v-bind="globalFilterProps" />
    </Flex>
    <Flex v-if="showPagination" justify="end">
      <MVT_TablePagination position="top" :table="table" />
    </Flex>
    <MVT_ProgressBar :isTopToolbar="true" :table="table" />
  </Box>
</template>
