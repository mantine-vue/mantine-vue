<script setup lang="ts">
import { Portal } from '@mantine-vue/core'
import { useHotkeys, useWindowEvent } from '@mantine-vue/hooks'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import ContextMenuOverlay from '../ContextMenuOverlay/ContextMenuOverlay.vue'
import type { ContextMenuPortalEmits, ContextMenuPortalProps } from '../../types'

defineOptions({ name: 'ContextMenuPortal' })
const props = defineProps<ContextMenuPortalProps>()
const emit = defineEmits<ContextMenuPortalEmits>()
const hide = () => emit('hide')
useWindowEvent('resize', hide)
useWindowEvent('scroll', hide)
useHotkeys([['Escape', hide]])
</script>

<template>
  <Portal>
    <ContextMenuOverlay :z-index="props.zIndex" @hide="hide">
      <ContextMenu
        :x="props.x"
        :y="props.y"
        :content="props.content"
        :dir="props.dir"
        :z-index="props.zIndex"
        :class-name="props.className"
        :style="props.style"
        :class-names="props.classNames"
        :styles="props.styles"
        @hide="hide"
      />
    </ContextMenuOverlay>
  </Portal>
</template>
