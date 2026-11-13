<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import Calendar from '../Calendar/Calendar.vue'
import { useDatesContext } from '../DatesProvider'
import { PresetsList } from '../PresetsList'
import { getEndOfWeek, getNextPickerValue, getStartOfWeek, isSameMonth } from '../../utils'
import type {
  CalendarLevel,
  DatePickerValueType,
  DateStringValue,
  RenderDaySlots,
} from '../../types'
import type { WeekPickerProps } from './WeekPicker.types'
import { getWeekControlState, normalizeWeekValue } from './week-utils'
import classes from './WeekPicker.module.css'

defineOptions({ name: 'WeekPicker', inheritAttrs: false })
const props = withDefaults(defineProps<WeekPickerProps>(), {
  type: 'default',
  allowDeselect: true,
  sortDates: true,
  withCellSpacing: true,
  numberOfColumns: 1,
  hideOutsideDates: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValueType]
  change: [value: DatePickerValueType]
}>()
const slots = defineSlots<RenderDaySlots>()
const attrs = useAttrs()
const context = useDatesContext()
const firstDayOfWeek = computed(() => props.firstDayOfWeek ?? context.firstDayOfWeek)

const finalValue = computed<DatePickerValueType>(() =>
  props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
)
const [value, setValue] = useUncontrolled<DatePickerValueType>({
  value: computed(() =>
    props.modelValue === undefined
      ? undefined
      : normalizeWeekValue(props.modelValue, firstDayOfWeek.value),
  ),
  defaultValue: normalizeWeekValue(props.defaultValue, firstDayOfWeek.value),
  finalValue: finalValue.value,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})

const hoveredWeek = ref<DateStringValue | null>(null)
const calendarDate = ref<DateStringValue>()
const calendarLevel = ref<CalendarLevel>()

const calendarProps = computed(() => {
  const {
    modelValue,
    defaultValue,
    allowDeselect,
    sortDates,
    presets,
    getWeekControlProps,
    getDayProps,
    getMonthControlProps,
    getYearControlProps,
    hideOutsideDates,
    date,
    level,
    ...rest
  } = props
  void modelValue
  void defaultValue
  void allowDeselect
  void sortDates
  void presets
  void getWeekControlProps
  void getDayProps
  void getMonthControlProps
  void getYearControlProps
  void hideOutsideDates
  void date
  void level
  return rest
})

const weekStartOf = (date: DateStringValue) => getStartOfWeek(date, firstDayOfWeek.value)
const isWeekDisabled = (weekStart: DateStringValue) =>
  !!props.getWeekControlProps?.(weekStart)?.disabled

const weekState = (weekStart: DateStringValue) =>
  getWeekControlState({
    weekStart,
    value: value.value,
    type: props.type,
    hoveredWeek: hoveredWeek.value,
  })

function selectWeek(weekStart: DateStringValue) {
  if (isWeekDisabled(weekStart)) return
  if (props.type === 'default' && props.allowDeselect && value.value === weekStart) setValue(null)
  else setValue(getNextPickerValue(value.value, weekStart, props.type, props.sortDates))
}

function hoverDay(date: DateStringValue) {
  hoveredWeek.value = weekStartOf(date)
}

function getDayProps(date: DateStringValue) {
  const weekStart = weekStartOf(date)
  const state = weekState(weekStart)
  return {
    ...state,
    'data-week-hovered': hoveredWeek.value === weekStart || undefined,
    ...(isWeekDisabled(weekStart) ? { disabled: true } : {}),
    ...props.getDayProps?.(date),
  }
}

function getWeekControlProps(weekStart: DateStringValue) {
  const state = weekState(weekStart)
  const userProps = props.getWeekControlProps?.(weekStart) || {}
  const locale = props.locale || context.locale || 'en'
  return {
    selected: state.selected,
    'aria-label': `${dayjs(weekStart).locale(locale).format('D MMMM YYYY')} – ${dayjs(
      getEndOfWeek(weekStart, firstDayOfWeek.value),
    )
      .locale(locale)
      .format('D MMMM YYYY')}`,
    'data-autofocus': state.selected || undefined,
    ...userProps,
    onClick: (event: MouseEvent) => {
      userProps.onClick?.(event)
      selectWeek(weekStart)
    },
    onMouseenter: (event: MouseEvent) => {
      ;(userProps.onMouseenter ?? userProps.onMouseEnter)?.(event)
      hoveredWeek.value = weekStart
    },
  }
}

const getMonthControlProps = (date: DateStringValue) => ({
  selected: typeof value.value === 'string' ? isSameMonth(date, value.value) : false,
  ...props.getMonthControlProps?.(date),
})

const getYearControlProps = (date: DateStringValue) => ({
  selected: typeof value.value === 'string' ? dayjs(date).isSame(value.value, 'year') : false,
  ...props.getYearControlProps?.(date),
})

function selectPreset(next: DatePickerValueType) {
  const normalized = normalizeWeekValue(next, firstDayOfWeek.value)
  const first = Array.isArray(normalized) ? normalized[0] : normalized
  const presetStart = Array.isArray(next) ? next[0] : next
  if (first !== undefined) {
    if (presetStart ?? first) calendarDate.value = (presetStart ?? first) as DateStringValue
    calendarLevel.value = 'month'
    setValue(normalized)
  }
}
</script>

<template>
  <div v-if="props.presets?.length" v-bind="attrs" :class="[classes.weekPickerRoot, attrs.class]">
    <PresetsList :presets="props.presets" @preset-select="selectPreset" />
    <Calendar
      v-bind="calendarProps"
      :class="classes.weekPicker"
      :value="typeof value === 'string' ? value : null"
      :date="props.date ?? calendarDate"
      :level="props.level ?? calendarLevel"
      :hide-outside-dates="props.hideOutsideDates ?? props.numberOfColumns !== 1"
      with-week-numbers
      :__with-week-controls="true"
      :__get-week-control-props="getWeekControlProps"
      :get-day-props="getDayProps"
      :get-month-control-props="getMonthControlProps"
      :get-year-control-props="getYearControlProps"
      @date-change="calendarDate = $event"
      @level-change="calendarLevel = $event"
      @day-click="selectWeek(weekStartOf($event))"
      @day-mouse-enter="hoverDay"
      @mouseleave="hoveredWeek = null"
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
    :class="[classes.weekPicker, attrs.class]"
    :value="typeof value === 'string' ? value : null"
    :date="props.date ?? calendarDate"
    :level="props.level ?? calendarLevel"
    :hide-outside-dates="props.hideOutsideDates ?? props.numberOfColumns !== 1"
    with-week-numbers
    :__with-week-controls="true"
    :__get-week-control-props="getWeekControlProps"
    :get-day-props="getDayProps"
    :get-month-control-props="getMonthControlProps"
    :get-year-control-props="getYearControlProps"
    @date-change="calendarDate = $event"
    @level-change="calendarLevel = $event"
    @day-click="selectWeek(weekStartOf($event))"
    @day-mouse-enter="hoverDay"
    @mouseleave="hoveredWeek = null"
  >
    <template v-if="slots.renderDay" #renderDay="scope"
      ><slot name="renderDay" v-bind="scope"
    /></template>
    <template v-if="slots.day" #day="scope"><slot name="day" v-bind="scope" /></template>
  </Calendar>
</template>
