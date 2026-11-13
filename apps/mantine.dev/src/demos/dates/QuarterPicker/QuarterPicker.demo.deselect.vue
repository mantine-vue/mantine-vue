<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPicker } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <QuarterPicker v-model="value" allow-deselect />
</template>
