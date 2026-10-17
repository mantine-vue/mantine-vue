<script setup lang="ts">
import type { LayoutPreset } from '../../theme/presets'

/** Tiny schematic of a layout preset, drawn with CSS only. */
defineProps<{ layout: LayoutPreset }>()
</script>

<template>
  <div :class="$style.preview" :data-card="layout.card" aria-hidden="true">
    <template v-if="layout.card === 'card'">
      <div v-for="index in 4" :key="index" :class="$style.tile">
        <span :class="$style.img" /><span :class="$style.line" />
      </div>
    </template>
    <template v-else-if="layout.card === 'feature'">
      <div :class="$style.feature">
        <span :class="$style.img" /><span :class="[$style.line, $style.center]" />
      </div>
    </template>
    <template v-else>
      <div v-for="index in layout.card === 'dense' ? 5 : 3" :key="index" :class="$style.row">
        <span v-if="layout.card === 'dense'" :class="$style.dot" />
        <span :class="$style.line" />
        <span v-if="layout.card === 'row'" :class="$style.thumb" />
      </div>
    </template>
  </div>
</template>

<style module>
.preview {
  display: grid;
  gap: 4px;
  width: 100%;
  height: 64px;
  padding: 6px;
  border-radius: var(--mantine-radius-sm);
  background-color: var(--mantine-color-default-hover);
  overflow: hidden;

  &[data-card='card'] {
    grid-template-columns: 1fr 1fr;
  }
}

.tile,
.feature {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.img {
  flex: 1;
  border-radius: 3px;
  background-color: var(--mantine-primary-color-light);
}

.line {
  height: 4px;
  width: 70%;
  border-radius: 2px;
  background-color: var(--mantine-color-dimmed);
  opacity: 0.6;
}

.center {
  align-self: center;
}

.row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.row .line {
  flex: 1;
}

.thumb {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background-color: var(--mantine-primary-color-light);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: var(--mantine-primary-color-light);
}
</style>
