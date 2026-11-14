<script setup lang="ts">
import { Diff } from '@mantine-vue/code-highlight'

const previousCode = `export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}`

const currentCode = `export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => (count.value += 1)
  const reset = () => (count.value = initialValue)
  return { count, increment, reset }
}`
</script>

<template>
  <Diff :previous-value="previousCode" :current-value="currentCode" mode="split" />
</template>
