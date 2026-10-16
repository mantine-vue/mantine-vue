<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, rem } from '@mantine-vue/core'
const varsResolver = createVarsResolver<any>((_, { radius, fontSize, indentWidth }) => ({
  root: {
    '--jv-radius': radius !== undefined ? getRadius(radius) : undefined,
    '--jv-fz': fontSize !== undefined ? getFontSize(fontSize) : undefined,
    '--jv-indent': indentWidth !== undefined ? rem(indentWidth) : undefined,
  },
}))
export { varsResolver }
</script>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { useClipboard, useUncontrolled } from '@mantine-vue/hooks'
import { Box, ScrollArea, Tooltip, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import JsonViewerNode from './JsonViewerNode.vue'
import { getExpandablePaths, safeStringify } from './json-viewer-utils'
import type { JsonViewerOwnProps } from './JsonViewer.types'
import classes from './JsonViewer.module.css'

defineOptions({ name: 'JsonViewer', inheritAttrs: false })
const rawProps = withDefaults(defineProps<JsonViewerOwnProps>(), {
  rootName: false,
  defaultExpandDepth: 1,
  expandedPaths: undefined,
  maxDisplayLength: 100,
  withTypes: false,
  withSize: false,
  withCopy: false,
  withCopyButton: false,
  withQuotes: true,
  withKeyQuotes: false,
  collapseStringsAfterLength: false,
  sortKeys: false,
  groupArraysAfterLength: false,
  indentWidth: 16,
  withBorder: false,
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  expandAllLabel: 'Expand all',
  collapseAllLabel: 'Collapse all',
  withControls: false,
  allExpanded: false,
  withLineNumbers: false,
  withChevrons: false,
  unstyled: false,
})
const emit = defineEmits<{
  'update:expandedPaths': [paths: string[]]
  expandedPathsChange: [paths: string[]]
  valueSelect: [path: string[], value: any]
}>()
const attrs = useAttrs()
const props = useProps('JsonViewer', null, rawProps)
const initial = getExpandablePaths(props.value, {
  depth: props.defaultExpandDepth,
  groupArraysAfterLength: props.groupArraysAfterLength,
})
const [expanded, setExpanded] = useUncontrolled<string[]>({
  value: () => props.expandedPaths,
  defaultValue: initial,
  finalValue: [],
  onChange: (paths) => {
    emit('update:expandedPaths', paths)
    emit('expandedPathsChange', paths)
  },
})
function togglePath(path: string) {
  if (!props.allExpanded)
    setExpanded(
      expanded.value.includes(path)
        ? expanded.value.filter((item) => item !== path)
        : [...expanded.value, path],
    )
}
function expandAll() {
  setExpanded(
    getExpandablePaths(props.value, { groupArraysAfterLength: props.groupArraysAfterLength }),
  )
}
function collapseAll() {
  setExpanded([])
}
const getStyles = useStyles({
  name: 'JsonViewer',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})
const { copy: copyToClipboard, copied } = useClipboard()
const content = ref<HTMLElement | null>(null)
const lineHeights = ref<number[]>([])
let observer: ResizeObserver | undefined
function syncLines() {
  lineHeights.value =
    props.withLineNumbers && content.value
      ? Array.from(content.value.querySelectorAll<HTMLElement>(':scope [data-jv-row]')).map(
          (row) => row.getBoundingClientRect().height,
        )
      : []
}
watch([expanded, () => props.allExpanded, () => props.value], () => nextTick(syncLines), {
  deep: true,
})
onMounted(() => {
  syncLines()
  if (content.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(syncLines)
    observer.observe(content.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :data-with-border="props.withBorder || undefined"
    data-jv-root
  >
    <Tooltip
      v-if="props.withCopyButton"
      :label="copied ? props.copiedLabel : props.copyLabel"
      position="left"
      fz="xs"
    >
      <UnstyledButton
        v-bind="getStyles('copyAllButton')"
        :aria-label="copied ? props.copiedLabel : `${props.copyLabel} JSON`"
        @click="copyToClipboard(safeStringify(props.value))"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <template v-if="copied">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
          </template>
          <template v-else>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
            />
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
          </template>
        </svg>
      </UnstyledButton>
    </Tooltip>
    <div v-if="props.withControls && !props.allExpanded" v-bind="getStyles('controls')">
      <UnstyledButton v-bind="getStyles('control')" @click="expandAll">{{
        props.expandAllLabel
      }}</UnstyledButton>
      <UnstyledButton v-bind="getStyles('control')" @click="collapseAll">{{
        props.collapseAllLabel
      }}</UnstyledButton>
    </div>
    <ScrollArea type="hover" :scrollbar-size="4" v-bind="getStyles('scrollarea')">
      <div v-bind="getStyles('wrapper')">
        <div v-if="props.withLineNumbers" v-bind="getStyles('lineNumbers')" aria-hidden="true">
          <div
            v-for="(height, index) in lineHeights"
            :key="index"
            :style="{ height: `${height}px` }"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div
          :ref="(node) => (content = node as HTMLElement | null)"
          v-bind="getStyles('content')"
          role="tree"
          :aria-label="props.rootName || 'JSON'"
        >
          <JsonViewerNode
            :value="props.value"
            :path="[]"
            :node-key="props.rootName || undefined"
            :level="1"
            :ancestors="[]"
            :expanded-paths="expanded"
            :toggle-path="togglePath"
            :get-styles="getStyles"
            :max-display-length="props.maxDisplayLength"
            :with-types="props.withTypes"
            :with-size="props.withSize"
            :with-copy="props.withCopy"
            :with-quotes="props.withQuotes"
            :with-key-quotes="props.withKeyQuotes"
            :collapse-strings-after-length="props.collapseStringsAfterLength"
            :sort-keys="props.sortKeys"
            :group-arrays-after-length="props.groupArraysAfterLength"
            :copy-label="props.copyLabel"
            :copied-label="props.copiedLabel"
            :on-value-select="(path, value) => emit('valueSelect', path, value)"
            :highlight-items="props.highlightItems"
            :all-expanded="props.allExpanded"
            :with-chevrons="props.withChevrons"
            is-root
          />
        </div>
      </div>
    </ScrollArea>
  </Box>
</template>
