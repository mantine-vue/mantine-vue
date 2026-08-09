<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, omitAttrs } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import type { ModalBaseTitleSlots } from './ModalBaseTitle.types'
import { useModalTitle } from './use-modal-title-id'
import classes from './ModalBase.module.css'

defineOptions({ name: 'ModalBaseTitle', inheritAttrs: false })
defineSlots<ModalBaseTitleSlots>()

const attrs = useAttrs()
const ctx = useModalBaseContext()
const getTitleId = useModalTitle()
</script>

<template>
  <Box
    v-bind="omitAttrs(attrs, ['class'])"
    component="h2"
    :id="getTitleId()"
    :class="[!ctx.unstyled && classes.title, attrs.class]"
  >
    <slot />
  </Box>
</template>
