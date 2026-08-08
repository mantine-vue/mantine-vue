<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, omitAttrs } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import type { ModalBaseHeaderSlots } from './ModalBaseHeader.types'
import classes from './ModalBase.module.css'

defineOptions({ name: 'ModalBaseHeader', inheritAttrs: false })
defineSlots<ModalBaseHeaderSlots>()

const attrs = useAttrs()
const ctx = useModalBaseContext()
</script>

<template>
  <Box
    v-bind="omitAttrs(attrs, ['class'])"
    component="header"
    :class="[!ctx.unstyled && classes.header, attrs.class]"
  >
    <slot />
  </Box>
</template>
