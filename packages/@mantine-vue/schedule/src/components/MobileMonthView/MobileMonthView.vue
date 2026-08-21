<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { resolveScheduleRadius } from '../shared'
import type { MobileMonthViewOwnProps } from './MobileMonthView.types'

const defaultProps = {
  mode: 'default',
  recurrenceExpansionLimit: 2000,
  withHeader: true,
  withWeekDays: true,
  firstDayOfWeek: 1,
  weekdayFormat: 'dd',
  weekendDays: [0, 6],
  consistentWeeks: true,
  highlightToday: true,
  eventsHeaderFormat: 'dddd, MMMM D',
} satisfies Partial<MobileMonthViewOwnProps>

const MAX_DAY_INDICATORS = 3

const varsResolver = createVarsResolver<any>((_theme, { radius }) => ({
  mobileMonthView: {
    '--mobile-month-view-radius': resolveScheduleRadius(radius),
  },
}))

export { defaultProps, varsResolver, MAX_DAY_INDICATORS }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import {
  AccordionChevron,
  Box,
  getThemeColor,
  Text,
  UnstyledButton,
  useDirection,
  useProps,
  useSafeMantineTheme,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { getLabel } from '../../labels'
import type { DateStringValue, DayOfWeek, ScheduleEventData } from '../../types'
import { formatDate, getMonthDays, getWeekNumber, getWeekdaysNames } from '../../utils'
import { getExpandedEvents } from '../shared'
import { getMobileMonthViewEvents } from './get-mobile-month-view-events'
import type { MobileMonthViewEmits, MobileMonthViewSlots } from './MobileMonthView.types'
import classes from './MobileMonthView.module.css'

defineOptions({
  name: 'MobileMonthView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MobileMonthViewOwnProps>(), {
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
  selectedDate: undefined,
  defaultSelectedDate: undefined,
  withWeekDays: undefined,
  firstDayOfWeek: undefined,
  weekdayFormat: undefined,
  weekendDays: undefined,
  getWeekNumberProps: undefined,
  getDayProps: undefined,
  consistentWeeks: undefined,
  highlightToday: undefined,
  eventsHeaderFormat: undefined,
  renderHeader: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<MobileMonthViewSlots>()

const emit = defineEmits<MobileMonthViewEmits>()

const slots = useSlots()
const attrs = useAttrs()
const { dir } = useDirection()
const theme = useSafeMantineTheme()

const props = useProps('MobileMonthView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'MobileMonthView',
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
  rootSelector: 'mobileMonthView',
})

const isStatic = computed(() => props.mode === 'static')

const toDayKey = (value: Date | DateStringValue | null | undefined) =>
  value ? (dayjs(value).format('YYYY-MM-DD') as DateStringValue) : null

const [selected, setSelected] = useUncontrolled<DateStringValue | null>({
  // `null` is a meaningful selection (nothing selected), so only `undefined` means uncontrolled.
  value: () => (props.selectedDate === undefined ? undefined : toDayKey(props.selectedDate)),
  defaultValue: dayjs(props.defaultSelectedDate ?? undefined).format(
    'YYYY-MM-DD',
  ) as DateStringValue,
  finalValue: null,
  onChange: (value) => {
    emit('update:selectedDate', value)
    emit('selectedDateChange', value)
  },
})

const month = computed(() => dayjs(props.date).startOf('month'))

const weeks = computed(() =>
  getMonthDays({
    month: month.value,
    firstDayOfWeek: props.firstDayOfWeek,
    consistentWeeks: props.consistentWeeks,
  }),
)

const expandedEvents = computed(() =>
  getExpandedEvents(
    props.events,
    weeks.value[0][0],
    dayjs(weeks.value.at(-1)!.at(-1)!).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    props.recurrenceExpansionLimit!,
  ),
)

const eventsByDay = computed(() =>
  getMobileMonthViewEvents({ date: month.value, events: expandedEvents.value }),
)

const weekdays = computed(() =>
  getWeekdaysNames({
    locale: props.locale || 'en',
    format: props.weekdayFormat!,
    firstDayOfWeek: props.firstDayOfWeek,
  }),
)

const selectedEvents = computed(() =>
  selected.value ? eventsByDay.value[selected.value] || [] : [],
)

const dayProps = (date: string | Date) => props.getDayProps?.(toDayKey(date)!) ?? {}
const weekNumberProps = (weekStart: string | Date) =>
  props.getWeekNumberProps?.(toDayKey(weekStart)!) ?? {}

const isOutside = (date: string | Date) => !dayjs(date).isSame(month.value, 'month')

/** Outside days keep their cell so the grid stays aligned, but render nothing. */
const isRendered = (date: string | Date) => !isOutside(date) || Boolean(props.withOutsideDays)

const dayIndicators = (date: string | Date) =>
  (eventsByDay.value[toDayKey(date)!] || []).slice(0, MAX_DAY_INDICATORS)

const indicatorStyle = (event: ScheduleEventData) => ({
  background: `var(--mantine-color-${event.color}-6, ${event.color})`,
})

const selectDay = (date: string | Date, nativeEvent: MouseEvent) => {
  const value = toDayKey(date)!
  setSelected(value)
  emit('dayClick', value, nativeEvent)
}

const isAllDayEvent = (event: ScheduleEventData) =>
  dayjs(event.start).format('HH:mm') === '00:00' && dayjs(event.end).format('HH:mm') === '00:00'

const eventTimeLabel = (event: ScheduleEventData) =>
  isAllDayEvent(event)
    ? getLabel('allDay', props.labels)
    : `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`

/**
 * Default header as a functional component, so the template and the `renderHeader` payload
 * share one definition instead of building the tree twice.
 */
const DefaultHeader = () => [
  h(
    UnstyledButton,
    {
      ...getStyles('mobileMonthViewHeaderBackButton'),
      mod: { static: isStatic.value },
      tabindex: isStatic.value ? -1 : 0,
      onClick: isStatic.value ? undefined : () => emit('yearClick'),
    },
    () => [
      h(AccordionChevron, {
        size: 20,
        style: { transform: `rotate(${dir.value === 'rtl' ? -90 : 90}deg)` },
      }),
      month.value.format('YYYY'),
    ],
  ),
  h(Text, getStyles('mobileMonthViewHeaderLabel'), () =>
    formatDate({ date: month.value, locale: props.locale || 'en', format: 'MMMM YYYY' }),
  ),
]

const headerPayload = computed(() => ({
  mode: props.mode!,
  date: props.date,
  defaultHeader: h(DefaultHeader) as VNodeChild,
}))

const customHeader = computed<VNodeChild>(() => {
  if (!slots.header && !props.renderHeader) {
    return null
  }

  return slots.header?.(headerPayload.value) ?? props.renderHeader?.(headerPayload.value) ?? null
})

const renderHeaderContent = () => customHeader.value ?? h(DefaultHeader)

const listEventProps = (event: ScheduleEventData) => ({
  type: 'button' as const,
  ...getStyles('mobileMonthViewEvent'),
  tabindex: isStatic.value ? -1 : 0,
  onClick: isStatic.value
    ? undefined
    : (nativeEvent: MouseEvent) => emit('eventClick', event, nativeEvent),
})

const EventBody = (event: ScheduleEventData) => () =>
  h(Box, getStyles('mobileMonthViewEventBody'), () => [
    h(
      'div',
      getStyles('mobileMonthViewEventColor', {
        style: { backgroundColor: getThemeColor(event.color, theme.value) },
      }),
    ),
    h('div', [
      h(Text, getStyles('mobileMonthViewEventTitle'), () => event.title),
      h(Text, getStyles('mobileMonthViewEventTime'), () => eventTimeLabel(event)),
    ]),
  ])

const renderListEvent = (event: ScheduleEventData) => () => {
  const children = h(EventBody(event))
  const rootProps = listEventProps(event)
  const payload = { ...rootProps, children }

  return (
    slots.event?.({ ...payload, event }) ??
    props.renderEvent?.(event, payload) ??
    h(UnstyledButton, rootProps, () => children)
  )
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('mobileMonthView') }"
    :mod="[{ 'with-week-numbers': props.withWeekNumbers }, (attrs as any).mod]"
  >
    <div v-if="props.withHeader" v-bind="getStyles('mobileMonthViewHeader')">
      <component :is="renderHeaderContent" />
    </div>

    <Box
      v-bind="getStyles('mobileMonthViewCalendar')"
      :mod="{ 'with-weekdays': props.withWeekDays }"
    >
      <div v-if="props.withWeekDays" v-bind="getStyles('mobileMonthViewWeekdays')">
        <span v-if="props.withWeekNumbers" v-bind="getStyles('mobileMonthViewWeekdaysCorner')" />
        <span
          v-for="(weekday, index) in weekdays"
          :key="index"
          v-bind="getStyles('mobileMonthViewWeekday')"
        >
          {{ weekday }}
        </span>
      </div>

      <div
        v-for="(week, weekIndex) in weeks"
        :key="`week-${weekIndex}`"
        v-bind="getStyles('mobileMonthViewWeek')"
      >
        <UnstyledButton
          v-if="props.withWeekNumbers"
          v-bind="{
            ...weekNumberProps(week[0]),
            ...getStyles('mobileMonthViewWeekNumber', {
              className: weekNumberProps(week[0]).class,
            }),
          }"
          :mod="{ static: isStatic }"
          :tabindex="isStatic ? -1 : 0"
          @click="emit('weekNumberClick', toDayKey(week[0])!, $event)"
        >
          {{ getWeekNumber(week) }}
        </UnstyledButton>

        <UnstyledButton
          v-for="date in week"
          :key="toDayKey(date)!"
          v-bind="{
            ...dayProps(date),
            ...getStyles('mobileMonthViewDay', { className: dayProps(date).class }),
          }"
          :mod="{
            outside: isOutside(date),
            weekend: props.weekendDays!.includes(dayjs(date).day() as DayOfWeek),
            today: props.highlightToday && dayjs(date).isSame(dayjs(), 'day'),
            selected: selected === toDayKey(date),
            static: isStatic,
            hidden: !isRendered(date),
          }"
          :tabindex="isStatic || !isRendered(date) ? -1 : 0"
          :aria-label="formatDate({ date, locale: props.locale || 'en', format: 'MMMM D, YYYY' })"
          :aria-selected="selected === toDayKey(date) || undefined"
          @click="isStatic || !isRendered(date) ? undefined : selectDay(date, $event)"
        >
          <template v-if="isRendered(date)">
            {{ dayjs(date).date() }}
            <span
              v-if="dayIndicators(date).length"
              v-bind="getStyles('mobileMonthViewDayIndicators')"
            >
              <span
                v-for="event in dayIndicators(date)"
                :key="event.id"
                v-bind="getStyles('mobileMonthViewDayIndicator')"
                :style="indicatorStyle(event)"
              />
            </span>
          </template>
        </UnstyledButton>
      </div>
    </Box>

    <Box v-bind="getStyles('mobileMonthViewEventsList')">
      <Text v-bind="getStyles('mobileMonthViewEventsHeader')">
        {{
          selected
            ? formatDate({
                date: selected,
                locale: props.locale || 'en',
                format: props.eventsHeaderFormat!,
              })
            : ''
        }}
      </Text>

      <template v-if="selectedEvents.length">
        <component :is="renderListEvent(event)" v-for="event in selectedEvents" :key="event.id" />
      </template>
      <Text v-else v-bind="getStyles('mobileMonthViewNoEvents')">
        {{ getLabel('noEvents', props.labels) }}
      </Text>
    </Box>
  </Box>
</template>
