<script setup lang="ts">
import { ref } from 'vue'
import { WeekPickerInput } from '@mantine-vue/dates'

const value = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <WeekPickerInput
    v-model="value"
    type="range"
    label="Pick weeks range"
    placeholder="Pick weeks range"
  />
</template>
