<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPickerInput } from '@mantine-vue/dates'

const value = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <QuarterPickerInput
    v-model="value"
    type="range"
    label="Pick quarters range"
    placeholder="Pick quarters range"
  />
</template>
