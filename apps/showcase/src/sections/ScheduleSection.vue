<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { Badge, Code, Group, Stack, Text } from '@mantine-vue/core'
import {
  DayView,
  MonthView,
  Schedule,
  WeekView,
  YearView,
  type ScheduleEventData,
  type ScheduleViewLevel,
} from '@mantine-vue/schedule'
import DemoCard from '../components/DemoCard.vue'
import {
  cloneEvents,
  interactiveWeekEvents,
  monthEvents,
  recurringWeekEvents,
  SCHEDULE_DATE,
  scheduleNow,
  workWeekEvents,
  yearEvents,
  type EventMeta,
} from '../data/schedule-events'

type Meta = EventMeta

interface EventDropData {
  eventId: string | number
  newStart: string
  newEnd: string
  event: ScheduleEventData
}

const timeRange = { startTime: '08:00:00', endTime: '18:00:00', getCurrentTime: scheduleNow }

const businessHours: [string, string] = ['09:00:00', '17:00:00']

const unifiedDate = ref(SCHEDULE_DATE)
const unifiedView = ref<ScheduleViewLevel>('week')
const unifiedEvents = ref<ScheduleEventData[]>(cloneEvents(interactiveWeekEvents))
const lastAction = ref('Drag an event, drag its edge to resize, or drag across empty slots.')

const weekEvents = ref<ScheduleEventData[]>(cloneEvents(workWeekEvents))
const dayEvents = ref<ScheduleEventData[]>(cloneEvents(interactiveWeekEvents))
const dayDate = ref(SCHEDULE_DATE)
const monthDate = ref(SCHEDULE_DATE)
const monthEventsRef = ref<ScheduleEventData[]>(cloneEvents(monthEvents))
const customEvents = ref<ScheduleEventData[]>(cloneEvents(workWeekEvents))

let createdCount = 0

function moveEvent(events: Ref<ScheduleEventData[]>, verb: string) {
  return (data: EventDropData) => {
    events.value = events.value.map((event) =>
      event.id === data.eventId ? { ...event, start: data.newStart, end: data.newEnd } : event,
    )
    lastAction.value = `${verb} “${data.event.title}” → ${data.newStart} – ${data.newEnd}`
  }
}

function createOnDrag(events: Ref<ScheduleEventData[]>) {
  return (rangeStart: string, rangeEnd: string) => {
    createdCount += 1
    events.value = [
      ...events.value,
      {
        id: `new-${createdCount}`,
        title: 'New block',
        start: rangeStart,
        end: rangeEnd,
        color: 'blue',
      },
    ]
    lastAction.value = `Created a new block ${rangeStart} – ${rangeEnd}`
  }
}

const unifiedDrop = moveEvent(unifiedEvents, 'Moved')
const unifiedResize = moveEvent(unifiedEvents, 'Resized')
const unifiedCreate = createOnDrag(unifiedEvents)

const dayDrop = moveEvent(dayEvents, 'Moved')
const dayResize = moveEvent(dayEvents, 'Resized')

const frenchLabels = {
  today: "Aujourd'hui",
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  year: 'Année',
  allDay: 'Journée',
}
</script>

