<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, useAttrs } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import Calendar from '../Calendar/Calendar.vue'
import { getNextPickerValue, isInRangeGranular, isSameDate } from '../../utils'
import type {
  DatePickerValueType,
  DatesRangeValue,
  DateStringValue,
  DateValue,
  MonthPickerProps,
} from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'MonthPicker', inheritAttrs: false })
const props = withDefaults(defineProps<MonthPickerProps>(), {
  type: 'default',
  allowDeselect: true,
  sortDates: true,
  withCellSpacing: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValueType]
  change: [value: DatePickerValueType]
}>()
const attrs = useAttrs()
const finalValue = computed<DatePickerValueType>(() =>
  props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
)
const [value, setValue] = useUncontrolled<DatePickerValueType>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: finalValue.value,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const hovered = ref<DateStringValue | null>(null)
const calendarDate = ref<DateStringValue>()
const calendarProps = computed(() => {
  const {
    modelValue,
    defaultValue,
    allowDeselect,
    sortDates,
    presets,
    getMonthControlProps,
    ...rest
  } = props
  void modelValue
  void defaultValue
  void allowDeselect
  void sortDates
  void presets
  void getMonthControlProps
  return rest
})
function select(date: DateStringValue) {
  if (props.type === 'default' && props.allowDeselect && isSameDate(value.value as DateValue, date))
    setValue(null)
  else setValue(getNextPickerValue(value.value, date, props.type, props.sortDates))
  hovered.value = null
}
function setCalendarDate(next: DateStringValue) {
  calendarDate.value = next
}
function controlProps(date: DateStringValue) {
  const external = props.getMonthControlProps?.(date) || {}
  if (props.type !== 'range' || !Array.isArray(value.value)) return external
  const [start, end] = value.value as DatesRangeValue
  const previewEnd = start && !end ? hovered.value : end
  if (!start || !previewEnd) return external
  const boundaries = [start, previewEnd].sort((a, b) => (dayjs(a).isAfter(b, 'month') ? 1 : -1))
  return {
    inRange: isInRangeGranular(date, [start, previewEnd], 'month'),
    firstInRange: dayjs(date).isSame(boundaries[0], 'month'),
    lastInRange: dayjs(date).isSame(boundaries[1], 'month'),
    ...external,
  }
}
function hover(date: DateStringValue) {
  const [start, end] = Array.isArray(value.value) ? (value.value as DatesRangeValue) : [null, null]
  if (props.type === 'range' && start && !end) hovered.value = date
}
function selectPreset(next: DatePickerValueType) {
  const selected = Array.isArray(next) ? next[0] : next
  if (selected) calendarDate.value = selected
  setValue(next)
}
</script>

<template>
  <div v-if="props.presets?.length" :class="classes.datePickerRoot">
    <div :class="classes.presetsList">
      <UnstyledButton
        v-for="(preset, index) in props.presets"
        :key="index"
        :class="classes.presetButton"
        @click="selectPreset(preset.value)"
        @mousedown.prevent
        >{{ preset.label }}</UnstyledButton
      >
    </div>
    <Calendar
      v-bind="{ ...attrs, ...calendarProps }"
      :type="props.type"
      :value="value"
      :date="calendarDate"
      default-level="year"
      min-level="year"
      :get-month-control-props="controlProps"
      @date-change="setCalendarDate"
      @month-select="select"
      @month-mouse-enter="hover"
      @mouseleave="hovered = null"
    />
  </div>
  <Calendar
    v-else
    v-bind="{ ...attrs, ...calendarProps }"
    :type="props.type"
    :value="value"
    :date="calendarDate"
    default-level="year"
    min-level="year"
    :get-month-control-props="controlProps"
    @date-change="setCalendarDate"
    @month-select="select"
    @month-mouse-enter="hover"
    @mouseleave="hovered = null"
  />
</template>
