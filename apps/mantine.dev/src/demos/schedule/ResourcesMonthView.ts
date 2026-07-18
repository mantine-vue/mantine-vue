import { h } from 'vue'
import { Text } from '@mantine-vue/core'
import {
  ResourcesMonthView,
  type ScheduleEventData,
  type ScheduleResourceData,
  type ScheduleResourceGroup,
} from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const resources: ScheduleResourceData[] = [
  { id: 'team-a', label: 'Team A', color: 'blue' },
  { id: 'team-b', label: 'Team B', color: 'grape' },
  { id: 'studio', label: 'Studio', color: 'teal' },
]
const groups: ScheduleResourceGroup[] = [
  { label: 'Teams', resourceIds: ['team-a', 'team-b'] },
  { label: 'Facilities', resourceIds: ['studio'] },
]
const events: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Discovery',
    start: '2026-07-03 09:00:00',
    end: '2026-07-06 10:00:00',
    color: 'blue',
    resourceId: 'team-a',
  },
  {
    id: 2,
    title: 'Delivery',
    start: '2026-07-08 09:00:00',
    end: '2026-07-12 17:00:00',
    color: 'grape',
    resourceId: 'team-b',
  },
  {
    id: 3,
    title: 'Production',
    start: '2026-07-15 10:00:00',
    end: '2026-07-18 16:00:00',
    color: 'teal',
    resourceId: 'studio',
  },
  {
    id: 4,
    title: 'Review',
    start: '2026-07-22 13:00:00',
    end: '2026-07-22 15:00:00',
    color: 'orange',
    resourceId: 'team-a',
  },
]
const crowded = [
  ...events,
  {
    id: 5,
    title: 'Planning',
    start: '2026-07-22 09:00:00',
    end: '2026-07-22 10:00:00',
    color: 'pink',
    resourceId: 'team-a',
  },
  {
    id: 6,
    title: 'Sync',
    start: '2026-07-22 10:00:00',
    end: '2026-07-22 11:00:00',
    color: 'cyan',
    resourceId: 'team-a',
  },
]

const keys = [
  'usage',
  'staticMode',
  'dragDrop',
  'eventForm',
  'renderEvent',
  'renderResourceLabel',
  'resourceGroups',
  'localization',
  'recurringEvents',
  'maxEventsPerTimeSlot',
  'dayWidth',
  'startScrollDate',
  'withoutWeekendDays',
  'moreEvents',
  'moreEventsProps',
  'customHeader',
  'radius',
  'scrollAreaProps',
] as const

export const ResourcesMonthViewDemos = createDemoRegistry(
  ResourcesMonthView,
  'ResourcesMonthView',
  keys,
  {
    ...sharedVariants,
    renderEvent: {
      props: { renderEventBody: (event: ScheduleEventData) => h('strong', event.title) },
    },
    renderResourceLabel: {
      props: {
        renderResourceLabel: (resource: ScheduleResourceData) =>
          h(Text, { c: resource.color, fw: 600 }, () => resource.label),
      },
    },
    resourceGroups: { groups },
    localization: {
      props: { locale: 'fr', labels: { resources: 'Ressources' } },
      codeProps: 'locale="fr"',
    },
    recurringEvents: {
      events: [
        ...events,
        {
          id: 'weekly',
          title: 'Weekly sync',
          start: '2026-07-01 09:00:00',
          end: '2026-07-01 10:00:00',
          color: 'cyan',
          resourceId: 'team-a',
          recurrence: { rrule: 'FREQ=WEEKLY;COUNT=6' },
        },
      ],
    },
    maxEventsPerTimeSlot: {
      events: crowded,
      props: { maxEventsPerTimeSlot: 1 },
      codeProps: ':max-events-per-time-slot="1"',
    },
    dayWidth: {
      props: { dayWidth: 100, rowHeight: 80 },
      codeProps: ':day-width="100"\n    :row-height="80"',
    },
    startScrollDate: {
      props: { startScrollDate: '2026-07-15' },
      codeProps: 'start-scroll-date="2026-07-15"',
    },
    withoutWeekendDays: {
      props: { withWeekendDays: false },
      codeProps: ':with-weekend-days="false"',
    },
    moreEvents: {
      events: crowded,
      props: { maxEventsPerTimeSlot: 1 },
      codeProps: ':max-events-per-time-slot="1"',
    },
    moreEventsProps: {
      events: crowded,
      props: {
        maxEventsPerTimeSlot: 1,
        moreEventsProps: { dropdownType: 'modal', modalTitle: 'Events' },
      },
      codeProps:
        ':max-events-per-time-slot="1"\n    :more-events-props="{ dropdownType: \'modal\', modalTitle: \'Events\' }"',
    },
    customHeader: {
      props: { withHeader: false },
      codeProps: ':with-header="false"',
      description: 'Use the header slot to supply a fully custom header.',
    },
    scrollAreaProps: {
      props: { scrollAreaProps: { scrollbarSize: 14, offsetScrollbars: true } },
      codeProps: ':scroll-area-props="{ scrollbarSize: 14, offsetScrollbars: true }"',
    },
  },
  {
    resources,
    events,
    props: { dayWidth: 80, rowHeight: 64 },
    codeProps: ':day-width="80"\n    :row-height="64"',
  },
)
