<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useScrollAreaContext } from '../ScrollArea.context'
import type {
  ScrollAreaViewportEmits,
  ScrollAreaViewportOwnProps,
  ScrollAreaViewportSlots,
} from './ScrollAreaViewport.types'

defineOptions({
  name: 'ScrollAreaViewport',
  inheritAttrs: false,
})

const props = defineProps<ScrollAreaViewportOwnProps>()

const emit = defineEmits<ScrollAreaViewportEmits>()

defineSlots<ScrollAreaViewportSlots>()

const attrs = useAttrs()
const ctx = useScrollAreaContext()

const scrollbars = computed(() => ctx.scrollbars ?? 'xy')

/**
 * `scroll` rather than `auto`: the native scrollbars are hidden by the stylesheet and
 * their size is measured, which needs them to exist on the axes that can scroll.
 */
const overflow = computed(() => ({
  overflowX: scrollbars.value === 'x' || scrollbars.value === 'xy' ? 'scroll' : 'hidden',
  overflowY: scrollbars.value === 'y' || scrollbars.value === 'xy' ? 'scroll' : 'hidden',
}))

function setViewportRef(node: any) {
  const element = node?.$el ?? node ?? null
  emit('viewport-mounted', element)
  ctx.onViewportChange(element)
}

function setContentRef(node: any) {
  const element = node?.$el ?? node ?? null
  emit('content-mounted', element)
  ctx.onContentChange(element)
}

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    :ref="setViewportRef"
    v-bind="attrs"
    :style="[overflow, attrs.style as any]"
  >
    <div :ref="setContentRef" v-bind="ctx.getStyles('content')">
      <slot />
    </div>
  </Box>
</template>
