<script setup lang="ts">
import type { VNodeChild } from 'vue'
defineOptions({ name: 'FileIcon', inheritAttrs: false })
const props = defineProps<{
  fileName?: string
  getFileIcon?: (fileName: string) => VNodeChild
  fileIcon?: VNodeChild
}>()
const slots = defineSlots<{
  fileIcon?: () => VNodeChild
  getFileIcon?: (input: { fileName: string }) => VNodeChild
}>()
const renderIcon = () => {
  if (props.fileIcon) return props.fileIcon
  if (props.getFileIcon && props.fileName) return props.getFileIcon(props.fileName)
  if (slots.fileIcon) return slots.fileIcon()
  if (slots.getFileIcon && props.fileName) return slots.getFileIcon({ fileName: props.fileName })
  return null
}
</script>

<template>
  <span v-if="renderIcon()" v-bind="$attrs"><component :is="renderIcon" /></span>
</template>
