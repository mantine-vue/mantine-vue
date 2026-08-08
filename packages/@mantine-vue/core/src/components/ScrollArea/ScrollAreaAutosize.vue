<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../core'
import ScrollAreaComponent from './ScrollArea.vue'
import type { ScrollAreaOwnProps, ScrollAreaSlots } from './ScrollArea.props.types'

defineOptions({
  name: 'ScrollAreaAutosize',
  inheritAttrs: false,
})

/**
 * `scrollbars` and `offsetScrollbars` are unions containing `false`, so an absent prop
 * would be cast to `false` and forwarded to `ScrollArea` as an explicit "no scrollbars"
 * instead of letting its own defaults apply.
 */
const props = withDefaults(defineProps<ScrollAreaOwnProps>(), {
  scrollbars: undefined,
  offsetScrollbars: undefined,
})

defineSlots<ScrollAreaSlots>()

const attrs = useAttrs()

/**
 * Two nested flex boxes so the scroll area can shrink below its content size: without
 * the `min-*: 0`, a flex item refuses to shrink past its content and the area never
 * scrolls. The axis that is not scrollable keeps its automatic minimum.
 */
const innerStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'column' as const,
  flex: 1,
  overflow: 'hidden',
  minWidth: props.scrollbars === 'x' ? undefined : 0,
  minHeight: props.scrollbars === 'y' ? undefined : 0,
}))
</script>

<template>
  <Box v-bind="attrs" :style="[{ display: 'flex', overflow: 'hidden' }, attrs.style as any]">
    <Box :style="innerStyle">
      <ScrollAreaComponent v-bind="props" data-autosize="true">
        <slot />
      </ScrollAreaComponent>
    </Box>
  </Box>
</template>
