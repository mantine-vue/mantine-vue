<script setup lang="ts">
import { computed, inject, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import MenuItem from './MenuItem.vue'
import { useMenuContext } from './Menu.context'
import { MenuCheckboxGroupKey } from './Menu.select-context'
import type { MenuCheckboxItemProps, MenuCheckboxItemSlots } from './Menu.types'

defineOptions({
  name: 'MenuCheckboxItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuCheckboxItemProps>(), {
  checked: undefined,
  defaultChecked: false,
  checkIcon: undefined,
  closeMenuOnClick: false,
})

defineSlots<MenuCheckboxItemSlots>()

const emit = defineEmits<{
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

const slots = useSlots()
const attrs = useAttrs()

/** `null` outside a `Menu.CheckboxGroup`, in which case the item owns its own state. */
const group = inject(MenuCheckboxGroupKey, null)
const menu = useMenuContext()

const local = ref(props.defaultChecked)

const checked = computed(() =>
  group && props.value != null
    ? (group.value || []).includes(props.value)
    : (props.checked ?? local.value),
)

function toggle() {
  const next = !checked.value

  if (group && props.value != null) {
    group.setValue(
      next
        ? [...(group.value || []), props.value]
        : (group.value || []).filter((v: string) => v !== props.value),
    )
  } else if (props.checked === undefined) {
    local.value = next
  }

  emit('update:checked', next)
  emit('change', next)
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
    role="menuitemcheckbox"
    :aria-checked="checked"
    :reserve-indicator="reserveIndicator"
    :indicator="indicator"
    :close-menu-on-click="props.closeMenuOnClick"
    @click="toggle"
  >
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
    <slot />
  </MenuItem>
</template>
