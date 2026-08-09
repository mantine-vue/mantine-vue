<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
import type { SliderRootOwnProps, SliderRootSlots } from './SliderRoot.types'

defineOptions({
  name: 'SliderRoot',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SliderRootOwnProps>(), {
  disabled: false,
  orientation: 'horizontal',
})

defineSlots<SliderRootSlots>()

const attrs = useAttrs()
const ctx = useSliderContext()

const rootStyles = computed(() =>
  ctx.getStyles('root', { className: attrs.class, style: attrs.style }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :tabindex="-1"
    :variant="props.variant"
    :mod="{ orientation: props.orientation }"
  >
    <slot />
  </Box>
</template>
