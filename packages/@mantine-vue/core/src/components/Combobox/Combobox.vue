<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { filterProps, useStyles } from '../../core'
import { Popover } from '../Popover'
import { provideComboboxContext } from './Combobox.context'
import { varsResolver } from './combobox-utils'
import { useCombobox } from './use-combobox/use-combobox'
import type { ComboboxOptionProps, ComboboxProps, ComboboxSlots } from './Combobox.types'
import classes from './Combobox.module.css'

defineOptions({
  name: 'Combobox',
  inheritAttrs: false,
})

/**
 * Every boolean inherited from `PopoverProps` keeps `undefined`: `Popover` defaults
 * several of them to `true`, and a Vue cast to `false` here would be forwarded and
 * shadow that default.
 */
const props = withDefaults(defineProps<ComboboxProps>(), {
  size: 'sm',
  resetSelectionOnOptionHover: false,
  readOnly: false,
  unstyled: false,
  __staticSelector: 'Combobox',
  opened: undefined,
  withArrow: undefined,
  withinPortal: undefined,
  closeOnClickOutside: undefined,
  closeOnEscape: undefined,
  trapFocus: undefined,
  withRoles: undefined,
  returnFocus: undefined,
  keepMounted: undefined,
  defaultOpened: undefined,
  disabled: undefined,
  withOverlay: undefined,
})

defineSlots<ComboboxSlots>()

const emit = defineEmits<{
  'option-submit': [string, ComboboxOptionProps]
}>()

const attrs = useAttrs()

/** Created unconditionally: hooks cannot be called behind a branch. */
const uncontrolled = useCombobox()
const store = props.store || uncontrolled

const getStyles = useStyles({
  // Components built on `Combobox` – `Select`, `MultiSelect`, `TagsInput` – generate
  // their own class names through this selector.
  name: props.__staticSelector,
  classes,
  props,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

provideComboboxContext({
  getStyles,
  store,
  get onOptionSubmit() {
    return (value: string, optionProps: ComboboxOptionProps) => {
      emit('option-submit', value, optionProps)
    }
  },
  get size() {
    return props.size
  },
  get resetSelectionOnOptionHover() {
    return props.resetSelectionOnOptionHover
  },
  get readOnly() {
    return props.readOnly
  },
  get floatingHeight() {
    return props.floatingHeight
  },
})

/**
 * The dropdown is only ever closed from here: opening is driven by the store, so a
 * `Popover` that decided to open on its own would desynchronise the two.
 */
function onPopoverChange(opened: boolean) {
  if (!opened) {
    ;(attrs as any).onClose?.()
    store.closeDropdown()
  }
}

/** Props `Combobox` consumes itself and must not pass on to `Popover`. */
const COMBOBOX_ONLY_PROPS = [
  'store',
  'onOptionSubmit',
  'size',
  'dropdownPadding',
  'resetSelectionOnOptionHover',
  'readOnly',
  'floatingHeight',
  '__staticSelector',
  'classNames',
  'styles',
  'vars',
  'unstyled',
  'opened',
  'onChange',
  'withRoles',
] as const

/**
 * `ComboboxProps extends PopoverProps`, so every `Popover` prop is now declared here and
 * no longer arrives as a fallthrough attribute – it has to be forwarded explicitly.
 *
 * `filterProps` drops the unset ones, so an absent prop falls through to `Popover`'s own
 * default instead of overriding it with `undefined`.
 */
const popoverProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(COMBOBOX_ONLY_PROPS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return filterProps(result)
})

/**
 * The combobox defaults come first so a consumer can override any of them; `opened`,
 * `withRoles` and the static selector come last because they are what makes this a
 * combobox rather than a plain popover.
 */
const popoverBindings = computed(() => ({
  keepMounted: true,
  withinPortal: true,
  width: 'target',
  transitionProps: { transition: 'fade', duration: 0 },
  ...popoverProps.value,
  ...attrs,
  opened: store.dropdownOpened,
  'onUpdate:opened': onPopoverChange,
  withRoles: false,
  unstyled: props.unstyled,
  __staticSelector: props.__staticSelector,
}))
</script>

<template>
  <Popover v-bind="popoverBindings">
    <slot />
  </Popover>
</template>
