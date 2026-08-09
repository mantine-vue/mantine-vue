<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { filterProps, useStyles } from '../../core'
import { useDelayedHover } from '../../utils/Floating'
import { Popover } from '../Popover'
import { provideMenuContext } from './Menu.context'
import type { MenuProps, MenuSlots } from './Menu.types'
import classes from './Menu.module.css'

defineOptions({
  name: 'Menu',
  inheritAttrs: false,
})

/**
 * Every boolean inherited from `PopoverProps` keeps `undefined`: `Popover` defaults
 * several of them to `true`, and a Vue cast to `false` here would be forwarded and
 * shadow that default.
 */
const props = withDefaults(defineProps<MenuProps>(), {
  opened: undefined,
  defaultOpened: false,
  closeOnItemClick: true,
  loop: true,
  trigger: 'click',
  openDelay: 0,
  closeDelay: 100,
  menuItemTabIndex: -1,
  withInitialFocusPlaceholder: true,
  alignItemsLabels: 'with-indicators',
  checkIcon: undefined,
  unstyled: false,
  withArrow: undefined,
  withinPortal: undefined,
  closeOnClickOutside: undefined,
  closeOnEscape: undefined,
  trapFocus: undefined,
  withRoles: undefined,
  returnFocus: undefined,
  keepMounted: undefined,
  disabled: undefined,
  withOverlay: undefined,
})

defineSlots<MenuSlots>()

const emit = defineEmits<{
  'update:opened': [opened: boolean]
  open: []
  close: []
}>()

const attrs = useAttrs()

const internal = ref(props.defaultOpened)

/** Number of mounted `Menu.Search` fields; the dropdown behaves differently with one. */
const searchCount = ref(0)
const searchExitClear = ref<(() => void) | null>(null)

const controlled = () => props.opened !== undefined
const current = () => (controlled() ? !!props.opened : internal.value)

function change(value: boolean) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:opened', value)

  if (value) {
    emit('open')
  } else {
    emit('close')
    searchExitClear.value?.()
  }
}

const open = () => !current() && change(true)
const close = () => current() && change(false)
const toggle = () => (current() ? close() : open())

const delayed = useDelayedHover({
  open,
  close,
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
})

const getStyles = useStyles({
  name: 'Menu',
  classes,
  props,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})

provideMenuContext({
  get opened() {
    return current()
  },
  get hasSearch() {
    return searchCount.value > 0
  },
  get withInitialFocusPlaceholder() {
    return props.withInitialFocusPlaceholder
  },
  registerSearch: () => {
    searchCount.value += 1
    return () => {
      searchCount.value = Math.max(0, searchCount.value - 1)
    }
  },
  setSearchExitClear: (callback) => {
    searchExitClear.value = callback
  },
  toggleDropdown: toggle,
  closeDropdownImmediately: close,
  // A click-triggered menu opens and closes instantly; a hover-triggered one needs the
  // grace periods so the pointer can cross the gap to the dropdown.
  openDropdown: props.trigger === 'click' ? open : delayed.openDropdown,
  closeDropdown: props.trigger === 'click' ? close : delayed.closeDropdown,
  get closeOnItemClick() {
    return props.closeOnItemClick
  },
  get loop() {
    return props.loop
  },
  get trigger() {
    return props.trigger
  },
  get menuItemTabIndex() {
    return props.menuItemTabIndex
  },
  getStyles,
  get unstyled() {
    return props.unstyled
  },
  get alignItemsLabels() {
    return props.alignItemsLabels
  },
  get checkIcon() {
    return props.checkIcon
  },
})

/** Props `Menu` consumes itself and must not pass on to `Popover`. */
const MENU_ONLY_PROPS = [
  'closeOnItemClick',
  'loop',
  'trigger',
  'openDelay',
  'closeDelay',
  'menuItemTabIndex',
  'withInitialFocusPlaceholder',
  'alignItemsLabels',
  'checkIcon',
  'vars',
  'opened',
  'trapFocus',
  'returnFocus',
  '__staticSelector',
] as const

/**
 * `MenuProps extends PopoverProps`, so every `Popover` prop is now declared here and no
 * longer arrives as a fallthrough attribute – it has to be forwarded explicitly.
 *
 * `filterProps` drops the unset ones, so an absent prop falls through to `Popover`'s own
 * default instead of overriding it with `undefined`.
 */
const popoverProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(MENU_ONLY_PROPS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return filterProps(result)
})

const popoverBindings = computed(() => ({
  ...popoverProps.value,
  ...attrs,
  opened: current(),
  'onUpdate:opened': (value: boolean) => change(value),
  defaultOpened: props.defaultOpened,
  // A menu that stays mounted while closed must not hold focus, so the trap is dropped.
  trapFocus: ((attrs as any).keepMounted ?? props.keepMounted) ? false : (props.trapFocus ?? true),
  returnFocus: props.returnFocus ?? true,
  __staticSelector: 'Menu',
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
}))
</script>

<template>
  <Popover v-bind="popoverBindings">
    <slot />
  </Popover>
</template>
