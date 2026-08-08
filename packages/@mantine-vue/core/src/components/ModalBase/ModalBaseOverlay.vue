<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Overlay } from '../Overlay'
import { Transition as MantineTransition } from '../Transition'
import { useModalBaseContext } from './ModalBase.context'
import { useModalTransition } from './use-modal-transition'
import type { ModalBaseOverlayOwnProps } from './ModalBaseOverlay.types'

defineOptions({ name: 'ModalBaseOverlay', inheritAttrs: false })

const props = withDefaults(defineProps<ModalBaseOverlayOwnProps>(), {
  visible: undefined,
  transitionProps: undefined,
})
const attrs = useAttrs()
const ctx = useModalBaseContext()
const transition = useModalTransition(props.transitionProps)
const overlayAttrs = computed(() => {
  const forwarded = { ...attrs }
  delete forwarded.onClick
  delete forwarded.style
  return forwarded
})

function handleClick(event: MouseEvent) {
  ;(attrs.onClick as any)?.(event)
  if (ctx.closeOnClickOutside) {
    ctx.onClose()
  }
}
</script>

<template>
  <MantineTransition :mounted="props.visible ?? ctx.opened" v-bind="transition" transition="fade">
    <template #default="transitionStyles">
      <Overlay
        v-bind="overlayAttrs"
        fixed
        :style="[attrs.style as any, transitionStyles]"
        :z-index="ctx.zIndex"
        :unstyled="ctx.unstyled"
        @click="handleClick"
      />
    </template>
  </MantineTransition>
</template>
