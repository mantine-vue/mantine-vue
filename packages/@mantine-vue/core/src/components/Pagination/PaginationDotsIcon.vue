<script setup lang="ts">
import { useAttrs } from 'vue'
import { omitAttrs } from '../../core'

defineOptions({ name: 'PaginationDotsIcon', inheritAttrs: false })
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
      d="M2 8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm4.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm4.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>
