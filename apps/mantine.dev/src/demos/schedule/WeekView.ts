import { h } from 'vue'
import { WeekView } from '@mantine-vue/schedule'
import { createDemoRegistry, demoDate, sharedVariants } from './_shared'

const getDemoCurrentTime = () => `${demoDate} 14:30:00`

const keys = [
  'usage',
  'controlledDate',
  'timeRange',
  'startScrollTime',
  'intervalMinutes',
  'firstDayOfWeek',
  'weekdayFormat',
  'withoutWeekendDays',
  'highlightToday',
  'withoutWeekNumber',
  'currentTimeIndicator',
  'forceCurrentTimeIndicator',
  'timezone',
  'withoutAllDaySlots',
  'allDayEvents',
  'withoutHeader',
  'viewChange',
  'customHeader',
  'weekLabelFormat',
  'slotLabelFormat',
  'slotHeight',
  'radius',
  'businessHours',
  'businessHoursPerDay',
  'getTimeSlotProps',
  'overlappingEvents',
  'dragDrop',
  'canDragEvent',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'eventResize',
  'canResizeEvent',
  'renderEvent',
  'renderEventBody',
  'recurringEvents',
  'backgroundEvents',
  'backgroundEventsCustomStyle',
  'staticMode',
  'localization',
  'eventForm',
] as const

export const WeekViewDemos = createDemoRegistry(WeekView, 'WeekView', keys, {
  ...sharedVariants,
  controlledDate: { description: 'The displayed week is controlled with a Vue ref.' },
  timeRange: {
    props: { startTime: '09:00:00', endTime: '15:00:00' },
    codeProps: 'start-time="09:00:00"\n    end-time="15:00:00"',
  },
  startScrollTime: {
    props: { startScrollTime: '12:00:00' },
    codeProps: 'start-scroll-time="12:00:00"',
  },
  intervalMinutes: { props: { intervalMinutes: 30 }, codeProps: ':interval-minutes="30"' },
  firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
  weekdayFormat: { props: { weekdayFormat: 'dddd' }, codeProps: 'weekday-format="dddd"' },
  withoutWeekendDays: {
    props: { withWeekendDays: false },
    codeProps: ':with-weekend-days="false"',
  },
  highlightToday: { props: { highlightToday: false }, codeProps: ':highlight-today="false"' },
  withoutWeekNumber: { props: { withWeekNumbers: false }, codeProps: ':with-week-numbers="false"' },
  currentTimeIndicator: {
    props: { withCurrentTimeIndicator: true, getCurrentTime: getDemoCurrentTime },
    codeProps: 'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
  },
  forceCurrentTimeIndicator: {
    props: {
      withCurrentTimeIndicator: true,
      forceCurrentTimeIndicator: true,
      getCurrentTime: () => '2026-07-22 14:30:00',
    },
    codeProps:
      'with-current-time-indicator\n    force-current-time-indicator\n    :get-current-time="() => \'2026-07-22 14:30:00\'"',
  },
  timezone: {
    props: { withCurrentTimeIndicator: true, getCurrentTime: getDemoCurrentTime },
    codeProps: 'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
  },
  withoutAllDaySlots: { props: { withAllDaySlot: false }, codeProps: ':with-all-day-slot="false"' },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  viewChange: { description: 'Use onViewChange to switch to another standalone view.' },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  weekLabelFormat: { props: { weekLabelFormat: 'D MMM' }, codeProps: 'week-label-format="D MMM"' },
  slotLabelFormat: { props: { slotLabelFormat: 'h A' }, codeProps: 'slot-label-format="h A"' },
  slotHeight: { props: { slotHeight: 80 }, codeProps: ':slot-height="80"' },
  businessHours: { props: { highlightBusinessHours: true }, codeProps: 'highlight-business-hours' },
  businessHoursPerDay: {
    props: {
      highlightBusinessHours: true,
      businessHours: { 1: ['09:00:00', '17:00:00'], 5: ['09:00:00', '13:00:00'] },
    },
    codeProps: 'highlight-business-hours',
  },
  getTimeSlotProps: {
    description: 'Use onTimeSlotClick to inspect or customize individual slots.',
  },
  renderEventBody: {
    props: { renderEventBody: (event: { title: string }) => h('strong', event.title) },
    codeProps: ':render-event-body="(event) => event.title"',
  },
  renderEvent: {
    props: { renderEventBody: (event: { title: string }) => h('em', event.title) },
    codeProps: ':render-event-body="(event) => event.title"',
  },
})
