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
  'slotLabelInterval',
  'firstDayOfWeek',
  'weekdayFormat',
  'withoutWeekendDays',
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
  'businessHoursMinute',
  'businessHoursColors',
  'businessHoursPerDay',
  'getTimeSlotProps',
  'overlappingEvents',
  'eventOverlapMode',
  'dragDrop',
  'eventDragInterval',
  'canDragEvent',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'eventResize',
  'eventResizeInterval',
  'canResizeEvent',
  'renderEvent',
  'renderEventBody',
  'recurringEvents',
  'backgroundEvents',
  'interactiveBackgroundEvents',
  'backgroundEventsCustomStyle',
  'staticMode',
  'localization',
  'eventForm',
] as const

export const WeekViewDemos = createDemoRegistry(WeekView, 'WeekView', keys, {
  ...sharedVariants,
  eventOverlapMode: {
    props: { eventOverlapMode: 'cascade' },
    codeProps: 'event-overlap-mode="cascade"',
  },
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
  slotLabelInterval: {
    props: {
      startTime: '08:00:00',
      endTime: '18:00:00',
      intervalMinutes: 30,
      slotLabelInterval: 30,
      slotHeight: 120,
    },
    codeProps:
      'start-time="08:00:00"\n    end-time="18:00:00"\n    :interval-minutes="30"\n    :slot-label-interval="30"\n    :slot-height="120"',
  },
  firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
  weekdayFormat: { props: { weekdayFormat: 'dddd' }, codeProps: 'weekday-format="dddd"' },
  withoutWeekendDays: {
    props: { withWeekendDays: false },
    codeProps: ':with-weekend-days="false"',
  },
  withoutWeekNumber: { props: { withWeekNumber: false }, codeProps: ':with-week-number="false"' },
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
  withoutAllDaySlots: {
    props: { withAllDaySlots: false },
    codeProps: ':with-all-day-slots="false"',
  },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  viewChange: {
    description: 'Listen for the `viewChange` event to switch to another standalone view.',
  },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  weekLabelFormat: { props: { weekLabelFormat: 'D MMM' }, codeProps: 'week-label-format="D MMM"' },
  slotLabelFormat: { props: { slotLabelFormat: 'h A' }, codeProps: 'slot-label-format="h A"' },
  slotHeight: { props: { slotHeight: 80 }, codeProps: ':slot-height="80"' },
  businessHours: { props: { highlightBusinessHours: true }, codeProps: 'highlight-business-hours' },
  businessHoursMinute: {
    props: {
      highlightBusinessHours: true,
      businessHours: ['07:42', '19:01'],
      intervalMinutes: 30,
    },
    codeProps: `highlight-business-hours\n    :business-hours="['07:42', '19:01']"\n    :interval-minutes="30"`,
  },
  businessHoursColors: {
    props: {
      highlightBusinessHours: true,
      businessHours: ['07:42', '19:01'],
      vars: () => ({
        weekView: {
          '--week-view-business-hours-bg': 'var(--mantine-color-yellow-light)',
          '--week-view-non-business-hours-bg': 'var(--mantine-color-blue-light)',
        },
      }),
    },
    codeProps: `highlight-business-hours\n    :business-hours="['07:42', '19:01']"\n    :vars="() => ({ weekView: { '--week-view-business-hours-bg': 'var(--mantine-color-yellow-light)', '--week-view-non-business-hours-bg': 'var(--mantine-color-blue-light)' } })"`,
  },
  businessHoursPerDay: {
    props: {
      highlightBusinessHours: true,
      businessHours: { 1: ['09:00:00', '17:00:00'], 5: ['09:00:00', '13:00:00'] },
    },
    codeProps: 'highlight-business-hours',
  },
  getTimeSlotProps: {
    description: 'Listen for the `timeSlotClick` event to inspect or customize individual slots.',
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
