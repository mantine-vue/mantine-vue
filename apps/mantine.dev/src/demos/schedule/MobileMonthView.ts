import { h, type VNodeChild } from 'vue'
import { MobileMonthView } from '@mantine-vue/schedule'
import { createDemoRegistry, demoDate, sharedVariants } from './_shared'

const keys = [
  'usage',
  'withWeekNumbers',
  'withOutsideDays',
  'highlightToday',
  'firstDayOfWeek',
  'renderHeader',
  'consistentWeeks',
  'weekdayFormat',
  'withoutWeekDays',
  'staticMode',
  'localization',
] as const

export const MobileMonthViewDemos = createDemoRegistry(
  MobileMonthView,
  'MobileMonthView',
  keys,
  {
    ...sharedVariants,
    withWeekNumbers: { props: { withWeekNumbers: true }, codeProps: 'with-week-numbers' },
    withOutsideDays: { props: { withOutsideDays: true }, codeProps: 'with-outside-days' },
    highlightToday: { props: { highlightToday: false }, codeProps: ':highlight-today="false"' },
    firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
    renderHeader: {
      props: {
        renderHeader: ({ defaultHeader }: { defaultHeader: unknown }) =>
          h('div', { style: { borderBottom: '1px solid var(--mantine-color-default-border)' } }, [
            defaultHeader as VNodeChild,
          ]),
      },
      codeProps: ':render-header="({ defaultHeader }) => defaultHeader"',
    },
    consistentWeeks: { props: { consistentWeeks: false }, codeProps: ':consistent-weeks="false"' },
    weekdayFormat: { props: { weekdayFormat: 'ddd' }, codeProps: 'weekday-format="ddd"' },
    withoutWeekDays: { props: { withWeekDays: false }, codeProps: ':with-week-days="false"' },
  },
  {
    centered: true,
    maxWidth: 375,
    selectedDate: demoDate,
  },
)
