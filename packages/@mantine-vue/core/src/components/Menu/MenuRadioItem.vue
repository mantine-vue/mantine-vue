<script setup lang="ts">
import { computed, inject, useAttrs, useSlots, type VNodeChild } from 'vue'
import MenuItem from './MenuItem.vue'
import { useMenuContext } from './Menu.context'
import { MenuRadioGroupKey } from './Menu.select-context'
import type { MenuRadioItemProps, MenuRadioItemSlots } from './Menu.types'

defineOptions({
  name: 'MenuRadioItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuRadioItemProps>(), {
  checked: undefined,
  checkIcon: undefined,
  closeMenuOnClick: false,
})

defineSlots<MenuRadioItemSlots>()

const emit = defineEmits<{
  change: [value: string]
}>()

const slots = useSlots()
const attrs = useAttrs()

/** `null` outside a `Menu.RadioGroup`, in which case `checked` is read from the prop. */
const group = inject(MenuRadioGroupKey, null)
const menu = useMenuContext()

const checked = computed(() => (group ? group.value === props.value : !!props.checked))

function select() {
  group?.setValue(props.value)
  emit('change', props.value)
}

/** Prop, then scoped slot, then the menu-level icon, then a plain check mark. */
const checkIcon = computed(() =>
  slots.checkIcon
    ? slots.checkIcon({ checked: !!checked.value })
    : props.checkIcon !== undefined
      ? typeof props.checkIcon === 'function'
        ? (props.checkIcon as any)()
        : props.checkIcon
      : (menu.checkIcon ?? '✓'),
)

/** The space is always reserved unless alignment is off, so labels do not jump. */
const reserveIndicator = computed(() => menu.alignItemsLabels !== 'none' || checked.value)

const indicator = computed(() => (checked.value ? checkIcon.value : undefined) as VNodeChild)
</script>

<template>
  <MenuItem
    v-bind="attrs"
    role="menuitemradio"
    :aria-checked="checked"
    :reserve-indicator="reserveIndicator"
    :indicator="indicator"
    :close-menu-on-click="props.closeMenuOnClick"
    @click="select"
  >
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
    <slot />
  </MenuItem>
</template>
