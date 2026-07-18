/* oxlint-disable no-console */

import dayjs from 'dayjs'
import { defineComponent, h, ref, type Component } from 'vue'
import type { MantineDemo } from '@/demo'
import type {
  ScheduleEventData,
  ScheduleResourceData,
  ScheduleResourceGroup,
} from '@mantine-vue/schedule'

interface EventDropData {
  eventId: string | number
  newStart: string
  newEnd: string
  resourceId?: string | number
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
  resources?: ScheduleResourceData[]
  groups?: ScheduleResourceGroup[]
  interactiveForm?: boolean
  externalDrag?: boolean
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
  const resourcesState = options.resources
    ? `\nconst resources: ScheduleResourceData[] = ${JSON.stringify(options.resources, null, 2)}`
    : ''
  const resourcesProps = options.resources ? '\n    :resources="resources"' : ''
  const formFunction = options.interactiveForm
    ? `
function createEvent(data: { date?: string; slotStart?: string; slotEnd?: string; rangeStart?: string; rangeEnd?: string; resourceId?: string | number }) {
  const start = data.slotStart || data.rangeStart || (data.date ? data.date + ' 09:00:00' : undefined)
  const end = data.slotEnd || data.rangeEnd || (data.date ? data.date + ' 10:00:00' : undefined)
  if (start && end) {
    events.value.push({ id: Date.now(), title: 'New event', start, end, color: 'cyan', resourceId: data.resourceId })
  }
}
`
    : ''
  const formProps = options.interactiveForm
    ? '\n    :on-time-slot-click="createEvent"\n    :on-day-click="createEvent"\n    :on-slot-drag-end="createEvent"'
    : ''
  const externalImport = options.externalDrag ? "\nimport dayjs from 'dayjs'" : ''
  const externalFunctions = options.externalDrag
    ? `
function startExternalDrag(event: DragEvent) {
  event.dataTransfer?.setData('text/plain', 'external-task')
}

function dropExternal(data: { dropDateTime: string; resourceId?: string | number }) {
  events.value.push({
    id: Date.now(),
    title: 'External task',
    start: data.dropDateTime,
    end: dayjs(data.dropDateTime).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    color: 'lime',
    resourceId: data.resourceId,
  })
}
`
    : ''
  const externalMarkup = options.externalDrag
    ? `  <div draggable="true" class="external-task" @dragstart="startExternalDrag">
    Drag this task onto a resource
  </div>
`
    : ''
  const externalProps = options.externalDrag ? '\n    :on-external-event-drop="dropExternal"' : ''
  return `<script setup lang="ts">
import { ref } from 'vue'
${externalImport}
import { ${componentName}, type ScheduleEventData, type ScheduleResourceData } from '@mantine-vue/schedule'

const date = ref('${options.date || demoDate}')${selectedDateState}
const events = ref<ScheduleEventData[]>(${JSON.stringify(options.events || baseEvents, null, 2)})${resourcesState}

function updateEvent(data: { eventId: string | number; newStart: string; newEnd: string; resourceId?: string | number }) {
  events.value = events.value.map((event) =>
    event.id === data.eventId
      ? { ...event, start: data.newStart, end: data.newEnd, resourceId: data.resourceId ?? event.resourceId }
      : event
  )
}
${formFunction}${externalFunctions}
</script>

<template>
${externalMarkup}
  <${componentName}
    :date="date"
    :events="events"${resourcesProps}${selectedDateProps}${attributes}
    :on-date-change="(value) => (date = value)"
    :on-event-drop="updateEvent"
    :on-event-resize="updateEvent"${formProps}${externalProps}
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
      const status = ref('')
      const updateEvent = (data: EventDropData) => {
        events.value = events.value.map((event: ScheduleEventData) =>
          event.id === data.eventId
            ? {
                ...event,
                start: data.newStart,
                end: data.newEnd,
                resourceId: data.resourceId ?? event.resourceId,
              }
            : event,
        )
      }
      const createEvent = (data: unknown) => {
        if (!options.interactiveForm || typeof data !== 'object' || data === null) return
        const value = data as {
          slotStart?: string
          slotEnd?: string
          rangeStart?: string
          rangeEnd?: string
          date?: string
          resourceId?: string | number
        }
        const start =
          value.slotStart || value.rangeStart || (value.date ? `${value.date} 09:00:00` : undefined)
        const end =
          value.slotEnd || value.rangeEnd || (value.date ? `${value.date} 10:00:00` : undefined)
        if (!start || !end) return
        events.value = [
          ...events.value,
          {
            id: `created-${events.value.length}`,
            title: 'New event',
            start,
            end,
            color: 'cyan',
            resourceId: value.resourceId,
          },
        ]
        status.value = `Created event: ${start} â€“ ${end}`
      }
      const dropExternal = (data: unknown) => {
        if (!options.externalDrag || typeof data !== 'object' || data === null) return
        const value = data as { dropDateTime?: string; resourceId?: string | number }
        if (!value.dropDateTime) return
        events.value = [
          ...events.value,
          {
            id: `external-${events.value.length}`,
            title: 'External task',
            start: value.dropDateTime,
            end: dayjs(value.dropDateTime).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            color: 'lime',
            resourceId: value.resourceId,
          },
        ]
        status.value = `Dropped external task on ${value.resourceId ?? 'schedule'}`
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
          options.externalDrag
            ? h(
                'div',
                {
                  draggable: true,
                  style: {
                    display: 'inline-flex',
                    padding: '6px 10px',
                    marginBottom: '10px',
                    borderRadius: 'var(--mantine-radius-sm)',
                    background: 'var(--mantine-color-lime-light)',
                    color: 'var(--mantine-color-lime-light-color)',
                    cursor: 'grab',
                  },
                  onDragstart: (event: DragEvent) => {
                    event.dataTransfer?.setData('text/plain', 'external-task')
                  },
                },
                'Drag this task onto a resource',
              )
            : null,
          status.value
            ? h('p', { style: { color: 'var(--mantine-primary-color-filled)' } }, status.value)
            : null,
          h(component, {
            date: date.value,
            events: events.value,
            ...(options.resources ? { resources: options.resources } : {}),
            ...(options.groups ? { groups: options.groups } : {}),
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
            onTimeSlotClick: createEvent,
            onDayClick: createEvent,
            onEventClick: (value: unknown) => console.log('event click', value),
            onSlotDragEnd: createEvent,
            onExternalEventDrop: dropExternal,
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
    externalDrag: true,
    codeProps: 'with-events-drag-and-drop',
    description: 'Events can be moved between slots; external items can use onExternalEventDrop.',
  },
  externalDragDrop: {
    externalDrag: true,
    description: 'Drag the external task onto a day or time slot.',
  },
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
    interactiveForm: true,
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
