<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPickerInput } from '@mantine-vue/dates'

const value = ref<string[]>([])
</script>

<template>
  <QuarterPickerInput
    v-model="value"
    type="multiple"
    label="Pick quarters"
    placeholder="Pick quarters"
  />
</template>
