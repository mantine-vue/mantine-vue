<script setup lang="ts">
import { ref } from 'vue'
import { QuarterPicker } from '@mantine-vue/dates'

const value = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <QuarterPicker v-model="value" type="range" :number-of-columns="2" />
</template>
