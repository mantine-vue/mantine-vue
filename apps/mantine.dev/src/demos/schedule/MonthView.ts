import { h } from 'vue'
import { MonthView } from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants, overlappingEvents } from './_shared'

const keys = [
  'usage',
  'withWeekNumbers',
  'withoutWeekDays',
  'firstDayOfWeek',
  'weekdayFormat',
  'consistentWeeks',
  'highlightToday',
  'withoutOutsideDays',
  'radius',
  'withoutHeader',
  'customHeader',
  'maxEventsPerDay',
  'manyEvents',
  'dragDrop',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'renderEvent',
  'timedEvents',
  'recurringEvents',
  'backgroundEvents',
  'staticMode',
  'localization',
  'eventForm',
] as const

export const MonthViewDemos = createDemoRegistry(MonthView, 'MonthView', keys, {
  ...sharedVariants,
  withWeekNumbers: { props: { withWeekNumbers: true }, codeProps: 'with-week-numbers' },
  withoutWeekDays: { props: { withWeekDays: false }, codeProps: ':with-week-days="false"' },
  firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
  weekdayFormat: { props: { weekdayFormat: 'dddd' }, codeProps: 'weekday-format="dddd"' },
  consistentWeeks: { props: { consistentWeeks: true }, codeProps: 'consistent-weeks' },
  highlightToday: { props: { highlightToday: false }, codeProps: ':highlight-today="false"' },
  withoutOutsideDays: {
    props: { withOutsideDays: false },
    codeProps: ':with-outside-days="false"',
  },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  maxEventsPerDay: { props: { maxEventsPerDay: 2 }, codeProps: ':max-events-per-day="2"' },
  manyEvents: {
    events: overlappingEvents,
    props: { maxEventsPerDay: 2 },
    codeProps: ':max-events-per-day="2"',
  },
  renderEvent: {
    props: { renderEventBody: (event: { title: string }) => h('em', event.title) },
    codeProps: ':render-event-body="(event) => event.title"',
  },
  timedEvents: {},
})
