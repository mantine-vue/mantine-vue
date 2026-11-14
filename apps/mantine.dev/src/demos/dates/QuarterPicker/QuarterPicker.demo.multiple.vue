<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPicker } from '@mantine-vue/dates'

const value = ref<string[]>([])
</script>

<template>
  <QuarterPicker v-model="value" type="multiple" />
</template>
