<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, getCurrentInstance, nextTick, ref, useAttrs } from 'vue'
import { Box, useDirection } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue'
import Month from '../Month/Month.vue'
import MonthsList from '../MonthsList/MonthsList.vue'
import YearsList from '../YearsList/YearsList.vue'
import {
  getDecadeLabel,
  getDefaultClampedDate,
  getMonthLabel,
  getYearRange,
  keyToDirection,
  toDateString,
} from '../../utils'
import type {
  CalendarLevel,
  CalendarProps,
  ControlEdgeCrossPayload,
  DateStringValue,
  GridDirection,
  MonthInternalProps,
  RenderDaySlots,
} from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'Calendar', inheritAttrs: false })
const props = withDefaults(
  defineProps<
    CalendarProps & Pick<MonthInternalProps, '__withWeekControls' | '__getWeekControlProps'>
  >(),
  {
    maxLevel: 'decade',
    minLevel: 'month',
    numberOfColumns: 1,
    type: 'default',
    monthLabelFormat: 'MMMM YYYY',
    yearLabelFormat: 'YYYY',
    monthsListFormat: 'MMM',
    yearsListFormat: 'YYYY',
    hideOutsideDates: false,
    hideWeekdays: false,
    withCellSpacing: true,
    highlightToday: false,
    withWeekNumbers: false,
    static: false,
    fullWidth: false,
    withNativeLevelSelect: false,
    __withWeekControls: false,
  },
)
const emit = defineEmits<{
  'update:level': [value: CalendarLevel]
  'level-change': [value: CalendarLevel]
  'update:date': [value: DateStringValue]
  'date-change': [value: DateStringValue]
  'day-click': [date: DateStringValue]
  'day-mouse-enter': [date: DateStringValue]
  'month-select': [date: DateStringValue]
  'month-mouse-enter': [date: DateStringValue]
  'year-select': [date: DateStringValue]
  'year-mouse-enter': [date: DateStringValue]
}>()
const slots = defineSlots<RenderDaySlots>()
const attrs = useAttrs()
const instance = getCurrentInstance()
const { dir } = useDirection()
const rootElement = ref<HTMLElement | null>(null)
const grids: any[] = []
const order: CalendarLevel[] = ['month', 'year', 'decade']
const clampLevel = (level?: CalendarLevel) =>
  order[
    Math.max(
      order.indexOf(props.minLevel),
      Math.min(order.indexOf(props.maxLevel), level ? order.indexOf(level) : 0),
    )
  ]
const nextLevel = (level: CalendarLevel) => order[Math.min(2, order.indexOf(level) + 1)]
const [level, setLevel] = useUncontrolled<CalendarLevel>({
  value: computed(() => (props.level === undefined ? undefined : clampLevel(props.level))),
  defaultValue: props.defaultLevel === undefined ? undefined : clampLevel(props.defaultLevel),
  finalValue: clampLevel(),
  onChange: (value) => {
    emit('update:level', value)
    emit('level-change', value)
  },
})
const [date, setDate] = useUncontrolled<DateStringValue>({
  value: computed(() => toDateString(props.date) || undefined),
  defaultValue: toDateString(props.defaultDate) || undefined,
  finalValue: getDefaultClampedDate({ minDate: props.minDate, maxDate: props.maxDate }),
  onChange: (value) => {
    emit('update:date', value)
    emit('date-change', value)
  },
})
const scroll = computed(() => props.columnsToScroll || props.numberOfColumns || 1)
const columns = computed(() =>
  Array.from({ length: props.numberOfColumns || 1 }, (_, column) => {
    const multiplier = level.value === 'decade' ? 10 : 1
    const unit = level.value === 'month' ? 'month' : 'year'
    return dayjs(date.value)
      .add(column * multiplier, unit)
      .format('YYYY-MM-DD')
  }),
)
const hasDateListener = () => {
  const vnodeProps = instance?.vnode.props
  return !!(
    vnodeProps?.['onUpdate:date'] ||
    vnodeProps?.onDateChange ||
    vnodeProps?.['onDate-change']
  )
}
const updateDate = (amount: number, unit: 'month' | 'year') =>
  setDate(dayjs(date.value).add(amount, unit).format('YYYY-MM-DD'))
