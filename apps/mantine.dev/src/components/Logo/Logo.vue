<script setup lang="ts">
// Lightweight wordmark used in the docs header.
</script>

<template>
  <RouterLink to="/getting-started" class="logo" aria-label="Mantine Vue">
    <span class="word">mantine<span class="accent">-vue</span></span>
  </RouterLink>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  color: var(--mantine-color-text);
}
.accent {
  color: var(--mantine-color-blue-filled);
}
</style>
