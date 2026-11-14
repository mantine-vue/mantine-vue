<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { getEndOfWeek, getStartOfWeek, WeekPicker } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <div>
    <WeekPicker v-model="value" />
    <Text mt="md" size="sm">Value: {{ value || '–' }}</Text>
    <Text size="sm">
      Week: {{ value ? `${getStartOfWeek(value)} – ${getEndOfWeek(value)}` : '–' }}
    </Text>
  </div>
</template>
