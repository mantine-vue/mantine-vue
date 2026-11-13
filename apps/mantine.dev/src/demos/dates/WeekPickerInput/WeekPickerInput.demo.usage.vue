<script setup lang="ts">
import { ref } from 'vue'
import { WeekPickerInput } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <WeekPickerInput v-model="value" label="Pick week" placeholder="Pick week" />
</template>
