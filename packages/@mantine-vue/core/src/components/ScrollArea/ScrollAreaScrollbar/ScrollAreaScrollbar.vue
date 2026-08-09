<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import { ScrollAreaScrollbarVisible } from './ScrollAreaScrollbarVisible'
import type {
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarSlots,
} from './ScrollAreaScrollbar.types'

defineOptions({
  name: 'ScrollAreaScrollbar',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ScrollAreaScrollbarProps>(), {
  forceMount: false,
})

defineSlots<ScrollAreaScrollbarSlots>()

const attrs = useAttrs()
const ctx = useScrollAreaContext()

/** `type: 'never'` hides the custom scrollbars entirely. */
const visible = computed(() => ctx.type !== 'never')

const dataState = computed(
  () => attrs['data-state'] ?? (ctx.type === 'always' ? 'visible' : 'hidden'),
)
</script>

<template>
  <ScrollAreaScrollbarVisible
    v-if="visible"
    v-bind="attrs"
    :orientation="props.orientation"
    :data-state="dataState"
  >
    <slot />
  </ScrollAreaScrollbarVisible>
</template>
