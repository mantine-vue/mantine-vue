<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { UnstyledButton } from '../../UnstyledButton'
import { usePaginationContext } from '../Pagination.context'
import type { PaginationControlOwnProps, PaginationControlSlots } from './PaginationControl.types'

defineOptions({
  name: 'PaginationControl',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PaginationControlOwnProps>(), {
  rootRef: undefined,
  active: false,
  disabled: false,
  // Tri-state: `undefined` resolves to `true`, so an edge control can pass `false`.
  withPadding: undefined,
})

defineSlots<PaginationControlSlots>()

const attrs = useAttrs()
const ctx = usePaginationContext()

const disabled = computed(() => props.disabled || ctx.disabled)
const withPadding = computed(() => props.withPadding ?? true)

const controlStyles = computed(() =>
  ctx.getStyles('control', {
    className: props.class ?? attrs.class,
    style: props.style ?? attrs.style,
  }),
)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <UnstyledButton
    :rootRef="setRootRef"
    v-bind="{ ...attrs, ...controlStyles }"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    :aria-current="props.active ? 'page' : (attrs['aria-current'] as any)"
    :unstyled="(attrs as any).unstyled"
    __static-selector="Pagination"
    :mod="[{ active: props.active, disabled, withPadding }, props.mod]"
  >
    <slot />
  </UnstyledButton>
</template>
