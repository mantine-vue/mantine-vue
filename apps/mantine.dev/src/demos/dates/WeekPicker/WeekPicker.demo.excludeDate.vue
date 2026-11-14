<script setup lang="ts">
import dayjs from 'dayjs'
import { WeekPicker } from '@mantine-vue/dates'

const excludeDate = (date: string) => dayjs(date).day() === 0 || dayjs(date).day() === 6
</script>

<template>
  <WeekPicker :exclude-date="excludeDate" />
</template>
