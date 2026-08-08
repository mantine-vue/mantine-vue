<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import LegacyComponent from '../Calendar/Calendar.vue'
import { useForwardedProps } from '../../utils/use-forwarded-props'
import type { CalendarProps } from '../../types'

defineOptions({
  name: 'MonthLevel',
  inheritAttrs: false,
})

const props = defineProps<CalendarProps>()
const emit = defineEmits<{
  'update:level': [value: any]
  'level-change': [value: any]
  'update:date': [value: any]
  'date-change': [value: any]
}>()
const attrs = useAttrs()
const slots = useSlots()
const forwardedProps = useForwardedProps(props)
</script>

<template>
  <LegacyComponent
    v-bind="{ ...attrs, ...forwardedProps }"
    @update:level="emit('update:level', $event)"
    @level-change="emit('level-change', $event)"
    @update:date="emit('update:date', $event)"
    @date-change="emit('date-change', $event)"
  >
    <template v-for="(_, name) in slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </LegacyComponent>
</template>
