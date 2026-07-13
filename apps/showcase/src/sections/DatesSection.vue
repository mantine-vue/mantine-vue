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

// Mantine dates components are controlled via `:value` + `@change`
// (they use useUncontrolled internally), not v-model.
const date = ref<string | null>('2026-07-13')
const dateRange = ref<[string | null, string | null]>(['2026-07-10', '2026-07-16'])
const inlineDate = ref<string | null>('2026-07-13')
const dateTime = ref<string | null>('2026-07-13 09:30')
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
        :value="date"
        label="Event date"
        placeholder="Pick a date"
        valueFormat="DD MMM YYYY"
        clearable
        style="max-width: 340px"
        @change="date = $event"
      />
    </DemoCard>

    <DemoCard
      name="DatePickerInput"
      description="Input that opens a calendar; supports ranges."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <DatePickerInput
          :value="date"
          label="Single date"
          placeholder="Pick date"
          clearable
          @change="date = $event"
        />
        <DatePickerInput
          :value="dateRange"
          type="range"
          label="Date range"
          placeholder="Pick date range"
          clearable
          @change="dateRange = $event"
        />
      </Stack>
    </DemoCard>

    <DemoCard name="DatePicker" description="Inline calendar for selecting dates." pkg="dates">
      <DatePicker :value="inlineDate" @change="inlineDate = $event" />
    </DemoCard>

    <DemoCard name="DateTimePicker" description="Pick a date together with a time." pkg="dates">
      <DateTimePicker
        :value="dateTime"
        label="Appointment"
        placeholder="Pick date and time"
        valueFormat="DD MMM YYYY hh:mm A"
        clearable
        style="max-width: 340px"
        @change="dateTime = $event"
      />
    </DemoCard>

    <DemoCard
      name="MonthPickerInput & YearPickerInput"
      description="Select a month or a year."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <MonthPickerInput
          :value="month"
          label="Billing month"
          placeholder="Pick month"
          clearable
          @change="month = $event"
        />
        <YearPickerInput
          :value="year"
          label="Fiscal year"
          placeholder="Pick year"
          clearable
          @change="year = $event"
        />
      </Stack>
    </DemoCard>

    <DemoCard
      name="TimeInput & TimePicker"
      description="Enter a time by typing or with a dropdown."
      pkg="dates"
    >
      <Stack gap="sm" style="max-width: 340px">
        <TimeInput
          :value="time"
          label="Start time"
          @change="time = ($event.currentTarget as HTMLInputElement).value"
        />
        <TimePicker
          :value="preciseTime"
          label="Precise time"
          withDropdown
          :withSeconds="true"
          @change="preciseTime = $event"
        />
      </Stack>
    </DemoCard>

    <DemoCard name="MiniCalendar" description="Compact horizontal date strip." pkg="dates">
      <Stack gap="xs">
        <MiniCalendar :value="miniDate" :numberOfDays="7" @change="miniDate = $event" />
        <Text size="sm" c="dimmed">Selected: {{ miniDate ?? 'none' }}</Text>
      </Stack>
    </DemoCard>
  </Stack>
</template>
