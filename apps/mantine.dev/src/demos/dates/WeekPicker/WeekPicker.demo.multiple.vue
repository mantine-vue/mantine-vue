<script setup lang="ts">
import { ref } from 'vue'
import { WeekPicker } from '@mantine-vue/dates'

const value = ref<string[]>([])
</script>

<template>
  <WeekPicker v-model="value" type="multiple" />
</template>
