import dayjs from 'dayjs'
import { defineComponent, h, ref, watch, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  AccordionChevron,
  Box,
  getThemeColor,
  Text,
  UnstyledButton,
  useDirection,
  useSafeMantineTheme,
} from '@mantine-vue/core'
import type { MobileMonthViewProps } from '../../component-props'
import type {
  DateLabelFormat,
  DateStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
} from '../../types'
import { formatDate, getMonthDays, getWeekNumber, getWeekdaysNames } from '../../utils'
import { baseViewProps, getExpandedEvents, resolveScheduleRadius } from '../shared'
import { getMobileMonthViewEvents } from './get-mobile-month-view-events'
import classes from './MobileMonthView.module.css'

export interface MobileMonthViewSlots {
  /** Scoped alternative to the `renderEvent` prop */
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
  /** Scoped alternative to the `renderHeader` prop */
  header?: (props: {
    mode: ScheduleMode
    date: Date | DateStringValue
    defaultHeader: VNodeChild
  }) => VNodeChild
}

export const MobileMonthView = defineComponent({
  name: 'MobileMonthView',
  inheritAttrs: false,
  slots: Object as SlotsType<MobileMonthViewSlots>,
  props: {
    ...baseViewProps,
    selectedDate: [String, Date, null] as PropType<Date | DateStringValue | null>,
    defaultSelectedDate: [String, Date, null] as PropType<Date | DateStringValue | null>,
    onSelectedDateChange: Function as PropType<MobileMonthViewProps['onSelectedDateChange']>,
    withWeekNumbers: Boolean,
    withWeekDays: { type: Boolean, default: true },
    firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: 1 },
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'dd' },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    getWeekNumberProps: Function as PropType<MobileMonthViewProps['getWeekNumberProps']>,
    getDayProps: Function as PropType<MobileMonthViewProps['getDayProps']>,
    onDayClick: Function as PropType<MobileMonthViewProps['onDayClick']>,
    onWeekNumberClick: Function as PropType<MobileMonthViewProps['onWeekNumberClick']>,
    consistentWeeks: { type: Boolean, default: true },
    highlightToday: { type: Boolean, default: true },
    withOutsideDays: Boolean,
    eventsHeaderFormat: {
      type: [String, Function] as PropType<DateLabelFormat>,
      default: 'dddd, MMMM D',
    },
    onYearClick: Function as PropType<() => void>,
    renderHeader: Function as PropType<MobileMonthViewProps['renderHeader']>,
  },
  setup(props, { attrs, slots }) {
    const { dir } = useDirection()
    const theme = useSafeMantineTheme()
    const internalSelected = ref<DateStringValue | null>(
      props.selectedDate !== undefined
        ? props.selectedDate
          ? (dayjs(props.selectedDate).format('YYYY-MM-DD') as DateStringValue)
          : null
        : (dayjs(props.defaultSelectedDate ?? dayjs()).format('YYYY-MM-DD') as DateStringValue),
    )
    watch(
      () => props.selectedDate,
      (value) => {
        if (value !== undefined) {
          internalSelected.value = value
            ? (dayjs(value).format('YYYY-MM-DD') as DateStringValue)
            : null
        }
      },
      { immediate: true },
    )
    const select = (date: DateStringValue) => {
      internalSelected.value = date
      props.onSelectedDateChange?.(date)
    }
    return () => {
      const month = dayjs(props.date).startOf('month')
      const weeks = getMonthDays({
        month,
        firstDayOfWeek: props.firstDayOfWeek,
        consistentWeeks: props.consistentWeeks,
      })
      const expanded = getExpandedEvents(
        props.events,
        weeks[0][0],
        dayjs(weeks.at(-1)!.at(-1)!).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        props.recurrenceExpansionLimit,
      )
      const eventsByDay = getMobileMonthViewEvents({ date: month, events: expanded })
      const weekdays = getWeekdaysNames({
        locale: props.locale || 'en',
        format: props.weekdayFormat,
        firstDayOfWeek: props.firstDayOfWeek,
      })
      const selectedEvents = internalSelected.value ? eventsByDay[internalSelected.value] || [] : []
      const headerDefault: VNodeChild = [
        h(
          UnstyledButton,
          {
            class: classes.mobileMonthViewHeaderBackButton,
            mod: { static: props.mode === 'static' },
            tabindex: props.mode === 'static' ? -1 : 0,
            onClick: props.mode === 'static' ? undefined : props.onYearClick,
          },
          () => [
            h(AccordionChevron, {
              size: 20,
              style: { transform: `rotate(${dir.value === 'rtl' ? -90 : 90}deg)` },
            }),
            month.format('YYYY'),
          ],
        ),
        h(Text, { class: classes.mobileMonthViewHeaderLabel }, () =>
          formatDate({ date: month, locale: props.locale || 'en', format: 'MMMM YYYY' }),
        ),
      ]
      return h(
        Box,
        {
          ...attrs,
          class: [classes.mobileMonthView, attrs.class],
          style: [
            { '--mobile-month-view-radius': resolveScheduleRadius(props.radius) },
            attrs.style,
          ],
          mod: { 'with-week-numbers': props.withWeekNumbers },
        },
        () => [
          h('div', { class: classes.mobileMonthViewHeader }, [
            props.renderHeader?.({
              mode: props.mode,
              date: props.date!,
              defaultHeader: headerDefault,
            }) ||
              slots.header?.({
                mode: props.mode,
                date: props.date!,
                defaultHeader: headerDefault,
              }) ||
              headerDefault,
          ]),
          h(
            Box,
            {
              class: classes.mobileMonthViewCalendar,
              mod: { 'with-weekdays': props.withWeekDays },
            },
            () => [
              props.withWeekDays
                ? h('div', { class: classes.mobileMonthViewWeekdays }, [
                    props.withWeekNumbers
                      ? h('span', { class: classes.mobileMonthViewWeekdaysCorner })
                      : null,
                    ...weekdays.map((weekday) =>
                      h('span', { class: classes.mobileMonthViewWeekday }, [weekday]),
                    ),
                  ])
                : null,
              ...weeks.map((week) =>
                h('div', { class: classes.mobileMonthViewWeek }, [
                  props.withWeekNumbers
                    ? h(
                        UnstyledButton,
                        {
                          class: classes.mobileMonthViewWeekNumber,
                          mod: { static: props.mode === 'static' },
                          tabindex: props.mode === 'static' ? -1 : 0,
                          ...props.getWeekNumberProps?.(
                            dayjs(week[0]).format('YYYY-MM-DD') as DateStringValue,
                          ),
                          onClick: (event: MouseEvent) =>
                            props.onWeekNumberClick?.(
                              dayjs(week[0]).format('YYYY-MM-DD') as DateStringValue,
                              event,
                            ),
                        },
                        () => String(getWeekNumber(week)),
                      )
                    : null,
                  ...week.map((date) => {
                    const value = dayjs(date).format('YYYY-MM-DD') as DateStringValue
                    const outside = !dayjs(date).isSame(month, 'month')
                    const events = eventsByDay[value] || []
                    const extra = props.getDayProps?.(value) || {}
                    const shouldRender = !outside || props.withOutsideDays
                    return h(
                      UnstyledButton,
                      {
                        ...extra,
                        class: [classes.mobileMonthViewDay, extra.class],
                        mod: {
                          outside,
                          weekend: props.weekendDays.includes(dayjs(date).day() as DayOfWeek),
                          today: props.highlightToday && dayjs(date).isSame(dayjs(), 'day'),
                          selected: internalSelected.value === value,
                          static: props.mode === 'static',
                          hidden: !shouldRender,
                        },
                        tabindex: props.mode === 'static' || !shouldRender ? -1 : 0,
                        'aria-label': formatDate({
                          date,
                          locale: props.locale || 'en',
                          format: 'MMMM D, YYYY',
                        }),
                        'aria-selected': internalSelected.value === value || undefined,
                        onClick:
                          props.mode === 'static' || !shouldRender
                            ? undefined
                            : (event: MouseEvent) => {
                                select(value)
                                props.onDayClick?.(value, event)
                              },
                      },
                      () => [
                        shouldRender ? String(dayjs(date).date()) : null,
                        shouldRender && events.length
                          ? h(
                              'span',
                              { class: classes.mobileMonthViewDayIndicators },
                              events.slice(0, 3).map((event: ScheduleEventData) =>
                                h('span', {
                                  class: classes.mobileMonthViewDayIndicator,
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
          ),
          h(Box, { class: classes.mobileMonthViewEventsList }, () => [
            h(Text, { class: classes.mobileMonthViewEventsHeader }, () =>
              internalSelected.value
                ? formatDate({
                    date: internalSelected.value,
                    locale: props.locale || 'en',
                    format: props.eventsHeaderFormat,
                  })
                : '',
            ),
            selectedEvents.length
              ? selectedEvents.map((event: ScheduleEventData) => {
                  const startTime = dayjs(event.start).format('HH:mm')
                  const endTime = dayjs(event.end).format('HH:mm')
                  const isAllDay = startTime === '00:00' && endTime === '00:00'
                  const eventChildren = h(Box, { class: classes.mobileMonthViewEventBody }, () => [
                    h('div', {
                      class: classes.mobileMonthViewEventColor,
                      style: { backgroundColor: getThemeColor(event.color, theme.value) },
                    }),
                    h('div', [
                      h(Text, { class: classes.mobileMonthViewEventTitle }, () => event.title),
                      h(Text, { class: classes.mobileMonthViewEventTime }, () =>
                        isAllDay ? 'All day' : `${startTime} – ${endTime}`,
                      ),
                    ]),
                  ])
                  const rootProps = {
                    type: 'button' as const,
                    class: classes.mobileMonthViewEvent,
                    tabindex: props.mode === 'static' ? -1 : 0,
                    onClick:
                      props.mode === 'static'
                        ? undefined
                        : (nativeEvent: MouseEvent) => props.onEventClick?.(event, nativeEvent),
                  }

                  return (
                    props.renderEvent?.(event, { ...rootProps, children: eventChildren }) ||
                    slots.event?.({ ...rootProps, children: eventChildren, event }) ||
                    h(UnstyledButton, { ...rootProps, key: event.id }, () => eventChildren)
                  )
                })
              : h(
                  Text,
                  { class: classes.mobileMonthViewNoEvents },
                  () => props.labels?.noEvents || 'No events',
                ),
          ]),
        ],
      )
    }
  },
})

export type { MobileMonthViewProps }
export type MobileMonthViewStylesNames =
  | 'mobileMonthView'
  | 'mobileMonthViewHeader'
  | 'mobileMonthViewHeaderBackButton'
  | 'mobileMonthViewHeaderLabel'
  | 'mobileMonthViewCalendar'
  | 'mobileMonthViewWeekdays'
  | 'mobileMonthViewWeekdaysCorner'
  | 'mobileMonthViewWeekday'
  | 'mobileMonthViewWeek'
  | 'mobileMonthViewWeekNumber'
  | 'mobileMonthViewDay'
  | 'mobileMonthViewDayIndicators'
  | 'mobileMonthViewDayIndicator'
  | 'mobileMonthViewEventsList'
  | 'mobileMonthViewEventsHeader'
  | 'mobileMonthViewEvent'
  | 'mobileMonthViewEventBody'
  | 'mobileMonthViewEventColor'
  | 'mobileMonthViewEventTitle'
  | 'mobileMonthViewEventTime'
  | 'mobileMonthViewNoEvents'
