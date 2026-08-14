<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
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
      rootRef: setRootRef,
      variant: props.variant || 'transparent',
      size: props.size || ctx.size || 'sm',
      classNames: props.classNames,
      styles: props.styles,
      __staticSelector: 'InputClearButton',
      style: [{ pointerEvents: 'all', background: 'var(--input-bg)' }, attrs.style as any],
    }) as any,
)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <CloseButton v-bind="closeButtonProps"><slot /></CloseButton>
</template>
