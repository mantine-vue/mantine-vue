<script setup lang="ts">
// Lightweight wordmark used in the docs header.
</script>

<template>
  <RouterLink to="/getting-started" class="logo" aria-label="Mantine Vue">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="url(#mvg)" />
      <path
        d="M7 16V8l5 5 5-5v8"
        stroke="white"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient id="mvg" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stop-color="#4dabf7" />
          <stop offset="100%" stop-color="#1971c2" />
        </linearGradient>
      </defs>
    </svg>
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
