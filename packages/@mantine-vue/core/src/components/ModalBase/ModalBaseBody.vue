<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, omitAttrs } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import type { ModalBaseBodySlots } from './ModalBaseBody.types'
import { useModalBodyId } from './use-modal-body-id'
import classes from './ModalBase.module.css'

defineOptions({ name: 'ModalBaseBody', inheritAttrs: false })
defineSlots<ModalBaseBodySlots>()

const attrs = useAttrs()
const ctx = useModalBaseContext()
const getBodyId = useModalBodyId()
</script>

<template>
  <Box
    v-bind="omitAttrs(attrs, ['class'])"
    :id="getBodyId()"
    :class="[!ctx.unstyled && classes.body, attrs.class]"
  >
    <slot />
  </Box>
</template>
