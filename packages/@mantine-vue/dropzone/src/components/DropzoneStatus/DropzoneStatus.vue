<script setup lang="ts">
import { cloneVNode, isVNode, useAttrs, useSlots, type VNodeChild } from 'vue'
import { useDropzoneContext, type DropzoneContextValue } from '../../Dropzone.context'
import type { DropzoneStatusProps } from './DropzoneStatus.types'

defineOptions({ name: 'DropzoneStatus', inheritAttrs: false })
const props = defineProps<DropzoneStatusProps & { status: keyof DropzoneContextValue }>()
const slots = useSlots()
const attrs = useAttrs()
const ctx = useDropzoneContext()
const renderContent = () => {
  const slotChildren = slots.default?.()
  const children = props.children !== undefined ? props.children : slotChildren
  const child: VNodeChild =
    Array.isArray(children) && children.length === 1 ? children[0] : children
  return isVNode(child) && !Array.isArray(child) ? cloneVNode(child, attrs) : child
}
</script>

<template>
  <component v-if="ctx[props.status] && isVNode(renderContent())" :is="renderContent" />
  <span v-else-if="ctx[props.status]" v-bind="attrs"><component :is="renderContent" /></span>
</template>
