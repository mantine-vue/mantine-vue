<script setup lang="ts">
import dayjs from 'dayjs'
import { QuarterPicker } from '@mantine-vue/dates'

const decadeLabelFormat = (start: string, end: string) =>
  `${dayjs(start).format('YY')} – ${dayjs(end).format('YY')}`
</script>

<template>
  <QuarterPicker year-label-format="YYYY [year]" :decade-label-format="decadeLabelFormat" />
</template>
