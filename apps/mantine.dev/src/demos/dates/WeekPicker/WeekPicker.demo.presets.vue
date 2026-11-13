<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

const presets = [
  { value: dayjs().format('YYYY-MM-DD'), label: 'This week' },
  { value: dayjs().add(1, 'week').format('YYYY-MM-DD'), label: 'Next week' },
  { value: dayjs().subtract(1, 'week').format('YYYY-MM-DD'), label: 'Last week' },
  { value: dayjs().add(4, 'week').format('YYYY-MM-DD'), label: 'In a month' },
]
</script>

<template>
  <WeekPicker :presets="presets" />
</template>
