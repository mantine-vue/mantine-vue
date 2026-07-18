import {
  ResourcesSchedule,
  type ScheduleEventData,
  type ScheduleResourceData,
} from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const resources: ScheduleResourceData[] = [
  { id: 'tokyo', label: 'Meeting room: Tokyo', color: 'blue' },
  { id: 'paris', label: 'Meeting room: Paris', color: 'grape' },
  { id: 'new-york', label: 'Meeting room: New York', color: 'teal' },
  { id: 'london', label: 'Meeting room: London', color: 'orange' },
]

const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Team standup',
    start: '2026-07-15 09:00:00',
    end: '2026-07-15 09:30:00',
    color: 'blue',
    resourceId: 'tokyo',
  },
  {
    id: 2,
    title: 'Sprint planning',
    start: '2026-07-15 10:00:00',
    end: '2026-07-15 11:30:00',
    color: 'green',
    resourceId: 'tokyo',
  },
  {
    id: 3,
    title: 'Client call',
    start: '2026-07-15 09:30:00',
    end: '2026-07-15 10:30:00',
    color: 'violet',
    resourceId: 'paris',
  },
  {
    id: 4,
    title: 'Design review',
    start: '2026-07-16 13:00:00',
    end: '2026-07-16 14:00:00',
    color: 'orange',
    resourceId: 'paris',
  },
  {
    id: 5,
    title: '1:1 meeting',
    start: '2026-07-15 11:00:00',
    end: '2026-07-15 11:30:00',
    color: 'cyan',
    resourceId: 'new-york',
  },
  {
    id: 6,
    title: 'Workshop',
    start: '2026-07-20 14:00:00',
    end: '2026-07-20 16:00:00',
    color: 'pink',
    resourceId: 'new-york',
  },
  {
    id: 7,
    title: 'Architecture review',
    start: '2026-07-15 10:00:00',
    end: '2026-07-15 11:00:00',
    color: 'red',
    resourceId: 'london',
  },
  {
    id: 8,
    title: 'Retrospective',
    start: '2026-07-16 15:00:00',
    end: '2026-07-16 16:00:00',
    color: 'grape',
    resourceId: 'london',
  },
]

const keys = [
  'usage',
  'controlled',
  'dragDrop',
  'weekView',
  'viewProps',
  'eventForm',
  'externalDragDrop',
  'eventResize',
  'staticMode',
] as const

export const ResourcesScheduleDemos = createDemoRegistry(
  ResourcesSchedule,
  'ResourcesSchedule',
  keys,
  {
    ...sharedVariants,
    controlled: {
      description:
        'Control the current date and view level with date/onDateChange and view/onViewChange.',
    },
    weekView: {
      props: { defaultView: 'week' },
      codeProps: 'default-view="week"',
    },
    viewProps: {
      props: {
        dayViewProps: { startTime: '08:00:00', endTime: '18:00:00', intervalMinutes: 30 },
        weekViewProps: { startTime: '09:00:00', endTime: '17:00:00' },
        monthViewProps: { withWeekendDays: false },
      },
      codeProps:
        ":day-view-props=\"{ startTime: '08:00:00', endTime: '18:00:00', intervalMinutes: 30 }\"\n    :week-view-props=\"{ startTime: '09:00:00', endTime: '17:00:00' }\"\n    :month-view-props=\"{ withWeekendDays: false }\"",
      description: 'Pass view-specific props with dayViewProps, weekViewProps and monthViewProps.',
    },
  },
  {
    resources,
    events,
    props: {
      dayViewProps: { startTime: '08:00:00', endTime: '18:00:00' },
      weekViewProps: { startTime: '08:00:00', endTime: '18:00:00' },
    },
    codeProps:
      ":day-view-props=\"{ startTime: '08:00:00', endTime: '18:00:00' }\"\n    :week-view-props=\"{ startTime: '08:00:00', endTime: '18:00:00' }\"",
  },
)
