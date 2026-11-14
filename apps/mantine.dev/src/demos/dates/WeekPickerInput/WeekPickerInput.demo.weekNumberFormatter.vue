<script setup lang="ts">
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { getWeekFormatter, WeekPickerInput, type DateFormatter } from '@mantine-vue/dates'

dayjs.extend(isoWeek)

const formatter: DateFormatter = (input) => {
  if (input.type === 'default' && typeof input.date === 'string') {
    return `Week ${dayjs(input.date).isoWeek()}: ${getWeekFormatter(1)(input)}`
  }

  return getWeekFormatter(1)(input)
}
</script>

<template>
  <WeekPickerInput :value-formatter="formatter" label="Pick week" placeholder="Pick week" />
</template>
