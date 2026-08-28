<template>
  <span class="logo" role="img" aria-label="Mantine Vue">
    <svg class="mark" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="34" height="34" rx="10" fill="currentColor" />
      <path
        d="M9.75 24.25V12.25L18 19.8L26.25 12.25V24.25"
        fill="none"
        stroke="white"
        stroke-width="3.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <span class="wordmark">
      <span>mantine</span><span class="joiner">-</span><span class="accent">vue</span>
    </span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: max-content;
  text-decoration: none;
  color: var(--mantine-color-text);
}

.mark {
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  color: var(--mantine-primary-color-filled);
  filter: drop-shadow(0 5px 10px alpha(var(--mantine-primary-color-filled), 0.2));
}

.wordmark {
  display: inline-flex;
  align-items: baseline;
  font-size: 19px;
  font-weight: 780;
  line-height: 1;
  letter-spacing: -0.055em;
}

.joiner {
  margin-inline: 1px;
  color: var(--mantine-color-dimmed);
  font-weight: 550;
}

.accent {
  color: var(--mantine-primary-color-filled);
}
</style>
