<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPickerInput } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <QuarterPickerInput v-model="value" label="Pick quarter" placeholder="Pick quarter" />
</template>
