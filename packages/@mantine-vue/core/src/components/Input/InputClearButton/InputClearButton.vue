<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { CloseButton } from '../../CloseButton'
import { useInputContext } from '../Input.context'
import type { InputClearButtonOwnProps, InputClearButtonSlots } from './InputClearButton.types'

defineOptions({ name: 'InputClearButton', inheritAttrs: false })
const props = withDefaults(defineProps<InputClearButtonOwnProps>(), {
  size: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
})
defineSlots<InputClearButtonSlots>()
const attrs = useAttrs()
const ctx = useInputContext()
const closeButtonProps = computed(
  () =>
    ({
      ...attrs,
      variant: props.variant || 'transparent',
      size: props.size || ctx.size || 'sm',
      classNames: props.classNames,
      styles: props.styles,
      __staticSelector: 'InputClearButton',
      style: [{ pointerEvents: 'all', background: 'var(--input-bg)' }, attrs.style as any],
    }) as any,
)
</script>

<template>
  <CloseButton v-bind="closeButtonProps"><slot /></CloseButton>
</template>
