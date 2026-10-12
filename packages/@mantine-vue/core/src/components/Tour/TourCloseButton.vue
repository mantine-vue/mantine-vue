<script setup lang="ts">
import { useAttrs } from 'vue'
import { CloseButton } from '../CloseButton'
import { useTourContext } from './Tour.context'
defineOptions({ name: 'TourCloseButton', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useTourContext()
</script>
<template>
  <CloseButton
    v-if="ctx.withCloseButton"
    v-bind="{ ...ctx.getStyles('closeButton'), ...attrs }"
    :aria-label="attrs['aria-label'] ?? ctx.labels.close"
    @click="ctx.close"
  />
</template>
