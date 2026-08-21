<script setup lang="ts">
import { computed, onBeforeUnmount, useAttrs, watch } from 'vue'

import { Paper, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { createRenderable, MVT_RenderNode } from '../../utils/renderable'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_BottomToolbar from '../toolbar/MVT_BottomToolbar.vue'
import MVT_TopToolbar from '../toolbar/MVT_TopToolbar.vue'
import MVT_TableContainer from './MVT_TableContainer.vue'
import classes from './MVT_TablePaper.module.css'

defineOptions({ name: 'MVTTablePaper', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const theme = useMantineTheme()

const isFullScreen = computed(() => props.table.getState().isFullScreen)

// Lock body scroll while full screen so the scrollbar moves the table's own
// container instead of the page behind it.
const setBodyScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(isFullScreen, (fullScreen) => setBodyScrollLock(!!fullScreen))

onBeforeUnmount(() => setBodyScrollLock(false))

const setPaperRef = (el: any, forwardTo?: { value: HTMLDivElement | null }) => {
  const { tablePaperRef } = props.table.refs
  const node = (el?.$el ?? el) as HTMLDivElement
  tablePaperRef.value = node
  if (forwardTo) forwardTo.value = node
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// toolbars and container below, which depend on more than these props.
const paperProps = () => {
  const { table } = props
  const tablePaperProps = {
    ...parseFromValuesOrFunc(table.options.mantinePaperProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    shadow: 'xs',
    withBorder: true,
    ...tablePaperProps,
    class: clsx(
      'mvt-table-paper',
      classes.root,
      isFullScreen.value && 'mvt-table-paper-fullscreen',
      tablePaperProps.class,
    ),
    ref: (el: any) => setPaperRef(el, tablePaperProps.ref),
    style: {
      zIndex: isFullScreen.value ? 200 : undefined,
      ...parseFromValuesOrFunc(tablePaperProps.style, theme),
      ...(isFullScreen.value
        ? {
            border: 0,
            borderRadius: 0,
            bottom: 0,
            height: '100vh',
            left: 0,
            margin: 0,
            maxHeight: '100vh',
            maxWidth: '100vw',
            padding: 0,
            position: 'fixed',
            right: 0,
            top: 0,
            width: '100vw',
          }
        : null),
    },
  }
}

const customTopToolbar = createRenderable(() =>
  parseFromValuesOrFunc(props.table.options.renderTopToolbar, { table: props.table }),
)
const customBottomToolbar = createRenderable(() =>
  parseFromValuesOrFunc(props.table.options.renderBottomToolbar, { table: props.table }),
)
</script>

<template>
  <!--
    Teleport to <body> while full screen so `position: fixed` is relative to the
    viewport and lands in the root stacking context. Otherwise a transformed /
    stacking-context ancestor (common in docs shells and app layouts) traps it,
    leaving the table behind the page header/sidebar. `disabled` keeps the same
    instance mounted when toggling in/out.
  -->
  <Teleport :disabled="!isFullScreen" to="body">
    <Paper v-bind="paperProps()">
      <template v-if="table.options.enableTopToolbar">
        <MVT_RenderNode v-if="customTopToolbar.has()" :node="customTopToolbar.node" />
        <MVT_TopToolbar v-else :table="table" />
      </template>
      <MVT_TableContainer :table="table" />
      <template v-if="table.options.enableBottomToolbar">
        <MVT_RenderNode v-if="customBottomToolbar.has()" :node="customBottomToolbar.node" />
        <MVT_BottomToolbar v-else :table="table" />
      </template>
    </Paper>
  </Teleport>
</template>
