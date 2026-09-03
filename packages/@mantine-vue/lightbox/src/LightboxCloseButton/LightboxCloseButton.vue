<script setup lang="ts">
import { useAttrs } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
defineOptions({ name: 'LightboxCloseButton', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useLightboxContext()
</script>
<template>
  <UnstyledButton
    v-bind="{ ...attrs, ...ctx.getStyles('closeButton') }"
    :aria-label="ctx.labels.closeLabel"
    @click="ctx.close"
    ><slot>×</slot></UnstyledButton
  >
</template>
