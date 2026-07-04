import { defineComponent, h, type PropType } from 'vue'
import { Box, Button, Group } from '@mantine-vue/core'
import type { ConfirmLabels } from './context'
import { useModals } from './use-modals'

export interface ConfirmModalProps {
  id?: string
  onCancel?: () => void
  onConfirm?: () => void
  closeOnConfirm?: boolean
  closeOnCancel?: boolean
  cancelProps?: Record<string, any>
  confirmProps?: Record<string, any>
  groupProps?: Record<string, any>
  labels?: ConfirmLabels
}

export const ConfirmModal = defineComponent({
  name: 'ConfirmModal',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    onCancel: { type: Function as PropType<() => void>, default: undefined },
    onConfirm: { type: Function as PropType<() => void>, default: undefined },
    closeOnConfirm: { type: Boolean, default: true },
    closeOnCancel: { type: Boolean, default: true },
    cancelProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    confirmProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    groupProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    labels: {
      type: Object as PropType<ConfirmLabels>,
      default: () => ({ cancel: '', confirm: '' }),
    },
  },
  setup(props, { slots }) {
    const ctx = useModals()

    const handleCancel = (event: MouseEvent) => {
      props.cancelProps?.onClick?.(event)
      props.onCancel?.()
      props.closeOnCancel && ctx.closeModal(props.id!)
    }

    const handleConfirm = (event: MouseEvent) => {
      props.confirmProps?.onClick?.(event)
      props.onConfirm?.()
      props.closeOnConfirm && ctx.closeModal(props.id!)
    }

    return () => {
      const children = slots.default?.()
      const hasChildren = !!children && children.length > 0

      return [
        hasChildren ? h(Box, { mb: 'md' }, () => children) : null,
        h(Group, { mt: hasChildren ? 0 : 'md', justify: 'flex-end', ...props.groupProps }, () => [
          h(
            Button,
            { variant: 'default', ...props.cancelProps, onClick: handleCancel },
            () => props.cancelProps?.children ?? props.labels?.cancel,
          ),
          h(
            Button,
            { ...props.confirmProps, onClick: handleConfirm },
            () => props.confirmProps?.children ?? props.labels?.confirm,
          ),
        ]),
      ]
    }
  },
})
