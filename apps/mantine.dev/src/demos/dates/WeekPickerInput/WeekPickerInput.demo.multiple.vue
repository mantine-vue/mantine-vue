<script setup lang="ts">
import { ref } from 'vue'
import { WeekPickerInput } from '@mantine-vue/dates'

const value = ref<string[]>([])
</script>

<template>
  <WeekPickerInput v-model="value" type="multiple" label="Pick weeks" placeholder="Pick weeks" />
</template>
