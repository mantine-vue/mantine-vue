import { h } from 'vue'
import { Badge, Text } from '@mantine-vue/core'
import {
  ResourcesWeekView,
  type ScheduleEventData,
  type ScheduleResourceData,
  type ScheduleResourceGroup,
} from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const resources: ScheduleResourceData[] = [
  { id: 'alice', label: 'Alice', color: 'blue' },
  { id: 'bob', label: 'Bob', color: 'grape' },
  { id: 'carol', label: 'Carol', color: 'teal' },
]
const groups: ScheduleResourceGroup[] = [
  { label: 'Design', resourceIds: ['alice', 'carol'] },
  { label: 'Product', resourceIds: ['bob'] },
]
const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Planning',
    start: '2026-07-13 09:00:00',
    end: '2026-07-13 11:00:00',
    color: 'blue',
    resourceId: 'alice',
  },
  {
    id: 2,
    title: 'Research',
    start: '2026-07-14 12:00:00',
    end: '2026-07-14 15:00:00',
    color: 'grape',
    resourceId: 'bob',
  },
  {
    id: 3,
    title: 'Workshop',
    start: '2026-07-16 10:00:00',
    end: '2026-07-16 13:00:00',
    color: 'teal',
    resourceId: 'carol',
  },
]
const overlappingEvents = [
  ...events,
  {
    id: 4,
    title: 'Review',
    start: '2026-07-13 09:30:00',
    end: '2026-07-13 10:30:00',
    color: 'pink',
    resourceId: 'alice',
  },
  {
    id: 5,
    title: 'Interview',
    start: '2026-07-13 09:45:00',
    end: '2026-07-13 11:30:00',
    color: 'cyan',
    resourceId: 'alice',
  },
]

const keys = [
  'usage',
  'allDayEvents',
  'dragDrop',
  'eventForm',
  'timeRange',
  'multiHourIntervals',
  'currentTimeIndicator',
  'timezone',
  'firstDayOfWeek',
  'renderWeekLabel',
  'businessHours',
  'withoutWeekendDays',
  'renderResourceLabel',
  'resourceGroups',
  'renderEvent',
  'recurringEvents',
  'maxEventsPerTimeSlot',
  'localization',
  'radius',
  'startScrollDateTime',
  'scrollAreaProps',
  'eventResize',
  'staticMode',
] as const

export const ResourcesWeekViewDemos = createDemoRegistry(
  ResourcesWeekView,
  'ResourcesWeekView',
  keys,
  {
    ...sharedVariants,
    allDayEvents: {
      events: [
        ...events,
        {
          id: 6,
          title: 'Conference',
          start: '2026-07-15 00:00:00',
          end: '2026-07-17 00:00:00',
          color: 'orange',
          resourceId: 'bob',
        },
      ],
    },
    timeRange: {
      props: { startTime: '09:00:00', endTime: '17:00:00' },
      codeProps: 'start-time="09:00:00"\n    end-time="17:00:00"',
    },
    multiHourIntervals: { props: { intervalMinutes: 240 }, codeProps: ':interval-minutes="240"' },
    currentTimeIndicator: {
      props: { withCurrentTimeIndicator: true, getCurrentTime: () => '2026-07-15 14:30:00' },
      codeProps:
        'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
    },
    timezone: {
      props: { withCurrentTimeIndicator: true, getCurrentTime: () => '2026-07-15 12:00:00' },
      codeProps:
        'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 12:00:00\'"',
    },
    firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
    renderWeekLabel: {
      props: {
        renderWeekLabel: ({ weekStart, weekEnd }: { weekStart: string; weekEnd: string }) =>
          h(Badge, { variant: 'light' }, () => `${weekStart} – ${weekEnd}`),
      },
      description: 'The header label can be returned as a VNode or supplied with the header slot.',
    },
    businessHours: {
      props: { highlightBusinessHours: true },
      codeProps: 'highlight-business-hours',
    },
    withoutWeekendDays: {
      props: { withWeekendDays: false },
      codeProps: ':with-weekend-days="false"',
    },
    renderResourceLabel: {
      props: {
        renderResourceLabel: (resource: ScheduleResourceData) =>
          h(Text, { c: resource.color, fw: 600 }, () => resource.label),
      },
      description: 'Resource labels support VNodes and the resource-label named slot.',
    },
    resourceGroups: { groups },
    renderEvent: {
      props: { renderEventBody: (event: ScheduleEventData) => h('strong', event.title) },
    },
    recurringEvents: {
      events: [
        ...events,
        {
          id: 'sync',
          title: 'Daily sync',
          start: '2026-07-13 08:30:00',
          end: '2026-07-13 09:00:00',
          resourceId: 'alice',
          color: 'cyan',
          recurrence: { rrule: 'FREQ=DAILY;COUNT=7' },
        },
      ],
    },
    maxEventsPerTimeSlot: {
      events: overlappingEvents,
      props: { maxEventsPerTimeSlot: 1 },
      codeProps: ':max-events-per-time-slot="1"',
    },
    localization: {
      props: { locale: 'fr', labels: { resources: 'Équipe', resourceSlot: 'Créneau' } },
      codeProps: 'locale="fr"',
    },
    startScrollDateTime: {
      props: { startScrollDateTime: '2026-07-15 12:00:00' },
      codeProps: 'start-scroll-date-time="2026-07-15 12:00:00"',
    },
    scrollAreaProps: {
      props: { scrollAreaProps: { scrollbarSize: 14, offsetScrollbars: true } },
      codeProps: ':scroll-area-props="{ scrollbarSize: 14, offsetScrollbars: true }"',
    },
  },
  {
    resources,
    events,
    props: { startTime: '08:00:00', endTime: '18:00:00', slotWidth: 48 },
    codeProps: 'start-time="08:00:00"\n    end-time="18:00:00"\n    :slot-width="48"',
  },
)
