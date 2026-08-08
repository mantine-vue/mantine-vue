<script setup lang="ts">
import { useSlots } from 'vue'
import DropzoneStatus from './DropzoneStatus.vue'
import type { DropzoneIdleProps } from './DropzoneStatus.types'
defineOptions({ name: 'DropzoneIdle', inheritAttrs: false })
defineProps<DropzoneIdleProps>()
const slots = useSlots()
</script>
<template>
  <DropzoneStatus v-bind="{ ...$props, ...$attrs }" status="idle" :children="slots.default?.()" />
</template>
