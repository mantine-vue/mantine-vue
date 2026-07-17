import { YearView } from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const keys = [
  'usage',
  'withWeekNumbers',
  'withoutWeekDays',
  'withOutsideDays',
  'firstDayOfWeek',
  'weekdayFormat',
  'highlightToday',
  'withoutHeader',
  'customHeader',
  'recurringEvents',
  'staticMode',
  'localization',
] as const

export const YearViewDemos = createDemoRegistry(YearView, 'YearView', keys, {
  ...sharedVariants,
  withWeekNumbers: { props: { withWeekNumbers: true }, codeProps: 'with-week-numbers' },
  withoutWeekDays: { props: { withWeekDays: false }, codeProps: ':with-week-days="false"' },
  withOutsideDays: { props: { withOutsideDays: false }, codeProps: ':with-outside-days="false"' },
  firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
  weekdayFormat: { props: { weekdayFormat: 'ddd' }, codeProps: 'weekday-format="ddd"' },
  highlightToday: { props: { highlightToday: false }, codeProps: ':highlight-today="false"' },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
})
