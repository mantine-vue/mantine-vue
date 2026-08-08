<script setup lang="ts">
import { computed, provide } from 'vue'
import { Modal, getDefaultZIndex } from '@mantine-vue/core'
import ConfirmModal from '../ConfirmModal/ConfirmModal.vue'
import {
  ModalsContextKey,
  type ModalsContextProps,
  type ModalSettings,
  type OpenConfirmModal,
  type OpenContextModal,
} from '../../context'
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
} from '../../modals.store'
import type { ModalsProviderProps } from './ModalsProvider.types'

defineOptions({ name: 'ModalsProvider' })
const props = defineProps<ModalsProviderProps>()
const state = useModalsState(modalsStore)
const openModal = (settings: ModalSettings) => openModalAction(settings, modalsStore)
const openConfirmModal = (settings: OpenConfirmModal) =>
  openConfirmModalAction(settings, modalsStore)
const openContextModal = (modal: string, settings: OpenContextModal) =>
  openContextModalAction(modal, settings, modalsStore)
const closeModal = (id: string, canceled?: boolean) => closeModalAction(id, canceled, modalsStore)
const closeAll = () => closeAllModalsAction(undefined, modalsStore)
const updateModal = (payload: { modalId: string } & Partial<OpenConfirmModal>) =>
  updateModalAction(payload, modalsStore)
const updateContextModal = (payload: { modalId: string } & Partial<OpenContextModal<any>>) =>
  updateContextModalAction(payload, modalsStore)

const context: ModalsContextProps = {
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
provide(ModalsContextKey, context)

function separateConfirmModalProps(settings: OpenConfirmModal) {
  const value = { ...settings } as any
  const confirmModalProps = {
    id: value.id,
    onCancel: value.onCancel,
    onConfirm: value.onConfirm,
    closeOnConfirm: value.closeOnConfirm,
    closeOnCancel: value.closeOnCancel,
    cancelProps: value.cancelProps,
    confirmProps: value.confirmProps,
    groupProps: value.groupProps,
    labels: value.labels,
  }
  for (const key of [
    'children',
    'onCancel',
    'onConfirm',
    'closeOnConfirm',
    'closeOnCancel',
    'cancelProps',
    'confirmProps',
    'groupProps',
    'labels',
  ])
    delete value[key]
  return { confirmModalProps, modalProps: value }
}

const presentation = computed(() => {
  const current = state.value.current
  if (!current) return { modalProps: {}, component: null, componentProps: {} }
  if (current.type === 'context') {
    const { innerProps, ...modalProps } = current.props
    return {
      modalProps,
      component: props.modals?.[current.ctx] ?? null,
      componentProps: { innerProps, context, id: current.id },
    }
  }
  if (current.type === 'confirm') {
    const separated = separateConfirmModalProps(current.props)
    return {
      modalProps: separated.modalProps,
      component: ConfirmModal,
      componentProps: {
        ...separated.confirmModalProps,
        id: current.id,
        labels: current.props.labels || props.labels,
      },
    }
  }
  const modalProps = { ...current.props } as any
  delete modalProps.children
  return { modalProps, component: null, componentProps: {} }
})
const modalAttrs = computed(() => {
  const value = {
    zIndex: getDefaultZIndex('modal') + 1,
    ...props.modalProps,
    ...presentation.value.modalProps,
  }
  delete value.opened
  delete value.onClose
  return value
})
const renderContent = () => {
  const current = state.value.current
  if (!current || current.type !== 'content') return null
  const children = current.props.children
  return typeof children === 'function' ? children() : (children ?? null)
}
</script>

<template>
  <Modal
    v-bind="modalAttrs"
    :opened="state.modals.length > 0"
    @close="closeModal(state.current?.id as string)"
  >
    <component
      :is="presentation.component"
      v-if="presentation.component"
      v-bind="presentation.componentProps"
    />
    <component :is="renderContent" v-else />
  </Modal>
  <slot />
</template>
