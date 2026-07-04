import type { InjectionKey, VNodeChild } from 'vue'
import type { ModalProps } from '@mantine-vue/core'
import type { ConfirmModalProps } from './ConfirmModal'

export type ModalSettings = Partial<Omit<ModalProps, 'opened'>> & {
  modalId?: string
  children?: VNodeChild | (() => VNodeChild)
  onClose?: () => void
}

export type ConfirmLabels = Record<'confirm' | 'cancel', VNodeChild>

export interface OpenConfirmModal extends ModalSettings, ConfirmModalProps {}

export interface OpenContextModal<
  CustomProps extends Record<string, any> = Record<string, any>,
> extends ModalSettings {
  innerProps: CustomProps
}

export interface ContextModalProps<T extends Record<string, any> = Record<string, any>> {
  context: ModalsContextProps
  innerProps: T
  id: string
}

export type ModalState =
  | { id: string; type: 'content'; props: ModalSettings }
  | { id: string; type: 'confirm'; props: OpenConfirmModal }
  | { id: string; type: 'context'; props: OpenContextModal; ctx: string }

export interface ModalsContextProps {
  modalProps: ModalSettings
  modals: ModalState[]
  openModal: (props: ModalSettings) => string
  openConfirmModal: (props: OpenConfirmModal) => string
  openContextModal: (modal: string, props: OpenContextModal) => string
  closeModal: (id: string, canceled?: boolean) => void
  closeContextModal: (id: string, canceled?: boolean) => void
  closeAll: () => void
  updateModal: (payload: { modalId: string } & Partial<OpenConfirmModal>) => void
  updateContextModal: (payload: { modalId: string } & Partial<OpenContextModal<any>>) => void
}

export const ModalsContextKey: InjectionKey<ModalsContextProps> = Symbol('ModalsContext')
