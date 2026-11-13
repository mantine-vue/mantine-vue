<script setup lang="ts">
import { ref } from 'vue'
import { WeekPicker } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <WeekPicker v-model="value" allow-deselect />
</template>
