<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { UnstyledButton, useDirection } from '@mantine-vue/core'
import { useDatesContext } from '../DatesProvider'
import Day from '../Day/Day.vue'
import WeekdaysRow from '../WeekdaysRow/WeekdaysRow.vue'
import { getWeekInTabOrder } from './get-week-in-tab-order'
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
  MonthInternalProps,
  MonthProps,
  RenderDaySlots,
} from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'Month' })

const props = withDefaults(defineProps<MonthProps & MonthInternalProps>(), {
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
  __withWeekControls: false,
})
const emit = defineEmits<MonthEmits>()
const slots = defineSlots<RenderDaySlots>()
const context = useDatesContext()
const { dir } = useDirection()
const hovered = ref<DateStringValue | null>(null)
const dayRefs: (HTMLElement | null | undefined)[][] = []
const weekControlRefs: (HTMLElement | null | undefined)[] = []

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

function isDayDisabled(date: DateStringValue) {
  return baseDisabled(date)
}

const weekInTabOrder = computed(() =>
  props.__withWeekControls
    ? getWeekInTabOrder({
        dates: rows.value,
        isDayDisabled,
        getWeekControlProps: props.__getWeekControlProps,
      })
    : -1,
)

function weekControlProps(weekStart: DateStringValue) {
  return props.__getWeekControlProps?.(weekStart) || {}
}

function weekControlAttributes(weekStart: DateStringValue) {
  const { selected, onClick, onKeydown, onKeyDown, onMouseenter, onMouseEnter, ...rest } =
    weekControlProps(weekStart)
  void selected
  void onClick
  void onKeydown
  void onKeyDown
  void onMouseenter
  void onMouseEnter
  return rest
}

function weekDisabled(week: DateStringValue[]) {
  return week.every(isDayDisabled) || !!weekControlProps(week[0]).disabled
}

function onWeekControlClick(weekStart: DateStringValue, event: MouseEvent) {
  weekControlProps(weekStart).onClick?.(event)
}

function onWeekControlMouseEnter(weekStart: DateStringValue, event: MouseEvent) {
  const controlProps = weekControlProps(weekStart)
  ;(controlProps.onMouseenter ?? controlProps.onMouseEnter)?.(event)
}

function onWeekControlKeydown(weekStart: DateStringValue, rowIndex: number, event: KeyboardEvent) {
  const controlProps = weekControlProps(weekStart)
  ;(controlProps.onKeydown ?? controlProps.onKeyDown)?.(event)
  if (props.__onWeekControlKeyDown) {
    props.__onWeekControlKeyDown(event, { rowIndex, date: weekStart })
    return
  }
  const direction = keyToDirection(event.key, dir.value)
  if (direction === 'up' || direction === 'down') {
    event.preventDefault()
    const next = weekControlRefs[rowIndex + (direction === 'up' ? -1 : 1)]
    next?.focus()
  }
}

function setWeekControlRef(rowIndex: number, node: any) {
  weekControlRefs[rowIndex] = node?.$el ?? node ?? undefined
}

function isSelectedDay(date: DateStringValue) {
  return !!(dayProps(date).selected ?? selected(date))
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
  delete attributes.selected
  delete attributes.inRange
  delete attributes.firstInRange
  delete attributes.lastInRange
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
    enabled.find(isSelectedDay) ??
    enabled.find((date) => dayjs().isSame(date, 'date')) ??
    enabled[0]
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
  if (props.__onDayKeyDown) {
    props.__onDayKeyDown(event, { date, rowIndex, cellIndex })
    return
  }
  const direction = keyToDirection(event.key, dir.value)
  if (direction) {
    event.preventDefault()
    focusAdjacentControl(dayRefs, rowIndex, cellIndex, direction)
  }
}

function getDayElement(date: DateStringValue) {
  const rowIndex = rows.value.findIndex((week) => week.includes(date))
  return rowIndex === -1 ? null : dayRefs[rowIndex]?.[rows.value[rowIndex].indexOf(date)] || null
}

function getWeekControlElement(weekStart: DateStringValue) {
  const rowIndex = rows.value.findIndex((week) => week[0] === weekStart)
  return rowIndex === -1 ? null : weekControlRefs[rowIndex] || null
}

function focusTabControl() {
  if (props.__withWeekControls) {
    weekControlRefs[weekInTabOrder.value]?.focus({ preventScroll: true })
    return
  }
  if (dateInTabOrder.value) getDayElement(dateInTabOrder.value)?.focus({ preventScroll: true })
}

defineExpose({ getDayElement, getWeekControlElement, focusTabControl })
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
          <UnstyledButton
            v-if="props.__withWeekControls"
            v-bind="weekControlAttributes(week[0])"
            :ref="(node: any) => setWeekControlRef(rowIndex, node)"
            :class="[classes.weekControl, weekControlAttributes(week[0]).class]"
            data-week-control
            :disabled="weekDisabled(week)"
            :data-disabled="weekDisabled(week) || undefined"
            :data-selected="weekControlProps(week[0]).selected || undefined"
            :tabindex="rowIndex === weekInTabOrder ? 0 : -1"
            @click="onWeekControlClick(week[0], $event)"
            @mouseenter="onWeekControlMouseEnter(week[0], $event)"
            @keydown="onWeekControlKeydown(week[0], rowIndex, $event)"
            >{{ getWeekNumber(week) }}</UnstyledButton
          >
          <template v-else>{{ getWeekNumber(week) }}</template>
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
            :selected="isSelectedDay(date)"
            :in-range="dayProps(date).inRange ?? inRange(date)"
            :first-in-range="dayProps(date).firstInRange ?? rangeStart(date)"
            :last-in-range="dayProps(date).lastInRange ?? rangeEnd(date)"
            :highlight-today="props.highlightToday"
            :full-width="props.fullWidth"
            :render-day="renderDay"
            :aria-label="dayAriaLabel(date)"
            :tabindex="
              props.static
                ? undefined
                : !props.__withWeekControls && date === dateInTabOrder
                  ? 0
                  : -1
            "
            :data-autofocus="isSelectedDay(date) || undefined"
            @click="onClick(date, $event)"
            @mouseenter="onMouseEnter(date, $event)"
            @keydown="onKeydown(date, rowIndex, cellIndex, $event)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
