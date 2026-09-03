<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, UnstyledButton } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
import type { ToolbarItem, ToolbarItems } from '../types'
import {
  createCloseToolbarItem,
  createDownloadToolbarItem,
  createFullscreenToolbarItem,
  createThumbnailsToolbarItem,
} from './toolbar-items'
defineOptions({ name: 'LightboxToolbar', inheritAttrs: false })
const props = defineProps<{ toolbarItems?: ToolbarItems }>()
const attrs = useAttrs()
const ctx = useLightboxContext()
const payload = computed(() => ({
  slides: ctx.slides,
  currentIndex: ctx.currentIndex,
  setIndex: ctx.setIndex,
  next: ctx.next,
  prev: ctx.prev,
  close: ctx.close,
  thumbnailsVisible: ctx.thumbnailsVisible,
  toggleThumbnails: ctx.toggleThumbnails,
  isFullscreen: ctx.isFullscreen,
  toggleFullscreen: ctx.toggleFullscreen,
  zoomed: ctx.zoomed,
  toggleZoom: ctx.toggleZoom,
  labels: ctx.labels,
}))
const items = computed<ToolbarItem[]>(() => {
  if (typeof props.toolbarItems === 'function') return props.toolbarItems(payload.value)
  if (props.toolbarItems) return props.toolbarItems
  const result: ToolbarItem[] = []
  if (ctx.withThumbnails)
    result.push(
      createThumbnailsToolbarItem(ctx.toggleThumbnails, ctx.thumbnailsVisible, ctx.labels),
    )
  if (ctx.withFullscreen)
    result.push(createFullscreenToolbarItem(ctx.toggleFullscreen, ctx.isFullscreen, ctx.labels))
  const slide = ctx.slides[ctx.currentIndex]
  if (ctx.withDownload && slide && slide.type !== 'custom')
    result.push(createDownloadToolbarItem(slide.src, ctx.labels))
  result.push(createCloseToolbarItem(ctx.close, ctx.labels))
  return result
})
const left = computed(() => items.value.filter((item) => item.position === 'left'))
const right = computed(() => items.value.filter((item) => item.position !== 'left'))
</script>
<template>
  <Box v-bind="{ ...attrs, ...ctx.getStyles('toolbar') }"
    ><div v-bind="ctx.getStyles('toolbarGroup')">
      <UnstyledButton
        v-for="item in left"
        :key="item.key"
        v-bind="ctx.getStyles('toolbarButton')"
        :aria-label="item.label"
        @click="item.onClick"
        ><component :is="() => item.icon"
      /></UnstyledButton>
    </div>
    <span v-bind="ctx.getStyles('counter')" aria-hidden="true">{{
      ctx.slides.length ? `${ctx.currentIndex + 1} / ${ctx.slides.length}` : ''
    }}</span>
    <div v-bind="ctx.getStyles('toolbarGroup')">
      <UnstyledButton
        v-for="item in right"
        :key="item.key"
        v-bind="ctx.getStyles('toolbarButton')"
        :aria-label="item.label"
        @click="item.onClick"
        ><component :is="() => item.icon"
      /></UnstyledButton></div
  ></Box>
</template>
