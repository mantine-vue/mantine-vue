<script setup lang="ts">
import { computed, useAttrs, useSlots, type VNodeChild } from 'vue'
import { hasNode, resolveNode } from '../../core'
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from './Modal.compound'
import ModalRoot from './ModalRoot.vue'
import type { ModalProps, ModalSlots } from './Modal.types'

defineOptions({
  name: 'Modal',
  inheritAttrs: false,
})

/**
 * `title` keeps `undefined` because `MantineNode` resolves to a runtime type array
 * containing `Boolean` – a cast to `false` would make `resolveNode` ignore the slot.
 * Everything else is forwarded to `Modal.Root` through the fallthrough attributes.
 */
const props = withDefaults(defineProps<ModalProps>(), {
  keepMounted: false,
  // Inherited from `ModalBaseOwnProps` and defaulting to `true` there. Vue casts an
  // undeclared-default boolean to `false`, which would then be forwarded and shadow the
  // real default, so each one has to stay `undefined` here.
  lockScroll: undefined,
  trapFocus: undefined,
  withinPortal: undefined,
  closeOnClickOutside: undefined,
  closeOnEscape: undefined,
  returnFocus: undefined,
  title: undefined,
  withOverlay: true,
  withCloseButton: true,
})

defineSlots<ModalSlots>()

const emit = defineEmits<{
  close: []
}>()

const slots = useSlots()
const attrs = useAttrs()

/**
 * `Modal` declares every `Modal.Root` prop, so they no longer arrive as fallthrough
 * attributes and have to be forwarded explicitly. Only the props `Modal` consumes itself
 * are held back.
 */
const MODAL_ONLY_PROPS = [
  'title',
  'withOverlay',
  'overlayProps',
  'withCloseButton',
  'closeButtonProps',
  'opened',
  'keepMounted',
] as const

const rootProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(MODAL_ONLY_PROPS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return result
})

const title = computed(() => resolveNode(props.title, slots.title))

/** The header exists for the title, the close button, or both. */
const withHeader = computed(() => hasNode(title.value) || props.withCloseButton)

/** The title is renderable content, which cannot be interpolated as text. */
const renderTitle = () => title.value as VNodeChild
</script>

<template>
  <ModalRoot
    v-bind="{ ...attrs, ...rootProps }"
    :opened="props.opened"
    :keep-mounted="props.keepMounted"
    @close="emit('close')"
  >
    <ModalOverlay v-if="props.withOverlay" v-bind="props.overlayProps" />

    <ModalContent>
      <ModalHeader v-if="withHeader">
        <ModalTitle v-if="hasNode(title)">
          <component :is="renderTitle" />
        </ModalTitle>
        <ModalCloseButton v-if="props.withCloseButton" v-bind="props.closeButtonProps" />
      </ModalHeader>

      <ModalBody>
        <slot />
      </ModalBody>
    </ModalContent>
  </ModalRoot>
</template>
