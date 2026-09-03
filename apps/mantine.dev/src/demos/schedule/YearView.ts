import { h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { YearView, type ScheduleEventData } from '@mantine-vue/schedule'
import { createDemoRegistry, sharedVariants } from './_shared'

const keys = [
  'usage',
  'withWeekNumbers',
  'withoutWeekDays',
  'renderDay',
  'withoutWeekendDays',
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
  renderDay: {
    props: {
      renderDay: (date: string, events: ScheduleEventData[]) =>
        h('div', { style: { position: 'relative' } }, [
          h('span', null, Number(date.slice(-2))),
          events.length
            ? h(Badge, { size: 'xs', circle: true, pos: 'absolute', top: -8, right: -10 }, () =>
                String(events.length),
              )
            : null,
        ]),
    },
    codeProps:
      ":render-day=\"(date, events) => h('span', {}, Number(date.slice(-2)) + ' (' + events.length + ')')\"",
  },
  withoutWeekendDays: {
    props: { withWeekendDays: false },
    codeProps: ':with-weekend-days="false"',
  },
  withOutsideDays: { props: { withOutsideDays: false }, codeProps: ':with-outside-days="false"' },
  firstDayOfWeek: { props: { firstDayOfWeek: 0 }, codeProps: ':first-day-of-week="0"' },
  weekdayFormat: { props: { weekdayFormat: 'ddd' }, codeProps: 'weekday-format="ddd"' },
  highlightToday: { props: { highlightToday: false }, codeProps: ':highlight-today="false"' },
  withoutHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
  customHeader: { props: { withHeader: false }, codeProps: ':with-header="false"' },
})
