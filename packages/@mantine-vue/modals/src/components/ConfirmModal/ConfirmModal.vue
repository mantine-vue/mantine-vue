<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Box, Button, Group } from '@mantine-vue/core'
import { useModals } from '../../use-modals'
import type { ConfirmModalEmits, ConfirmModalProps } from './ConfirmModal.types'

defineOptions({ name: 'ConfirmModal', inheritAttrs: false })
const props = withDefaults(defineProps<ConfirmModalProps>(), {
  closeOnConfirm: true,
  closeOnCancel: true,
  labels: () => ({ cancel: '', confirm: '' }),
})
const emit = defineEmits<ConfirmModalEmits>()
const slots = useSlots()
const ctx = useModals()
const hasChildren = computed(() => Boolean(slots.default))
const cancelButtonProps = computed(() => {
  const value = { ...props.cancelProps }
  delete value.onClick
  delete value.children
  return value
})
const confirmButtonProps = computed(() => {
  const value = { ...props.confirmProps }
  delete value.onClick
  delete value.children
  return value
})
const renderCancelLabel = () => props.cancelProps?.children ?? props.labels.cancel
const renderConfirmLabel = () => props.confirmProps?.children ?? props.labels.confirm

function cancel(event: MouseEvent) {
  props.cancelProps?.onClick?.(event)
  emit('cancel')
  if (props.closeOnCancel) ctx.closeModal(props.id!)
}
function confirm(event: MouseEvent) {
  props.confirmProps?.onClick?.(event)
  emit('confirm')
  if (props.closeOnConfirm) ctx.closeModal(props.id!)
}
</script>

<template>
  <Box v-if="hasChildren" mb="md"><slot /></Box>
  <Group v-bind="props.groupProps" :mt="hasChildren ? 0 : 'md'" justify="flex-end">
    <Button v-bind="cancelButtonProps" variant="default" @click="cancel">
      <component :is="renderCancelLabel" />
    </Button>
    <Button v-bind="confirmButtonProps" @click="confirm">
      <component :is="renderConfirmLabel" />
    </Button>
  </Group>
</template>
