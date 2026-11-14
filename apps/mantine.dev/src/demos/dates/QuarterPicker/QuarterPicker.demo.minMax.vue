<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPicker } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <QuarterPicker
    v-model="value"
    default-date="2026-01-01"
    min-date="2026-04-01"
    max-date="2027-07-01"
  />
</template>
