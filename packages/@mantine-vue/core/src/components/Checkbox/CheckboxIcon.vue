<script setup lang="ts">
import { useAttrs } from 'vue'
import CheckIcon from './CheckIcon.vue'
import type { CheckboxIconOwnProps } from './CheckIcon.types'

defineOptions({ name: 'CheckboxIcon', inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxIconOwnProps>(), {
  indeterminate: false,
})
const attrs = useAttrs()
</script>

<template>
  <svg
    v-if="props.indeterminate"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 6"
    aria-hidden="true"
    v-bind="attrs"
  >
    <rect width="32" height="6" fill="currentColor" rx="3" />
  </svg>
  <CheckIcon v-else v-bind="attrs" />
</template>
