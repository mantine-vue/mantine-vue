<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { useDatesContext } from '../DatesProvider'
import Day from '../Day/Day.vue'
import WeekdaysRow from '../WeekdaysRow/WeekdaysRow.vue'
import {
  focusAdjacentControl,
  getMonthDays,
  getWeekNumber,
  isAfterMax,
  isBeforeMin,
  isSameDate,
  keyToDirection,
  setGridRef,
} from '../../utils'
import type {
  DateStringValue,
  DatesRangeValue,
  DateValue,
  MonthEmits,
  MonthProps,
  RenderDaySlots,
} from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'Month' })

const props = withDefaults(defineProps<MonthProps>(), {
  month: () => dayjs().format('YYYY-MM-DD'),
  value: null,
  type: 'default',
  hideOutsideDates: false,
  hideWeekdays: false,
  withCellSpacing: true,
  highlightToday: false,
  withWeekNumbers: false,
  static: false,
  fullWidth: false,
})
const emit = defineEmits<MonthEmits>()
const slots = defineSlots<RenderDaySlots>()
const context = useDatesContext()
const hovered = ref<DateStringValue | null>(null)
const dayRefs: (HTMLElement | null | undefined)[][] = []

const firstDay = computed(() => props.firstDayOfWeek ?? context.firstDayOfWeek)
const rows = computed(() => getMonthDays(props.month, firstDay.value, context.consistentWeeks))

function selected(date: DateStringValue) {
  if (props.type === 'multiple') return Array.isArray(props.value) && props.value.includes(date)
  if (props.type === 'range') {
    const [start, end] = Array.isArray(props.value)
      ? (props.value as DatesRangeValue)
      : [null, null]
    return isSameDate(date, start) || isSameDate(date, end)
  }
  return isSameDate(date, props.value as DateValue)
}

function inRange(date: DateStringValue) {
  if (props.type !== 'range' || !Array.isArray(props.value)) return false
  const [start, end] = props.value as DatesRangeValue
  const rangeEnd = end || hovered.value
  if (!start || !rangeEnd) return false
  const [first, last] = [start, rangeEnd].sort((a, b) => (dayjs(a).isAfter(b) ? 1 : -1))
  return dayjs(date).isAfter(first, 'day') && dayjs(date).isBefore(last, 'day')
}

function outside(date: DateStringValue) {
  return !dayjs(date).isSame(props.month, 'month')
}

function baseDisabled(date: DateStringValue) {
  return (
    isBeforeMin(date, props.minDate) ||
    isAfterMax(date, props.maxDate) ||
    !!props.excludeDate?.(date)
  )
}

function dayProps(date: DateStringValue) {
  return props.getDayProps?.(date) || {}
}

function dayAttributes(date: DateStringValue) {
  const attributes = { ...dayProps(date) }
  delete attributes.onClick
  delete attributes.onMouseenter
  delete attributes.onMouseEnter
  delete attributes.onKeydown
  delete attributes.onKeyDown
  return attributes
}

function dayAriaLabel(date: DateStringValue) {
  return (
    props.getDayAriaLabel?.(date) ||
    dayjs(date)
      .locale(props.locale || context.locale)
      .format('D MMMM YYYY')
  )
}

const dateInTabOrder = computed(() => {
  const enabled = rows.value.flat().filter((date) => {
    const controlProps = dayProps(date)
    return (
      !baseDisabled(date) && !controlProps.disabled && (!props.hideOutsideDates || !outside(date))
    )
  })
  return (
    enabled.find(selected) ?? enabled.find((date) => dayjs().isSame(date, 'date')) ?? enabled[0]
  )
})

const renderDay =
  props.renderDay ??
  ((slots.renderDay ?? slots.day)
    ? (date: DateStringValue) => (slots.renderDay ?? slots.day)?.({ date })
    : undefined)

function rangeStart(date: DateStringValue) {
  if (props.type !== 'range' || !Array.isArray(props.value) || !props.value[0]) return false
  const end = props.value[1] || hovered.value
  const first = end && dayjs(end).isBefore(props.value[0], 'day') ? end : props.value[0]
  return isSameDate(date, first)
}

function rangeEnd(date: DateStringValue) {
  if (props.type !== 'range' || !Array.isArray(props.value) || !props.value[0]) return false
  const end = props.value[1] || hovered.value
  if (!end) return false
  const last = dayjs(end).isAfter(props.value[0], 'day') ? end : props.value[0]
  return isSameDate(date, last)
}

function onClick(date: DateStringValue, event: MouseEvent) {
  dayProps(date).onClick?.(event)
  if (!baseDisabled(date) && !props.static) emit('day-click', date)
}

function onMouseEnter(date: DateStringValue, event: MouseEvent) {
  hovered.value = date
  const controlProps = dayProps(date)
  ;(controlProps.onMouseenter ?? controlProps.onMouseEnter)?.(event)
  emit('day-mouse-enter', date)
}

function onKeydown(
  date: DateStringValue,
  rowIndex: number,
  cellIndex: number,
  event: KeyboardEvent,
) {
  const controlProps = dayProps(date)
  ;(controlProps.onKeydown ?? controlProps.onKeyDown)?.(event)
  const direction = keyToDirection(event.key)
  if (direction) {
    event.preventDefault()
    focusAdjacentControl(dayRefs, rowIndex, cellIndex, direction)
  }
}
</script>

<template>
  <table :class="classes.month" :data-full-width="props.fullWidth || undefined">
    <thead v-if="!props.hideWeekdays">
      <WeekdaysRow
        :first-day-of-week="firstDay"
        :weekend-days="props.weekendDays"
        :locale="props.locale"
        :weekday-format="props.weekdayFormat"
        :with-week-numbers="props.withWeekNumbers"
      />
    </thead>
    <tbody>
      <tr v-for="(week, rowIndex) in rows" :key="week[0]" :class="classes.monthRow">
        <td v-if="props.withWeekNumbers" :class="classes.weekNumber">
          {{ getWeekNumber(week[0]) }}
        </td>
        <td
          v-for="(date, cellIndex) in week"
          :key="date"
          :class="classes.monthCell"
          :data-with-spacing="props.withCellSpacing || undefined"
        >
          <Day
            v-bind="dayAttributes(date)"
            :ref="(node: any) => setGridRef(dayRefs, rowIndex, cellIndex, node)"
            :date="date"
            :static="props.static"
            :disabled="baseDisabled(date) || dayProps(date).disabled"
            :weekend="(props.weekendDays ?? context.weekendDays).includes(dayjs(date).day())"
            :outside="outside(date)"
            :hidden="props.hideOutsideDates && outside(date)"
            :selected="selected(date)"
            :in-range="inRange(date)"
            :first-in-range="rangeStart(date)"
            :last-in-range="rangeEnd(date)"
            :highlight-today="props.highlightToday"
            :full-width="props.fullWidth"
            :render-day="renderDay"
            :aria-label="dayAriaLabel(date)"
            :tabindex="props.static ? undefined : date === dateInTabOrder ? 0 : -1"
            :data-autofocus="selected(date) || undefined"
            @click="onClick(date, $event)"
            @mouseenter="onMouseEnter(date, $event)"
            @keydown="onKeydown(date, rowIndex, cellIndex, $event)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
