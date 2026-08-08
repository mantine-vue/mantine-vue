<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, getCurrentInstance, useAttrs } from 'vue'
import { Box } from '@mantine-vue/core'
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
  toDateString,
} from '../../utils'
import type { CalendarLevel, CalendarProps, DateStringValue, RenderDaySlots } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'Calendar', inheritAttrs: false })
const props = withDefaults(defineProps<CalendarProps>(), {
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
})
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
function selectMonth(value: DateStringValue) {
  setDate(value)
  emit('month-select', value)
  setLevel(clampLevel('month'))
}
function selectYear(value: DateStringValue) {
  setDate(value)
  emit('year-select', value)
  setLevel(clampLevel('year'))
}
</script>

<template>
  <Box
    v-bind="attrs"
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
          @level-click="setLevel(nextLevel(level))"
        />
        <Month
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
          @level-click="setLevel(nextLevel(level))"
        />
        <MonthsList
          :year="currentDate"
          :value="props.value"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :months-list-format="props.monthsListFormat"
          :get-month-control-props="props.getMonthControlProps"
          :full-width="props.fullWidth"
          @month-mouse-enter="(date) => emit('month-mouse-enter', date)"
          @month-select="selectMonth"
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
          :decade="currentDate"
          :value="props.value"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :years-list-format="props.yearsListFormat"
          :get-year-control-props="props.getYearControlProps"
          :full-width="props.fullWidth"
          @year-mouse-enter="(date) => emit('year-mouse-enter', date)"
          @year-select="selectYear"
        />
      </template>
    </div>
  </Box>
</template>
