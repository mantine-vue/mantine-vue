<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import Calendar from '../Calendar/Calendar.vue'
import { getNextPickerValue, isSameDate } from '../../utils'
import type {
  CalendarLevel,
  DatePickerProps,
  DatePickerValueType,
  DateStringValue,
  DateValue,
  RenderDaySlots,
} from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'DatePicker', inheritAttrs: false })
const props = withDefaults(defineProps<DatePickerProps>(), {
  type: 'default',
  allowDeselect: true,
  sortDates: true,
  withCellSpacing: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValueType]
  change: [value: DatePickerValueType]
}>()
const slots = defineSlots<RenderDaySlots>()
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
const calendarDate = ref<DateStringValue>()
const calendarLevel = ref<CalendarLevel>()
const calendarProps = computed(() => {
  const { modelValue, defaultValue, allowDeselect, sortDates, presets, ...rest } = props
  void modelValue
  void defaultValue
  void allowDeselect
  void sortDates
  void presets
  return rest
})
function selectDate(date: DateStringValue) {
  if (props.type === 'default' && props.allowDeselect && isSameDate(value.value as DateValue, date))
    setValue(null)
  else setValue(getNextPickerValue(value.value, date, props.type, props.sortDates))
}
function setCalendarDate(next: DateStringValue) {
  calendarDate.value = next
}
function setCalendarLevel(next: CalendarLevel) {
  calendarLevel.value = next
}
function selectPreset(next: DatePickerValueType) {
  const selected = Array.isArray(next) ? next[0] : next
  if (selected) {
    calendarDate.value = selected
    calendarLevel.value = 'month'
  }
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
      :level="calendarLevel"
      @date-change="setCalendarDate"
      @level-change="setCalendarLevel"
      @day-click="selectDate"
    >
      <template v-if="slots.renderDay" #renderDay="scope"
        ><slot name="renderDay" v-bind="scope"
      /></template>
      <template v-if="slots.day" #day="scope"><slot name="day" v-bind="scope" /></template>
    </Calendar>
  </div>
  <Calendar
    v-else
    v-bind="{ ...attrs, ...calendarProps }"
    :type="props.type"
    :value="value"
    :date="calendarDate"
    :level="calendarLevel"
    @date-change="setCalendarDate"
    @level-change="setCalendarLevel"
    @day-click="selectDate"
  >
    <template v-if="slots.renderDay" #renderDay="scope"
      ><slot name="renderDay" v-bind="scope"
    /></template>
    <template v-if="slots.day" #day="scope"><slot name="day" v-bind="scope" /></template>
  </Calendar>
</template>
