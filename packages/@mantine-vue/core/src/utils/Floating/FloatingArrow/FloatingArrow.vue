<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDirection } from '../../../core'
import { getArrowPositionStyles } from './get-arrow-position-styles'
import type { FloatingArrowProps } from './FloatingArrow.types'

defineOptions({
  name: 'FloatingArrow',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FloatingArrowProps>(), {
  arrowX: undefined,
  arrowY: undefined,
  visible: false,
})

const attrs = useAttrs()
const { dir } = useDirection()

const positionStyles = computed(() => getArrowPositionStyles({ ...props, dir: dir.value }))
</script>

<template>
  <div
    v-if="props.visible"
    role="presentation"
    v-bind="attrs"
    :style="[attrs.style, positionStyles]"
  />
</template>
