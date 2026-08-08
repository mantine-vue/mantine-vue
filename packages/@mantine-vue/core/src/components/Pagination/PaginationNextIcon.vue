<script setup lang="ts">
import { useAttrs } from 'vue'
import { omitAttrs } from '../../core'

defineOptions({ name: 'PaginationNextIcon', inheritAttrs: false })
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
      d="M5.293 2.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L9.586 8 5.293 3.707a1 1 0 0 1 0-1.414Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>