const monthLabel = (value: DateStringValue) =>
  typeof props.monthLabelFormat === 'function'
    ? props.monthLabelFormat(value)
    : getMonthLabel(value, props.monthLabelFormat, props.locale)
const yearLabel = (value: DateStringValue) =>
  typeof props.yearLabelFormat === 'function'
    ? props.yearLabelFormat(value)
    : dayjs(value).format(props.yearLabelFormat)
const decadeLabel = (value: DateStringValue) => {
  const years = getYearRange(value)
  return props.decadeLabelFormat?.(years[0], years.at(-1)!) ?? getDecadeLabel(value)
}
const renderDay =
  props.renderDay ??
  ((slots.renderDay ?? slots.day)
    ? (value: DateStringValue) => (slots.renderDay ?? slots.day)?.({ date: value })
    : undefined)
function setRootRef(node: any) {
  rootElement.value = node?.$el ?? node ?? null
}

function setGridRef(column: number, node: any) {
  grids[column] = node
}

interface PendingLevelFocus {
  target: 'level' | 'grid'
  index: number
  level: CalendarLevel
}

let pendingLevelFocus: PendingLevelFocus | null = null

function changeLevel(nextLevel: CalendarLevel) {
  const root = rootElement.value
  if (!props.static && root && typeof document !== 'undefined') {
    const activeElement = document.activeElement
    const focusWithin =
      !activeElement || activeElement === document.body || root.contains(activeElement)
    const controls = Array.from(root.querySelectorAll('[data-level-control]'))
    const index = activeElement ? controls.indexOf(activeElement) : -1
    pendingLevelFocus = focusWithin
      ? {
          target: index === -1 ? 'grid' : 'level',
          index: Math.max(index, 0),
          level: level.value,
        }
      : null
  }

  setLevel(nextLevel)

  nextTick(() => {
    const request = pendingLevelFocus
    pendingLevelFocus = null
    if (!request || request.level === level.value || !rootElement.value) return
    let node: HTMLElement | null = null
    if (request.target === 'level') {
      const controls = rootElement.value.querySelectorAll<HTMLElement>('button[data-level-control]')
      node = controls[Math.min(request.index, controls.length - 1)] || null
    }
    if (node) node.focus({ preventScroll: true })
    else grids[0]?.focusTabControl?.()
  })
}

function selectMonth(value: DateStringValue) {
  setDate(value)
  emit('month-select', value)
  changeLevel(clampLevel('month'))
}
function selectYear(value: DateStringValue) {
  setDate(value)
  emit('year-select', value)
  changeLevel(clampLevel('year'))
}

const lastColumnDate = computed(() => columns.value[columns.value.length - 1] || date.value)

function isEdgeDisabled(edge: 'previous' | 'next') {
  if (edge === 'previous') {
    if (!props.minDate) return false
    if (level.value === 'month') return !dayjs(date.value).startOf('month').isAfter(props.minDate)
    if (level.value === 'year') return !dayjs(date.value).startOf('year').isAfter(props.minDate)
    return !dayjs(getYearRange(date.value)[0]).startOf('year').isAfter(props.minDate)
  }

  if (!props.maxDate) return false
  if (level.value === 'month')
    return !dayjs(lastColumnDate.value).endOf('month').isBefore(props.maxDate)
  if (level.value === 'year')
    return !dayjs(lastColumnDate.value).endOf('year').isBefore(props.maxDate)
  return !dayjs(getYearRange(lastColumnDate.value).at(-1)!).endOf('year').isBefore(props.maxDate)
}

function moveToEdge(edge: 'previous' | 'next') {
  const amount = edge === 'previous' ? -scroll.value : scroll.value
  if (level.value === 'month') updateDate(amount, 'month')
  else if (level.value === 'year') updateDate(amount, 'year')
  else updateDate(amount * 10, 'year')
}

