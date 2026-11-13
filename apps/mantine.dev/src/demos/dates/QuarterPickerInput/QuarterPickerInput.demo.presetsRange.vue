<script setup lang="ts">
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { QuarterPickerInput } from '@mantine-vue/dates'

dayjs.extend(quarterOfYear)

const presets = [
  {
    value: [
      dayjs().startOf('year').format('YYYY-MM-DD'),
      dayjs().startOf('quarter').format('YYYY-MM-DD'),
    ],
    label: 'Year to date',
  },
  {
    value: [
      dayjs().startOf('year').format('YYYY-MM-DD'),
      dayjs().startOf('year').add(9, 'month').format('YYYY-MM-DD'),
    ],
    label: 'This year',
  },
  {
    value: [
      dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
      dayjs().subtract(1, 'year').startOf('year').add(9, 'month').format('YYYY-MM-DD'),
    ],
    label: 'Last year',
  },
  {
    value: [
      dayjs().startOf('quarter').format('YYYY-MM-DD'),
      dayjs().add(1, 'quarter').startOf('quarter').format('YYYY-MM-DD'),
    ],
    label: 'Next two quarters',
  },
]
</script>

<template>
  <QuarterPickerInput
    type="range"
    label="Pick quarters range"
    placeholder="Pick quarters range"
    :presets="presets"
  />
</template>
