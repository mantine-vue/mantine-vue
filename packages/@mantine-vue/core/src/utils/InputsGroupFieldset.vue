<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../core'
import type { InputsGroupFieldsetSlots } from './InputsGroupFieldset.types'

defineOptions({
  name: 'InputsGroupFieldset',
  inheritAttrs: false,
})

defineSlots<InputsGroupFieldsetSlots>()

const attrs = useAttrs()
</script>

<template>
  <Box
    v-bind="attrs"
    component="fieldset"
    :style="[{ border: 0, padding: 0, margin: 0, minWidth: 0 }, attrs.style as any]"
  >
    <slot />
  </Box>
</template>
