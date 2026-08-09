<script setup lang="ts">
import type { NativeScrollAreaSlots } from './NativeScrollArea.types'
defineOptions({ name: 'NativeScrollArea' })
defineSlots<NativeScrollAreaSlots>()
</script>
<template><slot /></template>
