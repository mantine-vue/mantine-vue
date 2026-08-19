<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue'

import { Box, LoadingOverlay } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_EditRowModal from '../modals/MVT_EditRowModal.vue'
import MVT_Table from './MVT_Table.vue'
import classes from './MVT_TableContainer.module.css'

defineOptions({ name: 'MVTTableContainer', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const totalToolbarHeight = ref(0)

onMounted(() => {
  const { bottomToolbarRef, topToolbarRef } = props.table.refs
  const topToolbarHeight = topToolbarRef.value?.offsetHeight ?? 0
  const bottomToolbarHeight = bottomToolbarRef.value?.offsetHeight ?? 0
  totalToolbarHeight.value = topToolbarHeight + bottomToolbarHeight
})

const setContainerRef = (el: any, forwardTo?: { value: HTMLDivElement | null }) => {
  const node = (el?.$el ?? el) as HTMLDivElement
  if (node) {
    const { tableContainerRef } = props.table.refs
    tableContainerRef.value = node
    if (forwardTo) forwardTo.value = node
  }
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// table below, which depends on more than these props.
const containerProps = (): any => {
  const { table } = props
  const { isFullScreen } = table.getState()

  const tableContainerProps = {
    ...parseFromValuesOrFunc(table.options.mantineTableContainerProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    ...tableContainerProps,
    style: {
      '--mvt-top-toolbar-height': `${totalToolbarHeight.value}`,
      ...tableContainerProps.style,
    },
    class: clsx(
      'mvt-table-container',
      classes.root,
      table.options.enableStickyHeader && classes['root-sticky'],
      isFullScreen && classes['root-fullscreen'],
      tableContainerProps.class,
    ),
    ref: (el: any) => setContainerRef(el, tableContainerProps.ref),
  }
}

const loadingOverlayProps = computed<any>(() => {
  const { table } = props
  const { isLoading, showLoadingOverlay } = table.getState()
  return {
    visible: isLoading || showLoadingOverlay,
    zIndex: 2,
    ...parseFromValuesOrFunc(table.options.mantineLoadingOverlayProps, { table }),
  }
})

const showEditRowModal = computed(() => {
  const { createDisplayMode, editDisplayMode } = props.table.options
  const { creatingRow, editingRow } = props.table.getState()
  return (
    (createDisplayMode === 'modal' && !!creatingRow) ||
    (editDisplayMode === 'modal' && !!editingRow)
  )
})
</script>

<template>
  <Box v-bind="containerProps()">
    <LoadingOverlay v-bind="loadingOverlayProps" />
    <MVT_Table :table="table" />
    <MVT_EditRowModal v-if="showEditRowModal" :open="true" :table="table" />
  </Box>
</template>
