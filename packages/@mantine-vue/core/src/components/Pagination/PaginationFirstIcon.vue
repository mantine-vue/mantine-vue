<script setup lang="ts">
import { useAttrs } from 'vue'
import { omitAttrs } from '../../core'

defineOptions({ name: 'PaginationFirstIcon', inheritAttrs: false })
const attrs = useAttrs()
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    v-bind="omitAttrs(attrs, ['style'])"
    :style="[
      {
        width: 'calc(var(--pagination-control-size) / 1.8)',
        height: 'calc(var(--pagination-control-size) / 1.8)',
      },
      attrs.style,
    ]"
  >
    <path
      d="M4 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm8.707.293a1 1 0 0 1 0 1.414L8.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>
