<script lang="ts">
import type { VNodeChild } from 'vue'

/**
 * `SliderMark.label` is arbitrary renderable content, so it has to be rendered as a
 * child rather than interpolated — `{{ }}` would stringify a VNode. Declared at module
 * scope so the component identity is stable across renders.
 */
const MarkLabel = (props: { label: any }): VNodeChild => props.label

MarkLabel.props = ['label']

export { MarkLabel }
</script>

<script setup lang="ts">
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
import type { SliderMark } from '../SliderMark'
import { getPosition, isMarkFilled } from '../utils/slider-utils'
import type { SliderMarksProps } from './Marks.types'

defineOptions({ name: 'SliderMarks' })

const props = withDefaults(defineProps<SliderMarksProps>(), {
  marks: undefined,
  offset: undefined,
  disabled: false,
  inverted: false,
  startPointValue: undefined,
})

const ctx = useSliderContext()

function markOffset(value: number) {
  return `${getPosition({ value, min: props.min, max: props.max })}%`
}

function isFilled(mark: SliderMark) {
  return isMarkFilled({
    mark,
    value: props.value,
    offset: props.offset,
    inverted: props.inverted,
    startPointValue: props.startPointValue,
  })
}
</script>

<template>
  <div v-if="props.marks">
    <template v-for="(mark, index) in props.marks" :key="index">
      <Box
        v-if="!mark.hidden"
        v-bind="ctx.getStyles('markWrapper')"
        :style="[ctx.getStyles('markWrapper').style, { '--mark-offset': markOffset(mark.value) }]"
      >
        <Box
          v-bind="ctx.getStyles('mark')"
          :mod="{ filled: isFilled(mark), disabled: props.disabled }"
        />

        <div v-if="mark.label != null" v-bind="ctx.getStyles('markLabel')">
          <MarkLabel :label="mark.label" />
        </div>
      </Box>
    </template>
  </div>
</template>
