<script setup lang="ts">
import { Text } from '@mantine-vue/core'

defineProps<{ label: string }>()
</script>

<template>
  <div class="item">
    <Text class="label" fz="sm">{{ label }}</Text>
    <slot />
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  min-height: 20px;
  overflow-x: hidden;
}

.item + .item {
  margin-top: var(--mantine-spacing-xs);
}

.label {
  width: 100px;
  min-width: 100px;
  height: 20px;
  line-height: 20px;
  color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2));

  @mixin smaller-than 31em {
    display: none;
  }
}
</style>
