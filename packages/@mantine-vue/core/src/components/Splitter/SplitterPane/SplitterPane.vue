<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../../core'
import { useSplitterContext } from '../Splitter.context'
import type { SplitterPaneOwnProps, SplitterPaneSlots } from './SplitterPane.types'

defineOptions({
  name: 'SplitterPane',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SplitterPaneOwnProps>(), {
  min: undefined,
  max: undefined,
  collapsible: false,
  collapseThreshold: undefined,
  __index: undefined,
})

defineSlots<SplitterPaneSlots>()

const attrs = useAttrs()
const context = useSplitterContext()

const index = computed(() => props.__index ?? 0)

/** The splitter drives the layout through `flex-basis`, so panes share the row. */
const sizeStyle = computed(() => ({ flexBasis: `${context.sizes[index.value] ?? 0}%` }))

const paneStyles = computed(() =>
  context.getStyles('pane', {
    className: attrs.class,
    classNames: props.classNames,
    styles: props.styles,
    props,
  }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...paneStyles }"
    :mod="[{ collapsed: context.collapsed[index] || undefined }, props.mod]"
    :style="[paneStyles.style, sizeStyle, attrs.style]"
  >
    <slot />
  </Box>
</template>
