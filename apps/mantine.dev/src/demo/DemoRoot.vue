<script setup lang="ts">
// Bordered container that wraps a demo preview + its code.
</script>

<template>
  <div class="root">
    <slot />
  </div>
</template>

<style scoped>
.root {
  border: 1px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-md);
  overflow: hidden;
  margin: 16px 0 24px;
}
</style>
