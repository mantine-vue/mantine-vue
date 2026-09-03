<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
defineOptions({ name: 'LightboxCaption', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useLightboxContext()
const caption = computed(() => ctx.slides[ctx.currentIndex]?.caption)
</script>
<template>
  <Box v-if="caption" v-bind="{ ...attrs, ...ctx.getStyles('caption') }"
    ><component :is="() => caption"
  /></Box>
</template>
