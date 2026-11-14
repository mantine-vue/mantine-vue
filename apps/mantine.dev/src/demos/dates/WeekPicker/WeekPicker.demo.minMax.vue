<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

const minDate = dayjs().subtract(2, 'week').format('YYYY-MM-DD')
const maxDate = dayjs().add(1, 'month').format('YYYY-MM-DD')
const value = ref<string | null>(null)
</script>

<template>
  <WeekPicker v-model="value" :min-date="minDate" :max-date="maxDate" />
</template>
