<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { PopoverDropdown } from '../Popover'
import { useComboboxContext } from './Combobox.context'
import type { ComboboxDropdownProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxDropdown',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxDropdownProps>(), {
  hidden: false,
})

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
const ctx = useComboboxContext()

const dropdownStyles = computed(() =>
  ctx.getStyles('dropdown', { className: attrs.class, style: attrs.style }),
)
</script>

<template>
  <!--
    `role="presentation"` because the listbox role lives on `Combobox.Options` inside;
    a nested dialog role would break the relationship the target advertises.
  -->
  <PopoverDropdown
    v-bind="{ ...attrs, ...dropdownStyles }"
    role="presentation"
    :data-hidden="props.hidden || undefined"
    :data-floating-height="ctx.floatingHeight || undefined"
  >
    <slot />
  </PopoverDropdown>
</template>
