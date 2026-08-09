<script setup lang="ts">
import { useSlots } from 'vue'
import DropzoneStatus from './DropzoneStatus.vue'
import type { DropzoneRejectProps } from './DropzoneStatus.types'
defineOptions({ name: 'DropzoneReject', inheritAttrs: false })
defineProps<DropzoneRejectProps>()
const slots = useSlots()
</script>
<template>
  <DropzoneStatus v-bind="{ ...$props, ...$attrs }" status="reject" :children="slots.default?.()" />
</template>