function handleGridEdgeCross(
  column: number,
  { edge, direction, cellIndex }: ControlEdgeCrossPayload,
) {
  const vertical = direction === 'up' || direction === 'down'
  const request: [GridDirection, number | 'last', number | 'last'] = [
    direction,
    edge === 'previous' ? 'last' : 0,
    vertical ? cellIndex : edge === 'previous' ? 'last' : 0,
  ]
  const target = edge === 'previous' ? column - 1 : column + 1
  if (target >= 0 && target < columns.value.length) {
    grids[target]?.focusControl?.(...request)
    return
  }
  if (isEdgeDisabled(edge)) return
  const previousDate = date.value
  moveToEdge(edge)
  nextTick(() => {
    if (date.value === previousDate) return
    grids[edge === 'previous' ? columns.value.length - 1 : 0]?.focusControl?.(...request)
  })
}

const DAY_STEPS: Record<GridDirection, number> = { up: -7, down: 7, left: -1, right: 1 }

interface PendingDayFocus {
  date: DateStringValue
  step: number
  month: DateStringValue
  weekControls: boolean
  revert?: boolean
}

const addDays = (value: DateStringValue, days: number) =>
  dayjs(value).add(days, 'day').format('YYYY-MM-DD')

function getRenderedDayNodes(value: DateStringValue, weekControls: boolean) {
  return columns.value
    .map((_, column) =>
      weekControls
        ? (grids[column]?.getWeekControlElement?.(value) as HTMLButtonElement | null)
        : (grids[column]?.getDayElement?.(value) as HTMLButtonElement | null),
    )
    .filter((node): node is HTMLButtonElement => !!node && !node.hasAttribute('data-hidden'))
}

function focusDayNode({
  value,
  step,
  weekControls,
  allowCrossing,
}: {
  value: DateStringValue
  step: number
  weekControls: boolean
  allowCrossing: boolean
}) {
  let current = value
  for (let index = 0; index < 100; index += 1) {
    const nodes = getRenderedDayNodes(current, weekControls)
    if (nodes.length === 0) {
      if (allowCrossing) crossMonth(current, step, weekControls)
      return false
    }

    const enabled = nodes.filter((node) => !node.disabled)
    const node = enabled.find((item) => !item.hasAttribute('data-outside')) || enabled[0]
    if (node) {
      node.focus()
      return true
    }

    current = addDays(current, step)
  }
  return false
}

function processPendingDayFocus(request: PendingDayFocus) {
  if (request.month === date.value) return
  const focused = focusDayNode({
    value: request.date,
    step: request.step,
    weekControls: request.weekControls,
    allowCrossing: false,
  })

  if (focused || request.revert) return
  const edge = request.step < 0 ? 'next' : 'previous'
  if (isEdgeDisabled(edge)) return
  const revertRequest: PendingDayFocus = {
    date: addDays(request.date, -request.step),
    step: -request.step,
    month: date.value,
    weekControls: request.weekControls,
    revert: true,
  }
  moveToEdge(edge)
  nextTick(() => processPendingDayFocus(revertRequest))
}

function crossMonth(value: DateStringValue, step: number, weekControls: boolean) {
  const edge = step < 0 ? 'previous' : 'next'
  if (isEdgeDisabled(edge)) return
  if (props.minDate && dayjs(value).isBefore(props.minDate, 'day')) return
  if (props.maxDate && dayjs(value).isAfter(props.maxDate, 'day')) return
  const request: PendingDayFocus = { date: value, step, month: date.value, weekControls }
  moveToEdge(edge)
  nextTick(() => processPendingDayFocus(request))
}

function handleDayKeyDown(event: KeyboardEvent, payload: { date: DateStringValue }) {
  const direction = keyToDirection(event.key, dir.value)
  if (!direction) return
  event.preventDefault()
  const step = DAY_STEPS[direction]
  focusDayNode({
    value: addDays(payload.date, step),
    step,
    weekControls: false,
    allowCrossing: true,
  })
}

function handleWeekControlKeyDown(event: KeyboardEvent, payload: { date: DateStringValue }) {
  const direction = keyToDirection(event.key, dir.value)
  if (direction !== 'up' && direction !== 'down') return
  event.preventDefault()
  const step = DAY_STEPS[direction]
  focusDayNode({
    value: addDays(payload.date, step),
    step,
    weekControls: true,
    allowCrossing: true,
  })
}

defineExpose({ rootElement, focusTabControl: () => grids[0]?.focusTabControl?.() })
</script>

