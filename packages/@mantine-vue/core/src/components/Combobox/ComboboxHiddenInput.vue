<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ComboboxHiddenInputProps } from './Combobox.types'

defineOptions({
  name: 'ComboboxHiddenInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxHiddenInputProps>(), {
  value: null,
  valuesDivider: ',',
})

const attrs = useAttrs()

/** A form sends a single string, so several values are joined into one. */
const serialized = computed(() =>
  Array.isArray(props.value)
    ? props.value.join(props.valuesDivider)
    : props.value != null
      ? String(props.value)
      : '',
)
</script>

<template>
  <input v-bind="attrs" type="hidden" :value="serialized" />
</template>