<template>
  <Stack gap="lg">
    <DemoCard
      name="Schedule"
      description="Unified calendar with Day / Week / Month / Year switching. Drag events to move them, drag an edge to resize, or drag across empty slots to create a new block."
      pkg="schedule"
    >
      <Stack gap="sm">
        <Schedule
          :date="unifiedDate"
          :view="unifiedView"
          :events="unifiedEvents"
          with-events-drag-and-drop
          with-event-resize
          with-drag-slot-select
          :day-view-props="timeRange"
          :week-view-props="timeRange"
          :month-view-props="{ withWeekNumbers: true }"
          :on-date-change="(value: string) => (unifiedDate = value)"
          :on-view-change="(value: ScheduleViewLevel) => (unifiedView = value)"
          :on-event-drop="unifiedDrop"
          :on-event-resize="unifiedResize"
          :on-slot-drag-end="unifiedCreate"
        />
        <Group gap="xs">
          <Badge variant="light" radius="sm">{{ unifiedView }} view</Badge>
          <Text size="sm" c="dimmed">{{ lastAction }}</Text>
        </Group>
      </Stack>
    </DemoCard>

    <DemoCard
      name="WeekView"
      description="A full working week with business-hour shading, a live current-time indicator, overlapping meetings, all-day items and a background focus block."
      pkg="schedule"
    >
      <WeekView
        :date="SCHEDULE_DATE"
        :events="weekEvents"
        :start-time="'07:00:00'"
        :end-time="'19:00:00'"
        :get-current-time="scheduleNow"
        highlight-business-hours
        :business-hours="businessHours"
        with-week-number
      />
    </DemoCard>

    <DemoCard
      name="DayView — drag & resize"
      description="A detailed daily agenda. Move events by dragging, change their duration by dragging the top or bottom edge."
      pkg="schedule"
    >
      <Stack gap="sm">
        <DayView
          :date="dayDate"
          :events="dayEvents"
          :start-time="'08:00:00'"
          :end-time="'18:00:00'"
          :interval-minutes="30"
          :get-current-time="scheduleNow"
          with-events-drag-and-drop
          with-event-resize
          :on-date-change="(value: string) => (dayDate = value)"
          :on-event-drop="dayDrop"
          :on-event-resize="dayResize"
        />
        <Text size="sm" c="dimmed">{{ lastAction }}</Text>
      </Stack>
    </DemoCard>

    <DemoCard
      name="MonthView"
      description="A month at a glance with week numbers, multi-day and all-day events, and a “+N more” overflow popover on busy days."
      pkg="schedule"
    >
      <MonthView
        :date="monthDate"
        :events="monthEventsRef"
        with-week-numbers
        :max-events-per-day="3"
        :on-date-change="(value: string) => (monthDate = value)"
      />
    </DemoCard>

    <DemoCard
      name="YearView"
      description="A twelve-month overview. Days with events show colored indicator dots; click a month to drill in."
      pkg="schedule"
    >
      <YearView :date="SCHEDULE_DATE" :events="yearEvents" />
    </DemoCard>

    <DemoCard
      name="Recurring events"
      description="Series defined with an rRULE are expanded automatically for the visible range — here a weekday stand-up and weekly team 1:1s."
      pkg="schedule"
    >
      <Stack gap="sm">
        <WeekView
          :date="SCHEDULE_DATE"
          :events="recurringWeekEvents"
          :start-time="'08:00:00'"
          :end-time="'18:00:00'"
          :get-current-time="scheduleNow"
        />
        <Code>{{ "recurrence: { rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' }" }}</Code>
      </Stack>
    </DemoCard>

    <DemoCard
      name="Custom event content (slot)"
      description="Use the #eventBody scoped slot to render your own event content from the event payload — here the title, attendee count and location."
      pkg="schedule"
    >
      <WeekView
        :date="SCHEDULE_DATE"
        :events="customEvents"
        :start-time="'08:00:00'"
        :end-time="'18:00:00'"
        :get-current-time="scheduleNow"
      >
        <template #eventBody="{ event }">
          <div style="display: flex; flex-direction: column; gap: 2px; line-height: 1.2">
            <strong>{{ event.title }}</strong>
            <span style="font-size: 11px; opacity: 0.85">
              <template v-if="(event.payload as unknown as Meta | undefined)?.attendees">
                👥 {{ (event.payload as unknown as Meta).attendees }}
              </template>
              <template v-if="(event.payload as unknown as Meta | undefined)?.location">
                · {{ (event.payload as unknown as Meta).location }}
              </template>
            </span>
          </div>
        </template>
      </WeekView>
    </DemoCard>

    <DemoCard
      name="Static & localized"
      description="Read-only mode (mode=static) disables all interactions, and labels can be fully localized — here in French."
      pkg="schedule"
    >
      <MonthView
        :date="SCHEDULE_DATE"
        :events="monthEvents"
        mode="static"
        :labels="frenchLabels"
        :max-events-per-day="2"
      />
    </DemoCard>

    <DemoCard
      name="Responsive layout"
      description="With layout=responsive the schedule automatically switches to a compact mobile month agenda on narrow containers. Resize the window to see it adapt."
      pkg="schedule"
    >
      <Schedule
        :date="SCHEDULE_DATE"
        :events="workWeekEvents"
        layout="responsive"
        default-view="week"
        :day-view-props="timeRange"
        :week-view-props="timeRange"
      />
    </DemoCard>
  </Stack>
</template>
