<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import MenuComponent from './Menu.vue'
import type { MenuSlots, MenuSubProps } from './Menu.types'

defineOptions({
  name: 'MenuSub',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuSubProps>(), {
  opened: undefined,
  defaultOpened: false,
  openDelay: 100,
  closeDelay: 100,
  position: 'right-start',
  offset: 0,
  transitionProps: () => ({ duration: 0 }),
  // `crossAxis` lets a submenu that would overflow slide along the parent instead of
  // flipping to the other side of it.
  middlewares: () => ({ shift: { crossAxis: true } }),
})

defineSlots<MenuSlots>()

const emit = defineEmits<{
  'update:opened': [opened: boolean]
}>()

const attrs = useAttrs()

const menuBindings = computed(() => ({
  ...attrs,
  opened: props.opened,
  defaultOpened: props.defaultOpened,
  'onUpdate:opened': (value: boolean) => emit('update:opened', value),
  // A submenu always opens on hover, and its items must not close the parent menu.
  trigger: 'hover' as const,
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  position: props.position,
  offset: props.offset,
  transitionProps: props.transitionProps,
  middlewares: props.middlewares,
  closeOnItemClick: false,
  // A submenu must stay inside its parent dropdown for hover tracking and outside clicks.
  withinPortal: false,
}))
</script>

<template>
  <MenuComponent v-bind="menuBindings as any">
    <slot />
  </MenuComponent>
</template>
