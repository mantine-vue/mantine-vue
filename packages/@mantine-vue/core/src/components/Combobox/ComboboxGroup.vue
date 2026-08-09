<script setup lang="ts">
import { computed, useAttrs, type VNodeChild } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box } from '../../core'
import { useComboboxContext } from './Combobox.context'
import type { ComboboxGroupProps, ComboboxSlots } from './Combobox.types'

defineOptions({
  name: 'ComboboxGroup',
  inheritAttrs: false,
})

const props = defineProps<ComboboxGroupProps>()

defineSlots<ComboboxSlots>()

const attrs = useAttrs()
const ctx = useComboboxContext()
const id = useId(props.id)

const groupStyles = computed(() =>
  ctx.getStyles('group', { className: attrs.class, style: attrs.style }),
)

/** The label is renderable content, which cannot be interpolated as text. */
const renderLabel = (): VNodeChild => props.label
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...groupStyles }"
    role="group"
    :aria-labelledby="props.label ? id : undefined"
  >
    <div v-if="props.label" :id="id" v-bind="ctx.getStyles('groupLabel')">
      <component :is="renderLabel" />
    </div>
    <slot />
  </Box>
</template>
