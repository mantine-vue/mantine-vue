import { h } from 'vue'
import { DayView } from '@mantine-vue/schedule'
import { createDemoRegistry, demoDate, sharedVariants } from './_shared'

const getDemoCurrentTime = () => `${demoDate} 14:30:00`

const keys = [
  'usage',
  'timeRange',
  'startScrollTime',
  'intervalMinutes',
  'slotLabelInterval',
  'allDayEvents',
  'overlappingEvents',
  'eventOverlapMode',
  'currentTimeIndicator',
  'timezone',
  'businessHours',
  'businessHoursMinute',
  'businessHoursColors',
  'getTimeSlotProps',
  'slotHeight',
  'withoutHeader',
  'customHeader',
  'headerFormat',
  'slotLabelFormat',
  'radius',
  'dragDrop',
  'eventDragInterval',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'canDragEvent',
  'eventResize',
  'eventResizeInterval',
  'canResizeEvent',
  'renderEventBody',
  'renderEvent',
  'recurringEvents',
  'backgroundEvents',
  'interactiveBackgroundEvents',
  'backgroundEventsCustomStyle',
  'staticMode',
  'labels',
  'localization',
  'controlledDate',
  'viewChange',
  'eventForm',
] as const

export const DayViewDemos = createDemoRegistry(DayView, 'DayView', keys, {
  ...sharedVariants,
  eventOverlapMode: {
    props: { eventOverlapMode: 'cascade' },
    codeProps: 'event-overlap-mode="cascade"',
  },
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
      intervalMinutes: 15,
      slotLabelInterval: 15,
      slotHeight: 160,
    },
    codeProps:
      'start-time="08:00:00"\n    end-time="18:00:00"\n    :interval-minutes="15"\n    :slot-label-interval="15"\n    :slot-height="160"',
  },
  currentTimeIndicator: {
    props: { withCurrentTimeIndicator: true, getCurrentTime: getDemoCurrentTime },
    codeProps: 'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
  },
  timezone: {
    props: { withCurrentTimeIndicator: true, getCurrentTime: getDemoCurrentTime },
    codeProps: 'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
  },
  businessHours: { props: { highlightBusinessHours: true }, codeProps: 'highlight-business-hours' },
  businessHoursMinute: {
    props: { highlightBusinessHours: true, businessHours: ['07:42', '19:01'] },
    codeProps: `highlight-business-hours\n    :business-hours="['07:42', '19:01']"`,
  },
  businessHoursColors: {
    props: {
      highlightBusinessHours: true,
      businessHours: ['07:42', '19:01'],
      vars: () => ({
        dayView: {
          '--day-view-business-hours-bg': 'var(--mantine-color-yellow-light)',
          '--day-view-non-business-hours-bg': 'var(--mantine-color-blue-light)',
        },
      }),
    },
    codeProps: `highlight-business-hours\n    :business-hours="['07:42', '19:01']"\n    :vars="() => ({ dayView: { '--day-view-business-hours-bg': 'var(--mantine-color-yellow-light)', '--day-view-non-business-hours-bg': 'var(--mantine-color-blue-light)' } })"`,
  },
  getTimeSlotProps: {
    description: 'Listen for the `timeSlotClick` event to inspect or customize individual slots.',
  },
  slotHeight: { props: { slotHeight: 80 }, codeProps: ':slot-height="80"' },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  headerFormat: { props: { headerFormat: 'ddd, MMM D' }, codeProps: 'header-format="ddd, MMM D"' },
  slotLabelFormat: {
    props: { slotLabelFormat: 'h:mm A' },
    codeProps: 'slot-label-format="h:mm A"',
  },
  renderEventBody: {
    props: { renderEventBody: (event: { title: string }) => h('strong', event.title) },
    codeProps: ':render-event-body="(event) => event.title"',
  },
  renderEvent: {
    props: { renderEventBody: (event: { title: string }) => h('em', event.title) },
    codeProps: ':render-event-body="(event) => event.title"',
  },
  labels: {
    props: { labels: { allDay: 'Whole day', today: 'Go to today' } },
    codeProps: `:labels="{ allDay: 'Whole day', today: 'Go to today' }"`,
  },
  controlledDate: {
    description: 'The demo keeps date in a Vue ref and updates it from the `dateChange` event.',
  },
  viewChange: {
    description: 'Listen for the `viewChange` event to switch to another standalone view.',
  },
})
