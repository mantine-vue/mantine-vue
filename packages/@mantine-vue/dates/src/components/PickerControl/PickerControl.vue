<script setup lang="ts">
import { useAttrs } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import type { PickerControlProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'PickerControl', inheritAttrs: false })

const props = withDefaults(defineProps<PickerControlProps>(), {
  selected: false,
  disabled: false,
  inRange: false,
  firstInRange: false,
  lastInRange: false,
  withCellSpacing: true,
  fullWidth: false,
})
const attrs = useAttrs()
</script>

<template>
  <UnstyledButton
    v-bind="attrs"
    :class="[classes.pickerControl, attrs.class]"
    :disabled="props.disabled"
    :data-selected="(props.selected && !props.disabled) || undefined"
    :data-disabled="props.disabled || undefined"
    :data-in-range="(props.inRange && !props.disabled && !props.selected) || undefined"
    :data-first-in-range="(props.firstInRange && !props.disabled) || undefined"
    :data-last-in-range="(props.lastInRange && !props.disabled) || undefined"
    :data-with-cell-spacing="props.withCellSpacing || undefined"
    :data-full-width="props.fullWidth || undefined"
  >
    <slot />
  </UnstyledButton>
</template>
