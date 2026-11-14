<script setup lang="ts">
import dayjs from 'dayjs'
import { QuarterPicker } from '@mantine-vue/dates'

function getYearControlProps(date: string) {
  if (dayjs(date).year() === new Date().getFullYear()) {
    return { style: { color: 'var(--mantine-color-blue-filled)', fontWeight: 700 } }
  }
  if (dayjs(date).year() === new Date().getFullYear() + 1) {
    return { disabled: true }
  }
  return {}
}

function getQuarterControlProps(date: string) {
  if (dayjs(date).month() === 3) {
    return { style: { color: 'var(--mantine-color-blue-filled)', fontWeight: 700 } }
  }
  if (dayjs(date).month() === 9) {
    return { disabled: true }
  }
  return {}
}
</script>

<template>
  <QuarterPicker
    :get-year-control-props="getYearControlProps"
    :get-quarter-control-props="getQuarterControlProps"
  />
</template>
