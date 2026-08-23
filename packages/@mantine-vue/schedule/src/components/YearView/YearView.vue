<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { resolveScheduleRadius } from '../shared'
import type { YearViewOwnProps } from './YearView.types'

const defaultProps = {
  mode: 'default',
  withHeader: true,
  recurrenceExpansionLimit: 2000,
  firstDayOfWeek: 1,
  weekdayFormat: 'dd',
  weekendDays: [0, 6],
  withWeekendDays: true,
  withWeekDays: true,
  highlightToday: true,
  withOutsideDays: true,
  monthsListFormat: 'MMMM',
} satisfies Partial<YearViewOwnProps>

const COLUMNS = 7

const MAX_DAY_INDICATORS = 3

const varsResolver = createVarsResolver<any>((_theme, { radius }) => ({
  yearView: {
    '--year-view-radius': resolveScheduleRadius(radius),
  },
}))

export { defaultProps, varsResolver, COLUMNS, MAX_DAY_INDICATORS }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, useAttrs } from 'vue'
import { Box, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import type { DateStringValue, DayOfWeek, ScheduleEventData } from '../../types'
import {
  formatDate,
  getMonthDays,
  getWeekNumber,
  getWeekdaysNames,
  toDateString,
} from '../../utils'
import { handleGridKeydown } from '../keyboard-navigation'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import { getExpandedEvents, useStaticStyles } from '../shared'
import { getYearViewEvents } from './get-year-view-events/get-year-view-events'
import type { YearViewEmits, YearViewSlots } from './YearView.types'
import classes from './YearView.module.css'

defineOptions({
  name: 'YearView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<YearViewOwnProps>(), {
  events: undefined,
  locale: undefined,
  radius: undefined,
  labels: undefined,
  mode: undefined,
  withHeader: undefined,
  previousControlProps: undefined,
  nextControlProps: undefined,
  todayControlProps: undefined,
  viewSelectProps: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  recurrenceExpansionLimit: undefined,
  firstDayOfWeek: undefined,
  weekdayFormat: undefined,
  weekendDays: undefined,
  withWeekendDays: undefined,
  withWeekDays: undefined,
  consistentWeeks: undefined,
  highlightToday: undefined,
  withOutsideDays: undefined,
  monthsListFormat: undefined,
  getDayProps: undefined,
  renderDay: undefined,
  getWeekNumberProps: undefined,
  monthYearSelectProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<YearViewEmits>()
defineSlots<YearViewSlots>()

const attrs = useAttrs()

const props = useProps('YearView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'YearView',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  rootSelector: 'yearView',
})

/**
 * Cached per selector: a year renders twelve month grids, so the same class list would
 * otherwise be rebuilt for several hundred day cells on every render.
 */
const staticStyles = useStaticStyles(getStyles)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const yearGrid = ref<HTMLElement | null>(null)

const isStatic = computed(() => props.mode === 'static')

const year = computed(() => dayjs(props.date).startOf('year'))

const expandedEvents = computed(() =>
  getExpandedEvents(
    props.events,
    year.value.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    year.value.endOf('year').format('YYYY-MM-DD HH:mm:ss'),
    props.recurrenceExpansionLimit!,
  ),
)

const eventsByDay = computed(() =>
  getYearViewEvents({ date: year.value, events: expandedEvents.value }),
)

const weekdays = computed(() =>
  getWeekdaysNames({
    locale: props.locale || 'en',
    format: props.weekdayFormat!,
    firstDayOfWeek: props.firstDayOfWeek,
  }).filter((_, index) => !hiddenWeekendColumns.value.has(index)),
)

const hiddenWeekendColumns = computed(() => {
  if (props.withWeekendDays !== false) return new Set<number>()
  return new Set(
    Array.from({ length: 7 }, (_, index) => index).filter((index) =>
      props.weekendDays!.includes(((props.firstDayOfWeek! + index) % 7) as DayOfWeek),
    ),
  )
})

const columnsCount = computed(() => 7 - hiddenWeekendColumns.value.size)
const visibleWeek = (week: DateStringValue[]) =>
  props.withWeekendDays === false
    ? week.filter((date) => !props.weekendDays!.includes(dayjs(date).day() as DayOfWeek))
    : week

/**
 * Every month with the grid offset its cells start at, so a single roving tabindex can walk
 * the whole year rather than restarting in each month.
 */
const months = computed(() => {
  let offset = 0

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = year.value.month(monthIndex)
    const weeks = getMonthDays({
      month,
      firstDayOfWeek: props.firstDayOfWeek,
      consistentWeeks: props.consistentWeeks,
    })
    const entry = { month, monthIndex, weeks, offset }
    offset += weeks.length * columnsCount.value
    return entry
  })
})

const totalYearGridCells = computed(() =>
  months.value.reduce((total, { weeks }) => total + weeks.length * columnsCount.value, 0),
)

const headerControl = computed(() => ({
  monthYearSelect: {
    locale: props.locale,
    yearValue: year.value.year(),
    withMonths: false,
    labelFormat: 'YYYY',
    onYearChange: (value: number) => emit('dateChange', toDateString(year.value.year(value))),
    ...props.monthYearSelectProps,
  },
}))

const changeDate = (value: DateStringValue) => emit('dateChange', value)

const dayProps = (date: string | Date) => props.getDayProps?.(toDateString(date)) ?? {}
const weekNumberProps = (weekStart: string | Date) =>
  props.getWeekNumberProps?.(toDateString(weekStart)) ?? {}

