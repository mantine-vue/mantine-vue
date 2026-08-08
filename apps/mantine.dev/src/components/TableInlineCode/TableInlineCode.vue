<script setup lang="ts">
import { Text } from '@mantine-vue/core'
</script>

<template>
  <Text component="span" class="code"><slot /></Text>
</template>

<style scoped>
.code {
  font-family: var(--mantine-font-family-monospace);
  font-size: var(--mantine-font-size-xs);
  color: light-dark(var(--mantine-color-blue-8), var(--mantine-color-orange-7));
}
</style>
