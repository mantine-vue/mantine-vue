<script setup lang="ts">
import { QuarterPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <QuarterPickerInput
    label="Pick quarter"
    placeholder="Pick quarter"
    default-date="2026-01-01"
    min-date="2026-04-01"
    max-date="2027-07-01"
  />
</template>
