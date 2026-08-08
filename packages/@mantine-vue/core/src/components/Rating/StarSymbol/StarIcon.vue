<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { omitAttrs } from '../../../core'

defineOptions({ name: 'StarIcon', inheritAttrs: false })

const attrs = useAttrs()
const iconStyle = computed(() => [
  {
    width: attrs.width as string | number | undefined,
    height: attrs.height as string | number | undefined,
  },
  attrs.style,
])
</script>

<template>
  <svg
    v-bind="omitAttrs(attrs, ['width', 'height', 'style'])"
    viewBox="0 0 24 24"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="iconStyle"
  >
    <path
      d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
    />
  </svg>
</template>