const isOutside = (date: string | Date, month: dayjs.Dayjs) => !dayjs(date).isSame(month, 'month')

const dayEvents = (date: string | Date) => eventsByDay.value[dayjs(date).format('YYYY-MM-DD')] || []

const indicatorStyle = (event: ScheduleEventData) => ({
  background: `var(--mantine-color-${event.color}-6, ${event.color})`,
})

const handleDayKeydown = (nativeEvent: KeyboardEvent, gridIndex: number) => {
  handleGridKeydown({
    event: nativeEvent,
    index: gridIndex,
    columns: columnsCount.value,
    total: totalYearGridCells.value,
    getControl: (index) => {
      const control =
        yearGrid.value?.querySelector<HTMLButtonElement>(`[data-year-grid-index="${index}"]`) ??
        null
      // Days of the neighbouring months are visible but never focusable.
      return control?.hasAttribute('data-outside') ? null : control
    },
  })
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('yearView') }"
    :style="[getStyles('yearView').style, { '--year-view-columns': columnsCount }, attrs.style]"
    :data-without-weekend-days="hiddenWeekendColumns.size > 0 || undefined"
  >
    <ScheduleHeaderBase
      v-if="props.withHeader"
      view="year"
      :labels="props.labels"
      :navigation-handlers="createHeaderNavigation(props.date, 'year')"
      :control="headerControl"
      :previous-control-props="props.previousControlProps"
      :next-control-props="props.nextControlProps"
      :today-control-props="props.todayControlProps"
      :view-select-props="props.viewSelectProps"
      v-bind="stylesApi"
      @date-change="changeDate"
      @view-change="emit('viewChange', $event)"
    />

    <div ref="yearGrid" v-bind="getStyles('yearViewMonths')">
      <section
        v-for="{ month, weeks, offset } in months"
        :key="month.month()"
        v-bind="getStyles('yearViewMonth')"
        :data-with-week-numbers="props.withWeekNumbers || undefined"
      >
        <UnstyledButton
          type="button"
          v-bind="getStyles('yearViewMonthCaption')"
          @click="emit('monthClick', toDateString(month))"
        >
          {{
            formatDate({
              date: month,
              locale: props.locale || 'en',
              format: props.monthsListFormat!,
            })
          }}
        </UnstyledButton>

        <div v-if="props.withWeekDays" v-bind="getStyles('yearViewWeekdays')">
          <span v-if="props.withWeekNumbers" v-bind="getStyles('yearViewWeekdaysCorner')" />
          <span
            v-for="(weekday, index) in weekdays"
            :key="index"
            v-bind="staticStyles('yearViewWeekday')"
          >
            {{ weekday }}
          </span>
        </div>

        <div
          v-for="(week, weekIndex) in weeks"
          :key="`week-${weekIndex}`"
          v-bind="staticStyles('yearViewWeek')"
        >
          <UnstyledButton
            v-if="props.withWeekNumbers"
            type="button"
            v-bind="{
              ...weekNumberProps(week[0]),
              ...getStyles('yearViewWeekNumber', { className: weekNumberProps(week[0]).class }),
            }"
            @click="emit('weekNumberClick', toDateString(week[0]), $event)"
          >
            {{ getWeekNumber(week) }}
          </UnstyledButton>

          <template v-for="(date, dayIndex) in visibleWeek(week)" :key="toDateString(date)">
            <div
              v-if="isOutside(date, month) && !props.withOutsideDays"
              v-bind="staticStyles('yearViewDay')"
              data-day-placeholder
            />
            <UnstyledButton
              v-else
              type="button"
              v-bind="{
                ...dayProps(date),
                ...getStyles('yearViewDay', { className: dayProps(date).class }),
              }"
              :disabled="isStatic"
              :data-year-grid-index="offset + weekIndex * columnsCount + dayIndex"
              :data-outside="isOutside(date, month) || undefined"
              :data-weekend="
                props.weekendDays!.includes(dayjs(date).day() as DayOfWeek) || undefined
              "
              :data-today="
                (props.highlightToday && dayjs(date).isSame(dayjs(), 'day')) || undefined
              "
              :aria-label="
                formatDate({ date, locale: props.locale || 'en', format: 'MMMM D, YYYY' })
              "
              :tabindex="
                isStatic || isOutside(date, month) ? -1 : dayjs(date).date() === 1 ? 0 : -1
              "
              @keydown="
                isStatic
                  ? undefined
                  : handleDayKeydown($event, offset + weekIndex * columnsCount + dayIndex)
              "
              @click="emit('dayClick', toDateString(date), $event)"
            >
              <slot name="day" :date="toDateString(date)" :events="dayEvents(date)">
                <component
                  :is="() => props.renderDay!(toDateString(date), dayEvents(date))"
                  v-if="props.renderDay"
                />
                <template v-else>
                  {{ dayjs(date).date() }}
                  <span v-if="dayEvents(date).length" v-bind="getStyles('yearViewDayIndicators')">
                    <span
                      v-for="event in dayEvents(date).slice(0, MAX_DAY_INDICATORS)"
                      :key="event.id"
                      v-bind="getStyles('yearViewDayIndicator')"
                      :style="indicatorStyle(event)"
                    />
                  </span>
                </template>
              </slot>
            </UnstyledButton>
          </template>
        </div>
      </section>
    </div>
  </Box>
</template>
