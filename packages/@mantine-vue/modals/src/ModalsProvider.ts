import { defineComponent, h, provide, type PropType, type VNodeChild } from 'vue'
import { getDefaultZIndex, Modal } from '@mantine-vue/core'
import { ConfirmModal } from './ConfirmModal'
import {
  ModalsContextKey,
  type ConfirmLabels,
  type ModalsContextProps,
  type ModalSettings,
  type OpenConfirmModal,
  type OpenContextModal,
} from './context'
import {
  closeAllModalsAction,
  closeModalAction,
  modalsStore,
  openConfirmModalAction,
  openContextModalAction,
  openModalAction,
  updateContextModalAction,
  updateModalAction,
  useModalsState,
} from './modals.store'

export interface ModalsProviderProps {
  modals?: Record<string, any>
  modalProps?: ModalSettings
  labels?: ConfirmLabels
}

function separateConfirmModalProps(props: OpenConfirmModal) {
  const {
    id,
    children: _children,
    onCancel,
    onConfirm,
    closeOnConfirm,
    closeOnCancel,
    cancelProps,
    confirmProps,
    groupProps,
    labels,
    ...modalProps
  } = props as any

  return {
    confirmModalProps: {
      id,
      onCancel,
      onConfirm,
      closeOnConfirm,
      closeOnCancel,
      cancelProps,
      confirmProps,
      groupProps,
      labels,
    },
    modalProps: { id, ...modalProps },
  }
}

export const ModalsProvider = defineComponent({
  name: 'ModalsProvider',
  props: {
    modals: { type: Object as PropType<Record<string, any>>, default: undefined },
    modalProps: { type: Object as PropType<ModalSettings>, default: undefined },
    labels: { type: Object as PropType<ConfirmLabels>, default: undefined },
  },
  setup(props, { slots }) {
    const state = useModalsState(modalsStore)

    const openModal = (settings: ModalSettings) => openModalAction(settings, modalsStore)
    const openConfirmModal = (settings: OpenConfirmModal) =>
      openConfirmModalAction(settings, modalsStore)
    const openContextModal = (modal: string, settings: OpenContextModal) =>
      openContextModalAction(modal, settings, modalsStore)
    const closeModal = (id: string, canceled?: boolean) =>
      closeModalAction(id, canceled, modalsStore)
    const closeAll = () => closeAllModalsAction(undefined, modalsStore)
    const updateModal = (payload: { modalId: string } & Partial<OpenConfirmModal>) =>
      updateModalAction(payload, modalsStore)
    const updateContextModal = (payload: { modalId: string } & Partial<OpenContextModal<any>>) =>
      updateContextModalAction(payload, modalsStore)

    const ctx: ModalsContextProps = {
      get modalProps() {
        return props.modalProps || {}
      },
      get modals() {
        return state.value.modals
      },
      openModal,
      openConfirmModal,
      openContextModal,
      closeModal,
      closeContextModal: closeModal,
      closeAll,
      updateModal,
      updateContextModal,
    }

    provide(ModalsContextKey, ctx)

    return () => {
      const current = state.value.current
      let currentModalProps: Record<string, any> = {}
      let content: VNodeChild = null

      if (current) {
        if (current.type === 'context') {
          const { innerProps, ...rest } = current.props
          currentModalProps = rest
          const ContextModalComponent = props.modals?.[current.ctx]
          content = ContextModalComponent
            ? h(ContextModalComponent, { innerProps, context: ctx, id: current.id })
            : null
        } else if (current.type === 'confirm') {
          const { confirmModalProps, modalProps: separatedModalProps } = separateConfirmModalProps(
            current.props,
          )
          currentModalProps = separatedModalProps
          content = h(ConfirmModal, {
            ...confirmModalProps,
            id: current.id,
            labels: current.props.labels || props.labels,
          })
        } else {
          const { children, ...rest } = current.props as any
          currentModalProps = rest
          content = typeof children === 'function' ? children() : (children ?? null)
        }
      }

      return [
        h(
          Modal,
          {
            zIndex: getDefaultZIndex('modal') + 1,
            ...props.modalProps,
            ...currentModalProps,
            opened: state.value.modals.length > 0,
            onClose: () => closeModal(state.value.current?.id as string),
          },
          () => content,
        ),
        slots.default?.(),
      ]
    }
  },
})