<template>
  <Box
    v-bind="attrs"
    :root-ref="setRootRef"
    :class="[classes.calendar, attrs.class]"
    data-calendar
    :data-full-width="props.fullWidth || undefined"
  >
    <div v-for="(currentDate, column) in columns" :key="currentDate" :class="classes.calendarLevel">
      <template v-if="level === 'month'">
        <CalendarHeader
          :label="monthLabel(currentDate)"
          :has-next-level="props.maxLevel !== 'month'"
          :with-previous="column === 0"
          :with-next="column === columns.length - 1"
          :full-width="props.fullWidth"
          :with-native-level-select="props.withNativeLevelSelect"
          :years-select-range="props.yearsSelectRange"
          calendar-level="month"
          :date="currentDate"
          :locale="props.locale"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :disable-native-level-select="props.date !== undefined && !hasDateListener()"
          @date-change="setDate"
          @previous="updateDate(-scroll, 'month')"
          @next="updateDate(scroll, 'month')"
          @level-click="changeLevel(nextLevel(level))"
        />
        <Month
          :ref="(node: any) => setGridRef(column, node)"
          :month="currentDate"
          :value="props.value"
          :type="props.type"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :first-day-of-week="props.firstDayOfWeek"
          :weekend-days="props.weekendDays"
          :locale="props.locale"
          :weekday-format="props.weekdayFormat"
          :render-day="renderDay"
          :get-day-props="props.getDayProps"
          :get-day-aria-label="props.getDayAriaLabel"
          :exclude-date="props.excludeDate"
          :hide-outside-dates="props.hideOutsideDates"
          :hide-weekdays="props.hideWeekdays"
          :with-cell-spacing="props.withCellSpacing"
          :highlight-today="props.highlightToday"
          :with-week-numbers="props.withWeekNumbers"
          :static="props.static"
          :full-width="props.fullWidth"
          :__with-week-controls="props.__withWeekControls"
          :__get-week-control-props="props.__getWeekControlProps"
          :__on-day-key-down="props.static ? undefined : handleDayKeyDown"
          :__on-week-control-key-down="handleWeekControlKeyDown"
          @day-click="(date) => emit('day-click', date)"
          @day-mouse-enter="(date) => emit('day-mouse-enter', date)"
        />
      </template>
      <template v-else-if="level === 'year'">
        <CalendarHeader
          :label="yearLabel(currentDate)"
          :has-next-level="props.maxLevel === 'decade'"
          :with-previous="column === 0"
          :with-next="column === columns.length - 1"
          :full-width="props.fullWidth"
          :with-native-level-select="props.withNativeLevelSelect"
          :years-select-range="props.yearsSelectRange"
          calendar-level="year"
          :date="currentDate"
          :locale="props.locale"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :disable-native-level-select="props.date !== undefined && !hasDateListener()"
          @date-change="setDate"
          @previous="updateDate(-scroll, 'year')"
          @next="updateDate(scroll, 'year')"
          @level-click="changeLevel(nextLevel(level))"
        />
        <MonthsList
          :ref="(node: any) => setGridRef(column, node)"
          :year="currentDate"
          :value="props.value"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :months-list-format="props.monthsListFormat"
          :get-month-control-props="props.getMonthControlProps"
          :full-width="props.fullWidth"
          @month-mouse-enter="(date) => emit('month-mouse-enter', date)"
          @month-select="selectMonth"
          @edge-cross="handleGridEdgeCross(column, $event)"
        />
      </template>
      <template v-else>
        <CalendarHeader
          :label="decadeLabel(currentDate)"
          :with-previous="column === 0"
          :with-next="column === columns.length - 1"
          :has-next-level="false"
          :full-width="props.fullWidth"
          @previous="updateDate(-10 * scroll, 'year')"
          @next="updateDate(10 * scroll, 'year')"
        />
        <YearsList
          :ref="(node: any) => setGridRef(column, node)"
          :decade="currentDate"
          :value="props.value"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :years-list-format="props.yearsListFormat"
          :get-year-control-props="props.getYearControlProps"
          :full-width="props.fullWidth"
          @year-mouse-enter="(date) => emit('year-mouse-enter', date)"
          @year-select="selectYear"
          @edge-cross="handleGridEdgeCross(column, $event)"
        />
      </template>
    </div>
  </Box>
</template>
