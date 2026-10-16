<script setup lang="ts">
import { onBeforeUnmount, onMounted, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box } from '../../core'
import { useTourContext } from './Tour.context'
defineOptions({ name: 'TourBody', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useTourContext()
const id = useId(attrs.id as string | undefined)
onMounted(() => ctx.registerBody(id.value))
onBeforeUnmount(() => ctx.registerBody(null))
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...ctx.getStyles('body', { className: attrs.class, style: attrs.style }) }"
    :id="id"
    ><slot
  /></Box>
</template>
