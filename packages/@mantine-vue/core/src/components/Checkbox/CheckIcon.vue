<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { rem } from '../../core'
import type { CheckIconOwnProps } from './CheckIcon.types'

defineOptions({ name: 'CheckIcon', inheritAttrs: false })

const props = withDefaults(defineProps<CheckIconOwnProps>(), {
  size: undefined,
})
const attrs = useAttrs()
const iconStyle = computed(() =>
  props.size !== undefined
    ? [{ width: rem(props.size), height: rem(props.size), display: 'block' }, attrs.style as any]
    : attrs.style,
)
</script>

<template>
  <svg
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    v-bind="attrs"
    :style="iconStyle"
  >
    <path
      d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>
