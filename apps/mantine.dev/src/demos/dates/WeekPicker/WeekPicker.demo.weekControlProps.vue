<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

const getWeekControlProps = (weekStart: string) => ({
  'aria-label': `Select week starting on ${dayjs(weekStart).format('D MMMM')}`,
  disabled: dayjs(weekStart).day(5).isBefore(dayjs(), 'day'),
})
</script>

<template>
  <WeekPicker :get-week-control-props="getWeekControlProps" />
</template>
