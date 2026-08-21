<script setup lang="ts">
import { useAttrs } from 'vue'
import { getLabel } from '../../../labels'
import { useScheduleHeaderLabels } from '../ScheduleHeader.context'
import HeaderControl from './HeaderControl.vue'
import type { HeaderControlOwnProps, HeaderControlSlots } from './HeaderControl.types'

defineOptions({
  name: 'ScheduleHeaderToday',
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
const labels = useScheduleHeaderLabels(() => props.labels)
</script>

<template>
  <HeaderControl
    data-type="today"
    :aria-label="getLabel('today', labels)"
    :active="props.active"
    :square="props.square"
    :radius="props.radius"
    :interactive="props.interactive"
    :labels="props.labels"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
    v-bind="attrs"
  >
    <slot>{{ getLabel('today', labels) }}</slot>
  </HeaderControl>
</template>
