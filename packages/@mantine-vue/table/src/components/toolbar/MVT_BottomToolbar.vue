<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { Box } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { createRenderable, MVT_RenderNode } from '../../utils/renderable'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ProgressBar from './MVT_ProgressBar.vue'
import MVT_TablePagination from './MVT_TablePagination.vue'
import MVT_ToolbarAlertBanner from './MVT_ToolbarAlertBanner.vue'
import MVT_ToolbarDropZone from './MVT_ToolbarDropZone.vue'
import commonClasses from './common.styles.module.css'
import classes from './MVT_BottomToolbar.module.css'
import { useMediaQuery } from '@mantine-vue/hooks'

defineOptions({ name: 'MVTBottomToolbar', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const isMobile = useMediaQuery('(max-width: 720px)')

/**
 * Custom actions and narrow viewports push the alert banner onto its own line.
 * A plain function, not a `computed`: `table.options` is not reactive, so a
 * cached value would survive an options change plus `$forceUpdate`.
 */
const stackAlertBanner = () =>
  isMobile.value || !!props.table.options.renderBottomToolbarCustomActions

const setToolbarRef = (el: any, forwardTo?: { value: HTMLDivElement | null }) => {
  const node = (el?.$el ?? el) as HTMLDivElement
  if (node) {
    const { bottomToolbarRef } = props.table.refs
    bottomToolbarRef.value = node
    if (forwardTo) forwardTo.value = node
  }
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// slot content below, which depends on more than these props.
const toolbarProps = () => {
  const { table } = props
  const bottomToolbarProps = {
    ...parseFromValuesOrFunc(table.options.mantineBottomToolbarProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    ...bottomToolbarProps,
    class: clsx(
      'mvt-bottom-toolbar',
      classes.root,
      commonClasses['common-toolbar-styles'],
      table.getState().isFullScreen && classes['root-fullscreen'],
      bottomToolbarProps.class,
    ),
    ref: (el: any) => setToolbarRef(el, bottomToolbarProps.ref),
  }
}

const showDropZone = computed(() =>
  ['both', 'bottom'].includes(props.table.options.positionToolbarDropZone ?? ''),
)

const showPagination = computed(
  () =>
    props.table.options.enablePagination &&
    ['both', 'bottom'].includes(props.table.options.positionPagination ?? ''),
)

const paginatorContainerClass = () =>
  clsx(
    classes['paginator-container'],
    stackAlertBanner() && classes['paginator-container-alert-banner'],
  )

const customActions = createRenderable(() =>
  parseFromValuesOrFunc(props.table.options.renderBottomToolbarCustomActions, {
    table: props.table,
  }),
)
</script>

<template>
  <Box v-bind="toolbarProps()">
    <MVT_ProgressBar :isTopToolbar="false" :table="table" />
    <MVT_ToolbarAlertBanner
      v-if="table.options.positionToolbarAlertBanner === 'bottom'"
      :stackAlertBanner="stackAlertBanner()"
      :table="table"
    />
    <MVT_ToolbarDropZone v-if="showDropZone" :table="table" />
    <Box :class="classes['custom-toolbar-container']">
      <MVT_RenderNode v-if="customActions.has()" :node="customActions.node" />
      <span v-else />
      <Box :class="paginatorContainerClass()">
        <MVT_TablePagination v-if="showPagination" position="bottom" :table="table" />
      </Box>
    </Box>
  </Box>
</template>
