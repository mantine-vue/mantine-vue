<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../../core'
import type { ColorPickerThumbOwnProps } from './Thumb.types'

defineOptions({
  name: 'ColorPickerThumb',
  inheritAttrs: false,
})

const props = defineProps<ColorPickerThumbOwnProps>()

const attrs = useAttrs()

const offsetStyle = computed(() => ({
  '--thumb-y-offset': `${props.position.y * 100}%`,
  '--thumb-x-offset': `${props.position.x * 100}%`,
}))
</script>

<template>
  <Box v-bind="attrs" :style="[attrs.style, offsetStyle]" />
</template>
