<script lang="ts">
import { alpha, createVarsResolver, getThemeColor } from '@mantine-vue/core'

const varsResolver = createVarsResolver<any>((theme, { addColor, removeColor }) => ({
  root: {
    '--diff-add-color':
      addColor !== 'teal' ? alpha(getThemeColor(addColor!, theme), 0.1) : undefined,
    '--diff-add-highlight-color':
      addColor !== 'teal' ? alpha(getThemeColor(addColor!, theme), 0.25) : undefined,
    '--diff-remove-color':
      removeColor !== 'red' ? alpha(getThemeColor(removeColor!, theme), 0.1) : undefined,
    '--diff-remove-highlight-color':
      removeColor !== 'red' ? alpha(getThemeColor(removeColor!, theme), 0.25) : undefined,
  },
}))

const defaultExpandLabel = (hiddenCount: number) =>
  `Show ${hiddenCount} hidden ${hiddenCount === 1 ? 'line' : 'lines'}`

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, shallowRef, useAttrs, watch } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { applyContextCollapsing } from './apply-context-collapsing/apply-context-collapsing'
import { diffLines } from './diff-algorithm'
import { groupChangeBlocks } from './group-change-blocks/group-change-blocks'
import { splitIntoLines } from './split-into-lines/split-into-lines'
import { renderDiffView } from './diff-view'
import type { DiffOwnProps } from './Diff.types'
import classes from './Diff.module.css'

defineOptions({ name: 'Diff', inheritAttrs: false })
const rawProps = withDefaults(defineProps<DiffOwnProps>(), {
  mode: 'unified',
  diffMethod: 'words',
  contextLines: Infinity,
  withLineNumbers: true,
  addColor: 'teal',
  removeColor: 'red',
  expandLabel: defaultExpandLabel,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Diff', null, rawProps)

const getStyles = useStyles({
  name: 'Diff',
  props,
  classes,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const diffRows = computed(() =>
  groupChangeBlocks(
    splitIntoLines(diffLines(props.previousValue, props.currentValue)),
    props.diffMethod,
  ),
)

/* Expanded sections are reset when rows or contextLines change */
const expandedSections = shallowRef<Set<number>>(new Set())
watch([diffRows, () => props.contextLines], () => {
  expandedSections.value = new Set()
})

const processedRows = computed(() =>
  applyContextCollapsing(diffRows.value, props.contextLines, expandedSections.value),
)

let pendingFocusSection: number | null = null

function handleExpand(sectionIndex: number) {
  pendingFocusSection = sectionIndex
  expandedSections.value = new Set(expandedSections.value).add(sectionIndex)
}

function revealedRowRef(node: Element | null) {
  const element = node as HTMLElement | null
  if (element && Number(element.dataset.section) === pendingFocusSection) {
    pendingFocusSection = null
    element.focus()
  }
}

const DiffView = () =>
  renderDiffView({
    mode: props.mode,
    processedRows: processedRows.value,
    withLineNumbers: props.withLineNumbers,
    getStyles: getStyles as any,
    onExpand: handleExpand,
    expandLabel: props.expandLabel,
    revealedRowRef,
  })
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :mod="[{ split: props.mode === 'split' }, (attrs as any).mod]"
  >
    <DiffView />
  </Box>
</template>
