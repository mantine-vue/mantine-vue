<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ActionIcon, Avatar, AvatarGroup, Group, Paper, Text } from '@mantine-vue/core'
import { DatePicker } from '@mantine-vue/dates'

import {
  Schedule,
  type EventDropData,
  type ScheduleEventData,
  type ScheduleViewLevel,
  type TimeSlotClickData,
} from '@mantine-vue/schedule'
import { PhPlus, PhVideoCamera } from '@phosphor-icons/vue'

const selectedDate = ref('2026-08-28')
const calendarDate = ref('2026-08-01')
const scheduleView = ref<ScheduleViewLevel>('week')
const selectedEvent = ref<ScheduleEventData | null>(null)

const events = ref<ScheduleEventData[]>([
  {
    id: 'design-sync',
    title: 'Design sync',
    start: '2026-08-24 09:00:00',
    end: '2026-08-24 10:00:00',
    color: 'blue',
  },
  {
    id: 'roadmap-review',
    title: 'Roadmap review',
    start: '2026-08-25 11:00:00',
    end: '2026-08-25 12:30:00',
    color: 'violet',
  },
  {
    id: 'customer-call',
    title: 'Customer call',
    start: '2026-08-26 09:30:00',
    end: '2026-08-26 10:30:00',
    color: 'teal',
  },
  {
    id: 'prototype-lab',
    title: 'Prototype lab',
    start: '2026-08-27 13:00:00',
    end: '2026-08-27 14:30:00',
    color: 'orange',
  },
  {
    id: 'release-planning',
    title: 'Release planning',
    start: '2026-08-28 10:30:00',
    end: '2026-08-28 12:00:00',
    color: 'grape',
  },
])

const selectedDateLabel = computed(() => {
  const [year, month, day] = selectedDate.value.split(' ')[0].split('-').map(Number)

  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

const highlightedMeeting = computed(
  () => selectedEvent.value ?? events.value.find((event) => event.id === 'release-planning')!,
)

watch(selectedDate, (date) => {
  calendarDate.value = `${date.slice(0, 8)}01`
})

function selectDate(date: string) {
  selectedDate.value = date
}

function updateEvent(data: EventDropData) {
  events.value = events.value.map((event) =>
    event.id === data.eventId ? { ...event, start: data.newStart, end: data.newEnd } : event,
  )
}

function createEvent(start: string, end: string) {
  const event: ScheduleEventData = {
    id: `focus-${Date.now()}`,
    title: 'Focus session',
    start,
    end,
    color: 'cyan',
  }

  events.value = [...events.value, event]
  selectedEvent.value = event
  selectedDate.value = start.slice(0, 10)
}

function handleTimeSlotClick(data: TimeSlotClickData) {
  createEvent(data.slotStart, data.slotEnd)
}

function handleEventClick(event: ScheduleEventData) {
  selectedEvent.value = event
  selectedDate.value = String(event.start).slice(0, 10)
}
</script>

<template>
  <Paper class="scheduleShell" radius="lg">
    <aside class="calendarSidebar">
      <Group justify="space-between" mb="lg">
        <div>
          <Text fw="700">Schedule</Text>
          <Text c="dimmed" size="xs">{{ selectedDateLabel }}</Text>
        </div>
        <ActionIcon variant="light" radius="md" aria-label="Add event">
          <PhPlus :size="16" />
        </ActionIcon>
      </Group>

      <!-- <Calendar
        v-model:date="calendarDate"
        :get-day-props="
          (date: string) => ({
            selected: date === selectedDate,
            onClick: () => selectDate(date),
          })
        "
        full-width
        highlight-today
      /> -->
      <DatePicker v-model="selectedDate" highlight-today />

      <div class="upNext">
        <Text size="xs" fw="700" tt="uppercase" c="dimmed" mb="sm">Selected event</Text>
        <div class="nextMeeting">
          <div class="meetingIcon"><PhVideoCamera :size="17" /></div>
          <div class="meetingCopy">
            <Text fw="650" size="sm">{{ highlightedMeeting.title }}</Text>
            <Text size="xs" c="dimmed">Click, drag, or resize events</Text>
          </div>
          <AvatarGroup class="meetingAvatars">
            <Avatar size="xs" radius="xl" color="blue">MC</Avatar>
            <Avatar size="xs" radius="xl" color="violet">NL</Avatar>
          </AvatarGroup>
        </div>
      </div>
    </aside>

    <div class="scheduleWorkspace">
      <Schedule
        v-model:date="selectedDate"
        v-model:view="scheduleView"
        :events="events"
        :day-view-props="{
          startTime: '08:00:00',
          withAllDaySlot: false,
          endTime: '18:00:00',
          intervalMinutes: 60,
          getCurrentTime: () => '2026-08-28 14:30:00',
          scrollAreaProps: { mah: 470 },
        }"
        :week-view-props="{
          startTime: '08:00:00',
          endTime: '18:00:00',
          intervalMinutes: 60,
          withAllDaySlot: false,

          withWeekendDays: false,
          getCurrentTime: () => '2026-08-28 14:30:00',
          scrollAreaProps: { mah: 470 },
        }"
        radius="md"
        with-events-drag-and-drop
        with-event-resize
        with-drag-slot-select
        @event-click="handleEventClick"
        @event-drop="updateEvent"
        @event-resize="updateEvent"
        @time-slot-click="handleTimeSlotClick"
        @slot-drag-end="createEvent"
        @day-click="selectDate"
      />
    </div>
  </Paper>
</template>

<style scoped>
.scheduleShell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  min-height: 570px;
  overflow: hidden;
  border: 1px solid var(--home-border);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 24px 70px alpha(var(--mantine-color-black), 0.08);
}

.calendarSidebar {
  padding: 24px;
  border-right: 1px solid var(--home-border);
}

.upNext {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--home-border);
}

.nextMeeting {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border: 1px solid var(--home-border);
  border-radius: var(--mantine-radius-md);
  background: var(--home-subtle);
}

.meetingIcon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: var(--mantine-radius-md);
  background: var(--mantine-primary-color-light);
  color: var(--mantine-primary-color-light-color);
}

.meetingCopy {
  min-width: 0;
}

.meetingAvatars {
  margin-left: auto;
}

.scheduleWorkspace {
  min-width: 0;
  padding: 18px;
  background: var(--home-subtle);
}

@media (max-width: 900px) {
  .scheduleShell {
    grid-template-columns: 1fr;
  }

  .calendarSidebar {
    border-right: 0;
    border-bottom: 1px solid var(--home-border);
  }
}

@media (max-width: 620px) {
  .calendarSidebar,
  .scheduleWorkspace {
    padding: 14px;
  }
}
</style>
