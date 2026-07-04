<script setup lang="ts">
defineProps<{ centered?: boolean; minHeight?: number | string }>()
</script>

<template>
  <div class="columns">
    <div class="preview" :class="{ centered }">
      <slot name="preview" />
    </div>
    <div class="controls">
      <slot name="controls" />
    </div>
  </div>
</template>

<style scoped>
.columns {
  display: flex;
  align-items: stretch;
}
.preview {
  flex: 1;
  min-width: 0;
  padding: 32px;
}
.preview.centered {
  align-items: center;
  justify-content: center;
  min-height: 240px;
}
.controls {
  width: 280px;
  flex-shrink: 0;
  border-left: 1px solid var(--mantine-color-default-border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--mantine-color-default-hover);
}
@media (max-width: 720px) {
  .columns {
    flex-direction: column;
  }
  .controls {
    width: auto;
    border-left: 0;
    border-top: 1px solid var(--mantine-color-default-border);
  }
}
</style>
