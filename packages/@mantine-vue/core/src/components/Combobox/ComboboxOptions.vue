<script setup lang="ts">
import { computed, onMounted, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, omitAttrs } from '../../core'
import { useComboboxContext } from './Combobox.context'
import type { ComboboxOptionsProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxOptions',
  inheritAttrs: false,
})

const props = defineProps<ComboboxOptionsProps>()

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
const ctx = useComboboxContext()
const id = useId(props.id)

// The store needs the list id so the target can point `aria-controls` at it.
onMounted(() => ctx.store.setListId(id.value))

/**
 * The consumer handler is chained explicitly below, so it must not also reach the
 * element through the fallthrough attributes or it would fire twice.
 */
const listAttrs = computed(() => omitAttrs(attrs, ['onMousedown']))

const listStyles = computed(() =>
  ctx.getStyles('options', { className: attrs.class, style: attrs.style }),
)

/** Prevents the target from losing focus when the list is clicked. */
function onMousedown(event: MouseEvent) {
  event.preventDefault()
  ;(attrs as any).onMousedown?.(event)
}
</script>

<template>
  <Box
    v-bind="{ ...listAttrs, ...listStyles }"
    :id="id"
    role="listbox"
    :aria-labelledby="props.labelledBy"
    @mousedown="onMousedown"
  >
    <slot />
  </Box>
</template>
