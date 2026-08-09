<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import PickerControl from '../PickerControl/PickerControl.vue'
import { focusAdjacentControl, getYearRange, keyToDirection, setGridRef } from '../../utils'
import type { DateStringValue, YearsListEmits, YearsListProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'YearsList' })
const props = withDefaults(defineProps<YearsListProps>(), {
  decade: () => dayjs().format('YYYY-MM-DD'),
  yearsListFormat: 'YYYY',
  fullWidth: false,
})
const emit = defineEmits<YearsListEmits>()
const controlRefs: (HTMLElement | null | undefined)[][] = []
const years = computed(() => getYearRange(props.decade))
const controlProps = (date: DateStringValue) => props.getYearControlProps?.(date) || {}
const enabled = (date: DateStringValue) =>
  !(
    (props.minDate && dayjs(date).endOf('year').isBefore(props.minDate, 'day')) ||
    (props.maxDate && dayjs(date).startOf('year').isAfter(props.maxDate, 'day')) ||
    controlProps(date).disabled
  )
const selected = (date: DateStringValue) =>
  Array.isArray(props.value)
    ? (props.value as DateStringValue[]).some((item) => dayjs(item).isSame(date, 'year'))
    : !!props.value && dayjs(props.value as any).isSame(date, 'year')
const tabDate = computed(
  () =>
    years.value.filter(enabled).find(selected) ??
    years.value.filter(enabled).find((date) => dayjs().isSame(date, 'year')) ??
    years.value.filter(enabled)[0],
)
const label = (date: DateStringValue) =>
  typeof props.yearsListFormat === 'function'
    ? props.yearsListFormat(date)
    : dayjs(date).format(props.yearsListFormat)
function onClick(date: DateStringValue, event: MouseEvent) {
  controlProps(date).onClick?.(event)
  if (enabled(date)) emit('year-select', date)
}
function onMouseEnter(date: DateStringValue, event: MouseEvent) {
  controlProps(date).onMouseenter?.(event)
  emit('year-mouse-enter', date)
}
function onKeydown(date: DateStringValue, index: number, event: KeyboardEvent) {
  controlProps(date).onKeydown?.(event)
  const direction = keyToDirection(event.key)
  if (direction) {
    event.preventDefault()
    focusAdjacentControl(controlRefs, Math.floor(index / 3), index % 3, direction)
  }
}
</script>

<template>
  <SimpleGrid
    :cols="3"
    :spacing="4"
    :class="classes.controlsGrid"
    :data-full-width="props.fullWidth || undefined"
  >
    <PickerControl
      v-for="(date, index) in years"
      :key="date"
      v-bind="controlProps(date)"
      :ref="(node: any) => setGridRef(controlRefs, Math.floor(index / 3), index % 3, node)"
      :full-width="props.fullWidth"
      :disabled="!enabled(date) || controlProps(date).disabled"
      :selected="selected(date)"
      :tabindex="date === tabDate ? 0 : -1"
      :data-autofocus="selected(date) || undefined"
      @click="onClick(date, $event)"
      @mouseenter="onMouseEnter(date, $event)"
      @keydown="onKeydown(date, index, $event)"
      >{{ label(date) }}</PickerControl
    >
  </SimpleGrid>
</template>
