import { Schedule } from '@mantine-vue/schedule'
import { createDemoRegistry, demoDate, sharedVariants } from './_shared'

const getDemoCurrentTime = () => `${demoDate} 14:30:00`

const keys = [
  'usage',
  'controlled',
  'viewProps',
  'defaultView',
  'customHeader',
  'dragDrop',
  'eventForm',
  'externalDragDrop',
  'bidirectionalDragDrop',
  'eventResize',
  'recurringEvents',
  'backgroundEvents',
  'responsiveLayout',
] as const

export const ScheduleDemos = createDemoRegistry(Schedule, 'Schedule', keys, {
  ...sharedVariants,
  usage: {
    props: {
      dayViewProps: { getCurrentTime: getDemoCurrentTime },
      weekViewProps: { getCurrentTime: getDemoCurrentTime },
    },
    codeProps: `:day-view-props="{ getCurrentTime: () => '2026-07-15 14:30:00' }"
    :week-view-props="{ getCurrentTime: () => '2026-07-15 14:30:00' }"`,
  },
  controlled: { props: { view: 'week' }, codeProps: 'view="week"' },
  viewProps: {
    props: {
      dayViewProps: { startTime: '09:00:00', endTime: '17:00:00' },
      weekViewProps: { firstDayOfWeek: 0 },
    },
    codeProps: `:day-view-props="{ startTime: '09:00:00', endTime: '17:00:00' }"\n    :week-view-props="{ firstDayOfWeek: 0 }"`,
  },
  defaultView: { props: { defaultView: 'month' }, codeProps: 'default-view="month"' },
  customHeader: {
    props: {
      dayViewProps: { withHeader: false },
      weekViewProps: { withHeader: false },
      monthViewProps: { withHeader: false },
      yearViewProps: { withHeader: false },
    },
    description: 'Pass withHeader: false to each view when rendering a custom header.',
  },
  responsiveLayout: { props: { layout: 'responsive' }, codeProps: 'layout="responsive"' },
})
