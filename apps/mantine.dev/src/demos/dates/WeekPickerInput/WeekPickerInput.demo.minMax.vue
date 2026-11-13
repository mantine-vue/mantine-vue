<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPickerInput } from '@mantine-vue/dates'

const minDate = dayjs().subtract(2, 'week').format('YYYY-MM-DD')
const maxDate = dayjs().add(1, 'month').format('YYYY-MM-DD')
</script>

<template>
  <WeekPickerInput
    label="Pick week"
    placeholder="Pick week"
    :min-date="minDate"
    :max-date="maxDate"
  />
</template>
