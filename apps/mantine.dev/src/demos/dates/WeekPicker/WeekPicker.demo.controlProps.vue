<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

function getDayProps(date: string) {
  if (dayjs(date).day() === 5) {
    return { style: { color: 'var(--mantine-color-blue-filled)', fontWeight: 700 } }
  }
  return {}
}

const getMonthControlProps = (date: string) => (dayjs(date).month() === 1 ? { disabled: true } : {})
const getYearControlProps = (date: string) =>
  dayjs(date).year() === 2028 ? { disabled: true } : {}
</script>

<template>
  <WeekPicker
    :get-day-props="getDayProps"
    :get-month-control-props="getMonthControlProps"
    :get-year-control-props="getYearControlProps"
  />
</template>
