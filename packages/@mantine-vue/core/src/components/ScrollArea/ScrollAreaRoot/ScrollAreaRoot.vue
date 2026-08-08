<script lang="ts">
const defaultProps = { scrollHideDelay: 1000, type: 'hover' } as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { provideScrollAreaContext } from '../ScrollArea.context'
import type { ScrollAreaRootOwnProps, ScrollAreaRootSlots } from './ScrollAreaRoot.types'

defineOptions({
  name: 'ScrollAreaRoot',
  inheritAttrs: false,
})

/**
 * `scrollbars` is a union containing `false`, so it needs an explicit `undefined`
 * default or Vue casts an absent prop to `false`.
 */
const rawProps = withDefaults(defineProps<ScrollAreaRootOwnProps>(), {
  scrollbars: undefined,
})

defineSlots<ScrollAreaRootSlots>()

const attrs = useAttrs()
const props = useProps('ScrollAreaRoot', defaultProps, rawProps)

const viewport = ref<HTMLDivElement | null>(null)
const content = ref<HTMLDivElement | null>(null)
const scrollbarX = ref<HTMLDivElement | null>(null)
const scrollbarY = ref<HTMLDivElement | null>(null)
const cornerWidth = ref(0)
const cornerHeight = ref(0)

provideScrollAreaContext({
  type: props.type ?? defaultProps.type,
  scrollHideDelay: props.scrollHideDelay ?? defaultProps.scrollHideDelay,
  scrollbars: props.scrollbars,
  viewport,
  onViewportChange: (node) => {
    viewport.value = node
  },
  content,
  onContentChange: (node) => {
    content.value = node
  },
  scrollbarX,
  onScrollbarXChange: (node) => {
    scrollbarX.value = node
  },
  scrollbarY,
  onScrollbarYChange: (node) => {
    scrollbarY.value = node
  },
  onCornerWidthChange: (width) => {
    cornerWidth.value = width
  },
  onCornerHeightChange: (height) => {
    cornerHeight.value = height
  },
  getStyles: props.getStyles,
})

/** The corner only takes up space when both scrollbars are present. */
const cornerVars = computed(() => ({
  '--sa-corner-width': props.scrollbars !== 'xy' ? '0px' : `${cornerWidth.value}px`,
  '--sa-corner-height': props.scrollbars !== 'xy' ? '0px' : `${cornerHeight.value}px`,
}))
</script>

<template>
  <Box v-bind="attrs" :style="[cornerVars, attrs.style as any]">
    <slot />
  </Box>
</template>
