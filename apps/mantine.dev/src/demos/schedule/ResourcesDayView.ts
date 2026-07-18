import { h } from 'vue'
import { Avatar, Group, Text } from '@mantine-vue/core'
import {
  ResourcesDayView,
  type ScheduleEventData,
  type ScheduleResourceData,
  type ScheduleResourceGroup,
} from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const resources: ScheduleResourceData[] = [
  { id: 'room-a', label: 'Room A', color: 'blue' },
  { id: 'room-b', label: 'Room B', color: 'grape' },
  { id: 'room-c', label: 'Room C', color: 'teal' },
  { id: 'studio', label: 'Studio', color: 'orange' },
]

const groups: ScheduleResourceGroup[] = [
  { label: 'Meeting rooms', resourceIds: ['room-a', 'room-b', 'room-c'] },
  { label: 'Production', resourceIds: ['studio'] },
]

const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Team planning',
    start: '2026-07-15 09:00:00',
    end: '2026-07-15 10:30:00',
    color: 'blue',
    resourceId: 'room-a',
  },
  {
    id: 2,
    title: 'Product review',
    start: '2026-07-15 11:00:00',
    end: '2026-07-15 12:30:00',
    color: 'grape',
    resourceId: 'room-b',
  },
  {
    id: 3,
    title: 'Design workshop',
    start: '2026-07-15 13:00:00',
    end: '2026-07-15 15:00:00',
    color: 'teal',
    resourceId: 'room-c',
  },
  {
    id: 4,
    title: 'Video shoot',
    start: '2026-07-15 10:00:00',
    end: '2026-07-15 13:00:00',
    color: 'orange',
    resourceId: 'studio',
  },
]

const overlappingEvents: ScheduleEventData[] = [
  ...events,
  {
    id: 5,
    title: 'Customer call',
    start: '2026-07-15 09:30:00',
    end: '2026-07-15 10:45:00',
    color: 'pink',
    resourceId: 'room-a',
  },
  {
    id: 6,
    title: 'Interview',
    start: '2026-07-15 09:45:00',
    end: '2026-07-15 11:00:00',
    color: 'cyan',
    resourceId: 'room-a',
  },
]

const allDayEvents: ScheduleEventData[] = [
  ...events,
  {
    id: 7,
    title: 'Maintenance',
    start: '2026-07-15 00:00:00',
    end: '2026-07-16 00:00:00',
    color: 'red',
    resourceId: 'room-b',
  },
]

const keys = [
  'usage',
  'allDayEvents',
  'timeRange',
  'multiHourIntervals',
  'startScrollTime',
  'slotWidth',
  'renderResourceLabel',
  'resourceGroups',
  'renderEvent',
  'dragDrop',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'eventResize',
  'eventForm',
  'businessHours',
  'currentTimeIndicator',
  'timezone',
  'permissions',
  'recurringEvents',
  'maxEventsPerTimeSlot',
  'radius',
  'scrollAreaProps',
  'localization',
  'staticMode',
] as const

export const ResourcesDayViewDemos = createDemoRegistry(
  ResourcesDayView,
  'ResourcesDayView',
  keys,
  {
    ...sharedVariants,
    allDayEvents: { events: allDayEvents },
    timeRange: {
      props: { startTime: '09:00:00', endTime: '16:00:00' },
      codeProps: 'start-time="09:00:00"\n    end-time="16:00:00"',
    },
    multiHourIntervals: { props: { intervalMinutes: 120 }, codeProps: ':interval-minutes="120"' },
    startScrollTime: {
      props: { startScrollTime: '12:00:00' },
      codeProps: 'start-scroll-time="12:00:00"',
    },
    slotWidth: {
      props: { slotWidth: 110, rowHeight: 72 },
      codeProps: ':slot-width="110"\n    :row-height="72"',
    },
    renderResourceLabel: {
      props: {
        renderResourceLabel: (resource: ScheduleResourceData) =>
          h(Group, { gap: 'xs', wrap: 'nowrap' }, () => [
            h(Avatar, { size: 24, color: resource.color }, () => String(resource.label).slice(-1)),
            h(Text, { size: 'sm' }, () => resource.label),
          ]),
      },
      description:
        'Resource labels accept VNodes; use the resource-label slot for template-based customization.',
    },
    resourceGroups: { groups },
    renderEvent: {
      props: { renderEventBody: (event: ScheduleEventData) => h('strong', event.title) },
    },
    businessHours: {
      props: { highlightBusinessHours: true, businessHours: ['09:00:00', '17:00:00'] },
      codeProps: "highlight-business-hours\n    :business-hours=\"['09:00:00', '17:00:00']\"",
    },
    currentTimeIndicator: {
      props: { withCurrentTimeIndicator: true, getCurrentTime: () => '2026-07-15 14:30:00' },
      codeProps:
        'with-current-time-indicator\n    :get-current-time="() => \'2026-07-15 14:30:00\'"',
    },
    timezone: {
      props: { withCurrentTimeIndicator: true, getCurrentTime: () => '2026-07-15 12:00:00' },
      codeProps: 'with-current-time-indicator',
    },
    permissions: {
      props: {
        withEventsDragAndDrop: true,
        withEventResize: true,
        canDragEvent: (event: ScheduleEventData) => event.id !== 1,
        canResizeEvent: (event: ScheduleEventData) => event.id !== 1,
      },
      codeProps: 'with-events-drag-and-drop\n    with-event-resize',
    },
    recurringEvents: {
      events: [
        ...events,
        {
          id: 'standup',
          title: 'Daily stand-up',
          start: '2026-07-15 08:30:00',
          end: '2026-07-15 09:00:00',
          resourceId: 'room-a',
          color: 'cyan',
          recurrence: { rrule: 'FREQ=DAILY;COUNT=5' },
        },
      ],
    },
    maxEventsPerTimeSlot: {
      events: overlappingEvents,
      props: { maxEventsPerTimeSlot: 1 },
      codeProps: ':max-events-per-time-slot="1"',
    },
    scrollAreaProps: {
      props: { scrollAreaProps: { scrollbarSize: 14, offsetScrollbars: true } },
      codeProps: ':scroll-area-props="{ scrollbarSize: 14, offsetScrollbars: true }"',
    },
    localization: {
      props: { locale: 'fr', labels: { resources: 'Salles', resourceSlot: 'Créneau' } },
      codeProps: 'locale="fr"',
    },
  },
  {
    resources,
    events,
    props: { startTime: '08:00:00', endTime: '18:00:00' },
    codeProps: 'start-time="08:00:00"\n    end-time="18:00:00"',
  },
)
