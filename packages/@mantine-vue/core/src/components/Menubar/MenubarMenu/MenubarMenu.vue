<script lang="ts">
const DEFAULT_TRANSITION_DURATION = 150

export { DEFAULT_TRANSITION_DURATION }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Menu } from '../../Menu/Menu'
import { provideMenubarMenuContext, useMenubarContext } from '../Menubar.context'
import type { MenubarMenuProps, MenubarMenuSlots } from './MenubarMenu.types'

defineOptions({
  name: 'MenubarMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenubarMenuProps>(), {
  transitionProps: undefined,
  __index: -1,
})

defineSlots<MenubarMenuSlots>()

const attrs = useAttrs()

const ctx = useMenubarContext()
const id = useId()

const index = computed(() => props.__index)
const opened = computed(
  () => ctx.openIndex !== null && index.value !== -1 && ctx.openIndex === index.value,
)

/** Getters keep the provided object reactive without changing the shape consumers read. */
provideMenubarMenuContext({
  get id() {
    return id.value
  },
  get index() {
    return index.value
  },
  get opened() {
    return opened.value
  },
})

function handleChange(value: boolean) {
  if (value) {
    ctx.openMenu(index.value, 'click')
    ctx.setActiveIndex(index.value)
  } else {
    ctx.closeMenu()
  }
}

/**
 * Transitions play only when the whole bar opens or closes, not when moving between
 * sibling menus while one is already open — that would look like a flicker.
 */
const resolvedTransitionProps = computed(() => {
  const baseDuration = props.transitionProps?.duration ?? DEFAULT_TRANSITION_DURATION
  const baseExitDuration = props.transitionProps?.exitDuration ?? baseDuration

  return {
    ...props.transitionProps,
    duration: ctx.getPreviousOpenIndex() === null ? baseDuration : 0,
    exitDuration: ctx.openIndex === null ? baseExitDuration : 0,
  }
})
</script>

<template>
  <Menu
    :position="ctx.position as any"
    :loop="ctx.loop"
    :unstyled="ctx.unstyled"
    :menu-item-tab-index="-1"
    :trap-focus="false"
    v-bind="attrs"
    :transition-props="resolvedTransitionProps"
    :opened="opened"
    trigger="click"
    :return-focus="false"
    @update:opened="handleChange"
  >
    <slot />
  </Menu>
</template>
