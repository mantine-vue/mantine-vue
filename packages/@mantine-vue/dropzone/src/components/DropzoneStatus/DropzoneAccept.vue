<script setup lang="ts">
import { useSlots } from 'vue'
import DropzoneStatus from './DropzoneStatus.vue'
import type { DropzoneAcceptProps } from './DropzoneStatus.types'
defineOptions({ name: 'DropzoneAccept', inheritAttrs: false })
defineProps<DropzoneAcceptProps>()
const slots = useSlots()
</script>
<template>
  <DropzoneStatus v-bind="{ ...$props, ...$attrs }" status="accept" :children="slots.default?.()" />
</template>
