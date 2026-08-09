<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, getDefaultZIndex, getShadow, getSpacing } from '../../core'
import { OptionalPortal } from '../Portal'
import { provideModalBaseContext } from './ModalBase.context'
import { useLockScroll } from './use-lock-scroll'
import { useModal } from './use-modal'
import type { ModalBaseOwnProps, ModalBaseSlots } from './ModalBase.types'

defineOptions({
  name: 'ModalBase',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ModalBaseOwnProps>(), {
  id: undefined,
  keepMounted: false,
  lockScroll: true,
  trapFocus: true,
  withinPortal: true,
  portalProps: undefined,
  closeOnClickOutside: true,
  transitionProps: undefined,
  onExitTransitionEnd: undefined,
  onEnterTransitionEnd: undefined,
  closeOnEscape: true,
  returnFocus: true,
  zIndex: undefined,
  shadow: 'xl',
  padding: 'md',
  unstyled: false,
})

defineSlots<ModalBaseSlots>()

const emit = defineEmits<{
  close: []
}>()

const attrs = useAttrs()

const fallbackId = useId(props.id)

const modal = useModal({
  id: props.id,
  opened: () => props.opened,
  onClose: () => emit('close'),
  trapFocus: () => props.trapFocus,
  closeOnEscape: () => props.closeOnEscape,
  returnFocus: () => props.returnFocus,
})

useLockScroll(computed(() => props.opened && props.lockScroll))

provideModalBaseContext({
  get unstyled() {
    return props.unstyled
  },
  get titleMounted() {
    return modal.titleMounted.value
  },
  get bodyMounted() {
    return modal.bodyMounted.value
  },
  setTitleMounted: (value) => {
    modal.titleMounted.value = value
  },
  setBodyMounted: (value) => {
    modal.bodyMounted.value = value
  },
  getTitleId: () => `${modal.id.value || fallbackId.value}-title`,
  getBodyId: () => `${modal.id.value || fallbackId.value}-body`,
  get transitionProps() {
    return { ...props.transitionProps, keepMounted: props.keepMounted }
  },
  get onExitTransitionEnd() {
    return props.onExitTransitionEnd
  },
  get onEnterTransitionEnd() {
    return props.onEnterTransitionEnd
  },
  get zIndex() {
    return props.zIndex
  },
  get opened() {
    return props.opened
  },
  onClose: () => emit('close'),
  get closeOnEscape() {
    return props.closeOnEscape
  },
  get trapFocus() {
    return props.trapFocus
  },
  get closeOnClickOutside() {
    return props.closeOnClickOutside
  },
})

const rootId = computed(() => modal.id.value || fallbackId.value)

/**
 * The overlay and the content read these variables instead of receiving the values as
 * props, so they have to live on the shared root.
 */
const rootStyle = computed(() => [
  {
    '--mb-z-index': String(props.zIndex ?? getDefaultZIndex('modal')),
    '--mb-shadow': getShadow(props.shadow),
    '--mb-padding': getSpacing(props.padding),
  },
  attrs.style,
])
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box v-bind="attrs" :id="rootId" :style="rootStyle">
      <slot />
    </Box>
  </OptionalPortal>
</template>
