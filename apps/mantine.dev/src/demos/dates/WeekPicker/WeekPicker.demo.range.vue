<script setup lang="ts">
import { ref } from 'vue'
import { WeekPicker } from '@mantine-vue/dates'

const value = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <WeekPicker v-model="value" type="range" />
</template>
