<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { QuarterPicker } from '@mantine-vue/dates'

dayjs.extend(quarterOfYear)

const value = ref<[string | null, string | null]>([null, null])

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
  <QuarterPicker v-model="value" type="range" :presets="presets" />
</template>
