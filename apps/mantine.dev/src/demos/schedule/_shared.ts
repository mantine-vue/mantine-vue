/* oxlint-disable no-console */

import { defineComponent, h, ref, type Component } from 'vue'
import type { MantineDemo } from '@/demo'
import type { ScheduleEventData } from '@mantine-vue/schedule'

interface EventDropData {
  eventId: string | number
  newStart: string
  newEnd: string
}

export const demoDate = '2026-07-15'

export const baseEvents: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Team planning',
    start: '2026-07-15 09:00:00',
    end: '2026-07-15 10:30:00',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Product review',
    start: '2026-07-15 11:00:00',
    end: '2026-07-15 12:00:00',
    color: 'grape',
  },
  {
    id: 3,
    title: 'Design workshop',
    start: '2026-07-16 13:00:00',
    end: '2026-07-16 15:00:00',
    color: 'teal',
  },
  {
    id: 4,
    title: 'Company offsite',
    start: '2026-07-20 00:00:00',
    end: '2026-07-22 00:00:00',
    color: 'orange',
  },
]

export const overlappingEvents: ScheduleEventData[] = [
  ...baseEvents,
  {
    id: 5,
    title: 'Customer call',
    start: '2026-07-15 09:30:00',
    end: '2026-07-15 11:00:00',
    color: 'pink',
  },
]

export const backgroundEvents: ScheduleEventData[] = [
  ...baseEvents,
  {
    id: 'focus-hours',
    title: 'Focus hours',
    start: '2026-07-15 08:00:00',
    end: '2026-07-15 17:00:00',
    color: 'gray',
    display: 'background',
  },
]

export const recurringEvents: ScheduleEventData[] = [
  ...baseEvents,
  {
    id: 'daily-standup',
    title: 'Daily stand-up',
    start: '2026-07-13 10:00:00',
    end: '2026-07-13 10:30:00',
    color: 'cyan',
    recurrence: { rrule: 'FREQ=DAILY;COUNT=14' },
  },
]

export interface ScheduleDemoOptions {
  props?: Record<string, unknown>
  codeProps?: string
  events?: ScheduleEventData[]
  description?: string
  date?: string
  minHeight?: number
  maxWidth?: number | string
  centered?: boolean
  selectedDate?: string | null
}

function vueCode(componentName: string, options: ScheduleDemoOptions) {
  const attributes = options.codeProps ? `\n    ${options.codeProps.trim()}` : ''
  const withSelectedDate = Object.hasOwn(options, 'selectedDate')
  const selectedDateState = withSelectedDate
    ? `\nconst selectedDate = ref<string | null>(${JSON.stringify(options.selectedDate)})`
    : ''
  const selectedDateProps = withSelectedDate
    ? '\n    :selected-date="selectedDate"\n    :on-selected-date-change="(value) => (selectedDate = value)"'
    : ''
  return `<script setup lang="ts">
import { ref } from 'vue'
import { ${componentName}, type ScheduleEventData } from '@mantine-vue/schedule'

const date = ref('${options.date || demoDate}')${selectedDateState}
const events = ref<ScheduleEventData[]>(${JSON.stringify(options.events || baseEvents, null, 2)})
</script>

<template>
  <${componentName}
    :date="date"
    :events="events"${selectedDateProps}${attributes}
    :on-date-change="(value) => (date = value)"
  />
</template>`
}

