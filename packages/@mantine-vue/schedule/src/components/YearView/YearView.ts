import dayjs from 'dayjs'
import { defineComponent, h, ref, type PropType } from 'vue'
import { Box, UnstyledButton } from '@mantine-vue/core'
import type { YearViewProps } from '../../component-props'
import type { DateLabelFormat, DayOfWeek, ScheduleEventData } from '../../types'
import {
  formatDate,
  getMonthDays,
  getWeekNumber,
  getWeekdaysNames,
  toDateString,
} from '../../utils'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import { handleGridKeydown } from '../keyboard-navigation'
import { baseViewProps, getExpandedEvents, resolveScheduleRadius } from '../shared'
import { getYearViewEvents } from './get-year-view-events/get-year-view-events'
import classes from './YearView.module.css'

export const YearView = defineComponent({
  name: 'YearView',
  inheritAttrs: false,
  props: {
    ...baseViewProps,
    firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: 1 },
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'dd' },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    withWeekNumbers: Boolean,
    withWeekDays: { type: Boolean, default: true },
    consistentWeeks: Boolean,
    highlightToday: { type: Boolean, default: true },
    withOutsideDays: { type: Boolean, default: true },
    monthsListFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'MMMM' },
    getDayProps: Function as PropType<YearViewProps['getDayProps']>,
    getWeekNumberProps: Function as PropType<YearViewProps['getWeekNumberProps']>,
    onDayClick: Function as PropType<YearViewProps['onDayClick']>,
    onMonthClick: Function as PropType<YearViewProps['onMonthClick']>,
    onWeekNumberClick: Function as PropType<YearViewProps['onWeekNumberClick']>,
  },
  setup(props, { attrs }) {
    const yearGrid = ref<HTMLElement | null>(null)
    return () => {
      const year = dayjs(props.date).startOf('year')
      const expanded = getExpandedEvents(
        props.events,
        year.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        year.endOf('year').format('YYYY-MM-DD HH:mm:ss'),
        props.recurrenceExpansionLimit,
      )
      const eventsByDay = getYearViewEvents({ date: year, events: expanded })
      const weekdays = getWeekdaysNames({
        locale: props.locale || 'en',
        format: props.weekdayFormat,
        firstDayOfWeek: props.firstDayOfWeek,
      })
      let totalYearGridCells = 0
      const months = Array.from({ length: 12 }, (_, monthIndex) => {
        const month = year.month(monthIndex)
        const weeks = getMonthDays({
          month,
          firstDayOfWeek: props.firstDayOfWeek,
          consistentWeeks: props.consistentWeeks,
        })
        const offset = totalYearGridCells
        totalYearGridCells += weeks.length * 7
        return { month, monthIndex, weeks, offset }
      })
      return h(
        Box,
        {
          ...attrs,
          class: [classes.yearView, attrs.class],
          style: [{ '--year-view-radius': resolveScheduleRadius(props.radius) }, attrs.style],
        },
        () => [
          props.withHeader
            ? h(ScheduleHeaderBase, {
                view: 'year',
                labels: props.labels,
                onDateChange: props.onDateChange,
                onViewChange: props.onViewChange,
                navigationHandlers: createHeaderNavigation(props.date!, 'year'),
                previousControlProps: props.previousControlProps,
                nextControlProps: props.nextControlProps,
                todayControlProps: props.todayControlProps,
                viewSelectProps: props.viewSelectProps,
                control: {
                  monthYearSelect: {
                    locale: props.locale,
                    yearValue: year.year(),
                    withMonths: false,
                    labelFormat: 'YYYY',
                    onYearChange: (value: number) =>
                      props.onDateChange?.(toDateString(year.year(value))),
                  },
                },
              })
            : null,
          h(
            'div',
            { ref: yearGrid, class: classes.yearViewMonths },
            months.map(({ month, weeks, offset }) => {
              return h(
                'section',
                {
                  class: classes.yearViewMonth,
                  'data-with-week-numbers': props.withWeekNumbers || undefined,
                },
                [
                  h(
                    UnstyledButton,
                    {
                      type: 'button',
                      class: classes.yearViewMonthCaption,
                      onClick: () => props.onMonthClick?.(toDateString(month)),
                    },
                    () =>
                      formatDate({
                        date: month,
                        locale: props.locale || 'en',
                        format: props.monthsListFormat,
                      }),
                  ),
                  props.withWeekDays
                    ? h('div', { class: classes.yearViewWeekdays }, [
                        props.withWeekNumbers
                          ? h('span', { class: classes.yearViewWeekdaysCorner })
                          : null,
                        ...weekdays.map((weekday) =>
                          h('span', { class: classes.yearViewWeekday }, [weekday]),
                        ),
                      ])
                    : null,
                  ...weeks.map((week, weekIndex) =>
                    h('div', { class: classes.yearViewWeek }, [
                      props.withWeekNumbers
                        ? h(
                            UnstyledButton,
                            {
                              type: 'button',
                              class: classes.yearViewWeekNumber,
                              ...props.getWeekNumberProps?.(toDateString(week[0])),
                              onClick: (event: MouseEvent) =>
                                props.onWeekNumberClick?.(toDateString(week[0]), event),
                            },
                            () => String(getWeekNumber(week)),
                          )
                        : null,
                      ...week.map((date, dayIndex) => {
                        const key = dayjs(date).format('YYYY-MM-DD')
                        const events = eventsByDay[key] || []
                        const outside = !dayjs(date).isSame(month, 'month')
                        const gridIndex = offset + weekIndex * 7 + dayIndex
                        const extra = props.getDayProps?.(toDateString(date)) || {}
                        if (outside && !props.withOutsideDays) {
                          return h('div', {
                            class: classes.yearViewDay,
                            'data-day-placeholder': true,
                            key: toDateString(date),
                          })
                        }
                        return h(
                          UnstyledButton,
                          {
                            type: 'button',
                            ...extra,
                            class: [classes.yearViewDay, extra.class],
                            disabled: props.mode === 'static',
                            'data-year-grid-index': gridIndex,
                            'data-outside': outside || undefined,
                            'data-weekend':
                              props.weekendDays.includes(dayjs(date).day() as DayOfWeek) ||
                              undefined,
                            'data-today':
                              (props.highlightToday && dayjs(date).isSame(dayjs(), 'day')) ||
                              undefined,
                            'aria-label': formatDate({
                              date,
                              locale: props.locale || 'en',
                              format: 'MMMM D, YYYY',
                            }),
                            tabindex:
                              props.mode === 'static' || outside
                                ? -1
                                : dayjs(date).date() === 1
                                  ? 0
                                  : -1,
                            onKeydown:
                              props.mode === 'static'
                                ? undefined
                                : (event: KeyboardEvent) => {
                                    handleGridKeydown({
                                      event,
                                      index: gridIndex,
                                      columns: 7,
                                      total: totalYearGridCells,
                                      getControl: (index) => {
                                        const control =
                                          yearGrid.value?.querySelector<HTMLButtonElement>(
                                            `[data-year-grid-index="${index}"]`,
                                          ) ?? null
                                        return control?.hasAttribute('data-outside')
                                          ? null
                                          : control
                                      },
                                    })
                                    extra.onKeydown?.(event)
                                  },
                            onClick: (event: MouseEvent) =>
                              props.onDayClick?.(toDateString(date), event),
                          },
                          () => [
                            String(dayjs(date).date()),
                            events.length
                              ? h(
                                  'span',
                                  { class: classes.yearViewDayIndicators },
                                  events.slice(0, 3).map((event: ScheduleEventData) =>
                                    h('span', {
                                      class: classes.yearViewDayIndicator,
                                      style: {
                                        background: `var(--mantine-color-${event.color}-6, ${event.color})`,
                                      },
                                    }),
                                  ),
                                )
                              : null,
                          ],
                        )
                      }),
                    ]),
                  ),
                ],
              )
            }),
          ),
        ],
      )
    }
  },
})

export type { YearViewProps }
export type YearViewStylesNames =
  | 'yearView'
  | 'yearViewMonths'
  | 'yearViewMonth'
  | 'yearViewWeekdays'
  | 'yearViewWeek'
  | 'yearViewWeekNumber'
  | 'yearViewWeekday'
  | 'yearViewWeekdaysCorner'
  | 'yearViewDay'
  | 'yearViewMonthCaption'
  | 'yearViewDayIndicators'
  | 'yearViewDayIndicator'
