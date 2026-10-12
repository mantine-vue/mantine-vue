<script setup lang="ts">
import { onBeforeUnmount, onMounted, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box } from '../../core'
import { useTourContext } from './Tour.context'
defineOptions({ name: 'TourTitle', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useTourContext()
const id = useId(attrs.id as string | undefined)
onMounted(() => ctx.registerTitle(id.value))
onBeforeUnmount(() => ctx.registerTitle(null))
</script>
<template>
  <Box
    component="h3"
    v-bind="{ ...attrs, ...ctx.getStyles('title', { className: attrs.class, style: attrs.style }) }"
    :id="id"
    ><slot
  /></Box>
</template>