export function createScheduleDemo(
  component: Component,
  componentName: string,
  options: ScheduleDemoOptions = {},
): MantineDemo {
  const Demo = defineComponent({
    name: `${componentName}DocsDemo`,
    setup() {
      const date = ref(options.date || demoDate)
      const selectedDate = ref(options.selectedDate)
      const events = ref<ScheduleEventData[]>(
        (options.events || baseEvents).map((event) => ({ ...event })),
      )
      const updateEvent = (data: EventDropData) => {
        events.value = events.value.map((event: ScheduleEventData) =>
          event.id === data.eventId ? { ...event, start: data.newStart, end: data.newEnd } : event,
        )
      }

      return () =>
        h('div', { style: { width: '100%' } }, [
          options.description
            ? h(
                'p',
                { style: { marginTop: 0, color: 'var(--mantine-color-dimmed)' } },
                options.description,
              )
            : null,
          h(component, {
            date: date.value,
            events: events.value,
            ...(Object.hasOwn(options, 'selectedDate')
              ? {
                  selectedDate: selectedDate.value,
                  onSelectedDateChange: (value: string | null) => {
                    selectedDate.value = value
                  },
                }
              : {}),
            startTime: '08:00:00',
            endTime: '18:00:00',
            onDateChange: (value: string) => {
              date.value = value
            },
            onEventDrop: updateEvent,
            onEventResize: updateEvent,
            onTimeSlotClick: (value: unknown) => console.log('time slot click', value),
            onDayClick: (value: unknown) => console.log('day click', value),
            onEventClick: (value: unknown) => console.log('event click', value),
            onSlotDragEnd: (start: string, end: string) =>
              console.log('selected range', start, end),
            ...options.props,
          }),
        ])
    },
  })

  return {
    type: 'code',
    component: Demo,
    code: vueCode(componentName, options),
    minHeight: options.minHeight,
    maxWidth: options.maxWidth,
    centered: options.centered,
  }
}

export function createDemoRegistry<const Keys extends readonly string[]>(
  component: Component,
  componentName: string,
  keys: Keys,
  variants: Partial<Record<Keys[number], ScheduleDemoOptions>> = {},
  defaults: ScheduleDemoOptions = {},
) {
  return Object.fromEntries(
    keys.map((key) => {
      const variant = variants[key as Keys[number]] || {}
      const codeProps = [defaults.codeProps, variant.codeProps].filter(Boolean).join('\n    ')
      return [
        key,
        createScheduleDemo(component, componentName, {
          ...defaults,
          ...variant,
          props: { ...defaults.props, ...variant.props },
          codeProps: codeProps || undefined,
        }),
      ]
    }),
  ) as Record<Keys[number], MantineDemo>
}

export const sharedVariants: Record<string, ScheduleDemoOptions> = {
  recurringEvents: {
    events: recurringEvents,
    description: 'Recurring events are expanded for the visible range.',
  },
  backgroundEvents: {
    events: backgroundEvents,
    description: 'Background events render behind regular events.',
  },
  backgroundEventsCustomStyle: { events: backgroundEvents },
  overlappingEvents: { events: overlappingEvents },
  allDayEvents: { events: baseEvents },
  dragDrop: { props: { withEventsDragAndDrop: true }, codeProps: 'with-events-drag-and-drop' },
  bidirectionalDragDrop: {
    props: { withEventsDragAndDrop: true },
    codeProps: 'with-events-drag-and-drop',
    description: 'Events can be moved between slots; external items can use onExternalEventDrop.',
  },
  externalDragDrop: { description: 'Drop external draggable data onto a day or time slot.' },
  eventResize: {
    props: { withEventResize: true },
    codeProps: 'with-event-resize',
  },
  canResizeEvent: {
    props: { withEventResize: true, canResizeEvent: (event: ScheduleEventData) => event.id !== 1 },
    codeProps: 'with-event-resize\n    :can-resize-event="(event) => event.id !== 1"',
  },
  canDragEvent: {
    props: {
      withEventsDragAndDrop: true,
      canDragEvent: (event: ScheduleEventData) => event.id !== 1,
    },
    codeProps: 'with-events-drag-and-drop\n    :can-drag-event="(event) => event.id !== 1"',
  },
  eventForm: {
    props: { withDragSlotSelect: true },
    codeProps: 'with-drag-slot-select',
    description: 'Click or drag across slots to create an event range.',
  },
  staticMode: { props: { mode: 'static' }, codeProps: 'mode="static"' },
  radius: { props: { radius: 'lg' }, codeProps: 'radius="lg"' },
  localization: {
    props: {
      labels: { today: "Aujourd'hui", day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année' },
    },
    codeProps: `:labels="{ today: "Aujourd'hui", day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année' }"`,
  },
}
