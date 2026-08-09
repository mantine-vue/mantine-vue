<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, omitAttrs } from '../../core'
import { useComboboxContext } from './Combobox.context'
import type { ComboboxOptionProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxOption',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxOptionProps>(), {
  active: false,
  disabled: false,
  selected: false,
})

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
const ctx = useComboboxContext()
const id = useId(props.id)

/**
 * The consumer handlers are chained explicitly below, so they must not also reach the
 * element through the fallthrough attributes or they would fire twice.
 */
const optionAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onMousedown', 'onMouseover']))

const optionStyles = computed(() =>
  ctx.getStyles('option', { className: attrs.class, style: attrs.style }),
)

function onClick(event: MouseEvent) {
  // A disabled option swallows the click entirely, including the consumer handler.
  if (props.disabled) {
    event.preventDefault()
  } else {
    ctx.onOptionSubmit?.(String(props.value), { ...props, ...attrs })
    ;(attrs as any).onClick?.(event)
  }
}

/** Prevents the target from losing focus when an option is clicked. */
function onMousedown(event: MouseEvent) {
  event.preventDefault()
  ;(attrs as any).onMousedown?.(event)
}

function onMouseover(event: MouseEvent) {
  // Moving the pointer clears the keyboard highlight, so the two do not disagree.
  if (ctx.resetSelectionOnOptionHover) {
    ctx.store.resetSelectedOption()
  }

  ;(attrs as any).onMouseover?.(event)
}
</script>

<template>
  <Box
    v-bind="{ ...optionAttrs, ...optionStyles }"
    :id="id"
    role="option"
    data-combobox-option=""
    :data-combobox-active="props.active || undefined"
    :data-combobox-disabled="props.disabled || undefined"
    :data-combobox-selected="props.selected || undefined"
    :aria-selected="props.selected || undefined"
    @click="onClick"
    @mousedown="onMousedown"
    @mouseover="onMouseover"
  >
    <slot />
  </Box>
</template>
