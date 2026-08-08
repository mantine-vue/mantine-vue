<script setup lang="ts">
import { useAttrs } from 'vue'
import { InputClearButton } from '../Input'
import type { ComboboxClearButtonProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxClearButton',
  inheritAttrs: false,
})

defineProps<ComboboxClearButtonProps>()

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
</script>

<template>
  <!-- The static selector makes the button pick up the Combobox Styles API classes. -->
  <InputClearButton v-bind="attrs" __static-selector="Combobox">
    <slot />
  </InputClearButton>
</template>
