<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

const value = ref<[string | null, string | null]>([null, null])

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
  <WeekPicker v-model="value" type="range" :presets="presets" />
</template>
