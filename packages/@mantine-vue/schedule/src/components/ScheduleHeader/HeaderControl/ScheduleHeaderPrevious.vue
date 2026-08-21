<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { AccordionChevron, useDirection } from '@mantine-vue/core'
import { getLabel } from '../../../labels'
import { useScheduleHeaderLabels } from '../ScheduleHeader.context'
import HeaderControl from './HeaderControl.vue'
import type { HeaderControlOwnProps, HeaderControlSlots } from './HeaderControl.types'

defineOptions({
  name: 'ScheduleHeaderPrevious',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HeaderControlOwnProps>(), {
  interactive: undefined,
  radius: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<HeaderControlSlots>()

const attrs = useAttrs()
const { dir } = useDirection()
const labels = useScheduleHeaderLabels(() => props.labels)

/** The chevron points down by default, so it is rotated onto the reading direction. */
const chevronStyle = computed(() => ({
  transform: `rotate(${dir.value === 'rtl' ? -90 : 90}deg)`,
}))
</script>

<template>
  <HeaderControl
    data-type="previous"
    :aria-label="getLabel('previous', labels)"
    square
    :active="props.active"
    :radius="props.radius"
    :interactive="props.interactive"
    :labels="props.labels"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
    v-bind="attrs"
  >
    <slot>
      <AccordionChevron :style="chevronStyle" />
    </slot>
  </HeaderControl>
</template>
