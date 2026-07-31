<script setup lang="ts">
import { ref } from 'vue'
import { Stack, Text } from '@mantine-vue/core'
import {
  DateInput,
  DatePicker,
  DatePickerInput,
  DateTimePicker,
  MiniCalendar,
  MonthPickerInput,
  TimeInput,
  TimePicker,
  YearPickerInput,
} from '@mantine-vue/dates'
import DemoCard from '../components/DemoCard.vue'

const date = ref<string | null>('2026-07-13')
const dateRange = ref<[string | null, string | null]>(['2026-07-10', '2026-07-16'])
const inlineDate = ref<string | null>('2026-07-13')
const dateTime = ref<Date | null>(new Date('2026-07-13T09:30:00'))
const month = ref<string | null>('2026-07-01')
const year = ref<string | null>('2026-01-01')
const time = ref('09:30')
const preciseTime = ref('09:30:00')
const miniDate = ref<string | null>('2026-07-13')
</script>

<template>
  <Stack gap="lg">
    <DemoCard
      name="DateInput"
      description="Free-typing date field with a calendar dropdown."
      pkg="dates"
    >
      <DateInput
        v-model="date"
        label="Event date"
        placeholder="Pick a date"
        valueFormat="DD MMM YYYY"
        clearable
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard
      name="DatePickerInput"
      description="Input that opens a calendar; supports ranges."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <DatePickerInput v-model="date" label="Single date" placeholder="Pick date" clearable />
        <DatePickerInput
          v-model="dateRange"
          type="range"
          label="Date range"
          placeholder="Pick date range"
          clearable
        />
      </Stack>
    </DemoCard>

    <DemoCard name="DatePicker" description="Inline calendar for selecting dates." pkg="dates">
      <DatePicker v-model="inlineDate" />
    </DemoCard>

    <DemoCard name="DateTimePicker" description="Pick a date together with a time." pkg="dates">
      <DateTimePicker
        v-model="dateTime"
        label="Appointment"
        placeholder="Pick date and time"
        valueFormat="DD MMM YYYY hh:mm A"
        clearable
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard
      name="MonthPickerInput & YearPickerInput"
      description="Select a month or a year."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <MonthPickerInput
          v-model="month"
          label="Billing month"
          placeholder="Pick month"
          clearable
        />
        <YearPickerInput v-model="year" label="Fiscal year" placeholder="Pick year" clearable />
      </Stack>
    </DemoCard>

    <DemoCard
      name="TimeInput & TimePicker"
      description="Enter a time by typing or with a dropdown."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <TimeInput v-model="time" label="Start time" />
        <TimePicker v-model="preciseTime" label="Precise time" withDropdown :withSeconds="true" />
      </Stack>
    </DemoCard>

    <DemoCard name="MiniCalendar" description="Compact horizontal date strip." pkg="dates">
      <Stack gap="xs">
        <MiniCalendar v-model="miniDate" :numberOfDays="7" />
        <Text size="sm" c="dimmed">Selected: {{ miniDate ?? 'none' }}</Text>
      </Stack>
    </DemoCard>
  </Stack>
</template>
