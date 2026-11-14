<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { MaskedDateInput } from '@mantine-vue/dates'

const value = ref<string | null>('2000-06-15')
</script>

<template>
  <div>
    <MaskedDateInput v-model="value" label="Date of birth" />
    <Text mt="md" size="sm">Value: {{ value === null ? 'null' : value }}</Text>
  </div>
</template>
