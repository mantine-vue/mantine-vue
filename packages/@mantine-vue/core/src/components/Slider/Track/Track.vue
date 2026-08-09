<script setup lang="ts">
import { computed } from 'vue'
import { Box } from '../../../core'
import { Marks } from '../Marks/Marks'
import { useSliderContext } from '../Slider.context'
import type { SliderTrackProps, SliderTrackSlots } from './Track.types'

defineOptions({
  name: 'SliderTrack',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SliderTrackProps>(), {
  offset: 0,
  marksOffset: undefined,
  marks: undefined,
  startPointValue: undefined,
  disabled: false,
  inverted: false,
})

defineSlots<SliderTrackSlots>()

const ctx = useSliderContext()

const barStyles = computed(() => ctx.getStyles('bar'))
</script>

<template>
  <Box
    v-bind="{ ...props.containerProps, ...ctx.getStyles('trackContainer') }"
    :mod="{ disabled: props.disabled }"
  >
    <Box
      v-bind="ctx.getStyles('track')"
      :mod="{ inverted: props.inverted, disabled: props.disabled }"
    >
      <Box
        v-bind="barStyles"
        :mod="{ inverted: props.inverted, disabled: props.disabled }"
        :style="[
          barStyles.style,
          {
            '--slider-bar-width': `calc(${props.filled}% + 2 * var(--slider-size))`,
            '--slider-bar-offset': `calc(${props.offset}% - var(--slider-size))`,
          },
        ]"
      />

      <slot />

      <Marks
        :marks="props.marks"
        :min="props.min"
        :max="props.max"
        :value="props.value"
        :offset="props.marksOffset"
        :disabled="props.disabled"
        :inverted="props.inverted"
        :start-point-value="props.startPointValue"
      />
    </Box>
  </Box>
</template>
