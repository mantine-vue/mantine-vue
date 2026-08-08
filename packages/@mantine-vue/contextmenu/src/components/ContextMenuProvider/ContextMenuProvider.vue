<script setup lang="ts">
import { computed, provide, shallowRef, toRef } from 'vue'
import { useDirection } from '@mantine-vue/core'
import ContextMenuPortal from '../ContextMenuPortal/ContextMenuPortal.vue'
import { ContextMenuKey, ContextMenuSettingsKey } from '../../context'
import type {
  ContextMenuInstanceOptions,
  ContextMenuOptions,
  ContextMenuProviderProps,
  ShowContextMenuFunction,
} from '../../types'

defineOptions({ name: 'ContextMenuProvider' })
const props = withDefaults(defineProps<ContextMenuProviderProps>(), {
  zIndex: 9999,
  shadow: 'sm',
  borderRadius: 'xs',
  submenuDelay: 500,
  repositionOnRepeat: false,
})
const data = shallowRef<(ContextMenuInstanceOptions & ContextMenuOptions) | null>(null)
const { dir } = useDirection()

function hideContextMenu() {
  data.value = null
}

const showContextMenu: ShowContextMenuFunction = (content, options) => (event) => {
  event.preventDefault()
  event.stopPropagation()
  const position =
    'touches' in event
      ? { x: event.touches.item(0)!.clientX, y: event.touches.item(0)!.clientY }
      : { x: event.clientX, y: event.clientY }
  data.value = {
    ...position,
    content,
    zIndex: options?.zIndex || props.zIndex,
    className: options?.className,
    style: options?.style,
    classNames: options?.classNames,
    styles: options?.styles,
  }
}

provide(
  ContextMenuSettingsKey,
  computed(() => ({
    shadow: props.shadow,
    borderRadius: props.borderRadius,
    submenuDelay: props.submenuDelay,
    repositionOnRepeat: props.repositionOnRepeat,
  })),
)
provide(ContextMenuKey, {
  showContextMenu,
  hideContextMenu,
  isContextMenuVisible: toRef(() => Boolean(data.value)),
})
</script>

<template>
  <slot />
  <ContextMenuPortal v-if="data" v-bind="data" :dir="dir" @hide="hideContextMenu" />
</template>
