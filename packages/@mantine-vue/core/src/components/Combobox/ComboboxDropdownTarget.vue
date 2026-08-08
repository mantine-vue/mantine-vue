<script setup lang="ts">
import { useAttrs } from 'vue'
import { PopoverTarget } from '../Popover'
import type { ComboboxDropdownTargetProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxDropdownTarget',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxDropdownTargetProps>(), {
  refProp: 'ref',
})

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
</script>

<template>
  <!--
    Anchors the dropdown without adding any combobox behaviour, for cases where the
    element the dropdown hangs off is not the element that receives the events.
  -->
  <PopoverTarget v-bind="attrs" :ref-prop="props.refProp">
    <slot />
  </PopoverTarget>
</template>
