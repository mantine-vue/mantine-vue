<script setup lang="ts">
import { computed, useAttrs, useSlots, watch, type VNodeChild } from 'vue'
import { getDefaultZIndex, hasNode, resolveNode } from '../../core'
import { useDrawerStackContext } from './Drawer.context'
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from './Drawer.compound'
import DrawerRoot from './DrawerRoot.vue'
import type { DrawerProps, DrawerSlots } from './Drawer.types'

defineOptions({
  name: 'Drawer',
  inheritAttrs: false,
})

/**
 * `title` keeps `undefined` because `MantineNode` resolves to a runtime type array
 * containing `Boolean` – a cast to `false` would make `resolveNode` ignore the slot.
 * Everything else is forwarded to `Drawer.Root` through the fallthrough attributes.
 */
const props = withDefaults(defineProps<DrawerProps>(), {
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
  stackId: undefined,
  zIndex: undefined,
})

defineSlots<DrawerSlots>()

const emit = defineEmits<{ close: [] }>()

const slots = useSlots()
const attrs = useAttrs()

/** `null` outside a `Drawer.Stack`, which is the normal case for a lone drawer. */
const stackCtx = useDrawerStackContext()

// Register/deregister with the stack when opened changes
watch(
  () => props.opened,
  (opened) => {
    if (stackCtx && props.stackId) {
      if (opened) {
        stackCtx.addModal(
          props.stackId,
          typeof props.zIndex === 'number' ? props.zIndex : getDefaultZIndex('modal'),
        )
      } else {
        stackCtx.removeModal(props.stackId)
      }
    }
  },
  { immediate: true },
)

/** Inside a stack the z-index is derived from the position, so drawers layer correctly. */
const resolvedZIndex = computed(() => {
  if (stackCtx && props.stackId) {
    return stackCtx.getZIndex(props.stackId)
  }

  return props.zIndex
})

/** Only the drawer on top of the stack reacts to `Escape` and traps focus. */
const stackProps = computed(() => {
  if (!stackCtx || !props.stackId) {
    return {}
  }

  const isCurrent = stackCtx.currentId === props.stackId

  return {
    closeOnEscape: isCurrent,
    trapFocus: isCurrent,
  }
})

/** One overlay for the whole stack: only the topmost drawer renders it. */
const overlayVisible = computed(() => {
  if (!props.withOverlay) {
    return false
  }

  if (stackCtx && props.stackId) {
    return stackCtx.currentId === props.stackId
  }

  return props.opened
})

/** Drawers below the top of the stack stay mounted but hidden. */
const contentHidden = computed(() => {
  if (stackCtx && props.stackId && props.opened) {
    return props.stackId !== stackCtx.currentId
  }

  return false
})

/** Inside a stack the overlay must not re-animate as drawers open on top of it. */
const overlayTransitionProps = computed(() =>
  stackCtx && props.stackId ? { duration: 0 } : undefined,
)

/**
 * `Drawer` declares every `Drawer.Root` prop, so they no longer arrive as fallthrough
 * attributes and have to be forwarded explicitly. Only the props `Drawer` consumes
 * itself are held back.
 */
const DRAWER_ONLY_PROPS = [
  'title',
  'withOverlay',
  'overlayProps',
  'withCloseButton',
  'closeButtonProps',
  'stackId',
  'zIndex',
  'opened',
  'keepMounted',
] as const

const rootProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(DRAWER_ONLY_PROPS as readonly string[]).includes(key)) {
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
  <DrawerRoot
    v-bind="{ ...attrs, ...rootProps, ...stackProps }"
    :opened="props.opened"
    :keep-mounted="props.keepMounted"
    :z-index="resolvedZIndex"
    @close="emit('close')"
  >
    <DrawerOverlay
      v-if="props.withOverlay"
      v-bind="props.overlayProps"
      :visible="overlayVisible"
      :transition-props="overlayTransitionProps"
    />

    <DrawerContent :__hidden="contentHidden">
      <DrawerHeader v-if="withHeader">
        <DrawerTitle v-if="hasNode(title)">
          <component :is="renderTitle" />
        </DrawerTitle>
        <DrawerCloseButton v-if="props.withCloseButton" v-bind="props.closeButtonProps" />
      </DrawerHeader>

      <DrawerBody>
        <slot />
      </DrawerBody>
    </DrawerContent>
  </DrawerRoot>
</template>
