<script setup lang="ts">
import { useAttrs } from 'vue'
import { omitAttrs } from '../../core'
import { CloseButton } from '../CloseButton'
import { useModalBaseContext } from './ModalBase.context'
import type {
  ModalBaseCloseButtonOwnProps,
  ModalBaseCloseButtonSlots,
} from './ModalBaseCloseButton.types'
import classes from './ModalBase.module.css'

defineOptions({ name: 'ModalBaseCloseButton', inheritAttrs: false })
defineProps<ModalBaseCloseButtonOwnProps>()
defineSlots<ModalBaseCloseButtonSlots>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const ctx = useModalBaseContext()

function handleClick(event: MouseEvent) {
  ctx.onClose()
  emit('click', event)
}
</script>

<template>
  <CloseButton
    v-bind="omitAttrs(attrs, ['class', 'onClick'])"
    :class="[!ctx.unstyled && classes.close, attrs.class]"
    :unstyled="ctx.unstyled"
    @click="handleClick"
  >
    <template v-if="$slots.default" #default><slot /></template>
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
  </CloseButton>
</template>
