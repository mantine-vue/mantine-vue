<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, UnstyledButton, useDirection } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
defineOptions({ name: 'LightboxNavigation', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useLightboxContext()
const { dir } = useDirection()
const canPrev = computed(() => (ctx.loop ? ctx.slides.length > 1 : ctx.currentIndex > 0))
const canNext = computed(() =>
  ctx.loop ? ctx.slides.length > 1 : ctx.currentIndex < ctx.slides.length - 1,
)
</script>
<template>
  <Box v-bind="{ ...attrs, ...ctx.getStyles('navigation') }"
    ><UnstyledButton
      v-bind="ctx.getStyles('navigationButton')"
      :data-inactive="!canPrev || undefined"
      :aria-disabled="!canPrev || undefined"
      :aria-label="ctx.labels.previousSlideLabel"
      :tabindex="canPrev ? 0 : -1"
      @click="ctx.prev"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline
          :points="dir === 'rtl' ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"
        /></svg></UnstyledButton
    ><UnstyledButton
      v-bind="ctx.getStyles('navigationButton')"
      :data-inactive="!canNext || undefined"
      :aria-disabled="!canNext || undefined"
      :aria-label="ctx.labels.nextSlideLabel"
      :tabindex="canNext ? 0 : -1"
      @click="ctx.next"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline
          :points="dir === 'rtl' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'"
        /></svg></UnstyledButton
  ></Box>
</template>
