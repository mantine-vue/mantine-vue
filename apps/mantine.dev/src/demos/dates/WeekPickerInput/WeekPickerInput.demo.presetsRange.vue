<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPickerInput } from '@mantine-vue/dates'

const presets = [
  {
    value: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'week').format('YYYY-MM-DD')],
    label: 'This and next week',
  },
  {
    value: [dayjs().subtract(1, 'week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    label: 'Last and this week',
  },
  {
    value: [dayjs().format('YYYY-MM-DD'), dayjs().add(3, 'week').format('YYYY-MM-DD')],
    label: 'Next 4 weeks',
  },
]
</script>

<template>
  <WeekPickerInput
    type="range"
    label="Pick weeks range"
    placeholder="Pick weeks range"
    :presets="presets"
  />
</template>
