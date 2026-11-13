<script setup lang="ts">
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { QuarterPickerInput } from '@mantine-vue/dates'

dayjs.extend(quarterOfYear)

const presets = [
  { value: dayjs().startOf('quarter').format('YYYY-MM-DD'), label: 'This quarter' },
  {
    value: dayjs().add(1, 'quarter').startOf('quarter').format('YYYY-MM-DD'),
    label: 'Next quarter',
  },
  {
    value: dayjs().subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD'),
    label: 'Last quarter',
  },
  { value: dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DD'), label: 'Q1 next year' },
]
</script>

<template>
  <QuarterPickerInput label="Pick quarter" placeholder="Pick quarter" :presets="presets" />
</template>
