import type { InjectionKey, VNodeChild } from 'vue'
import type { ModalProps } from '@mantine-vue/core'
import type { ConfirmModalCallbacks, ConfirmModalProps } from './components/ConfirmModal'

export type ModalSettings = Partial<Omit<ModalProps, 'opened'>> & {
  /** Modal id, defaults to a random id, can be used to close or update the modal programmatically. */
  modalId?: string
  /** Modal content. */
  children?: VNodeChild | (() => VNodeChild)
  /** Called when the modal closes. */
  onClose?: () => void
}

export type ConfirmLabels = Record<'confirm' | 'cancel', VNodeChild>

export interface OpenConfirmModal extends ModalSettings, ConfirmModalProps, ConfirmModalCallbacks {}

export interface OpenContextModal<
  CustomProps extends Record<string, any> = Record<string, any>,
> extends ModalSettings {
  /** Props passed to the registered context modal component. */
  innerProps: CustomProps
}

export interface ContextModalProps<T extends Record<string, any> = Record<string, any>> {
  /** Modals manager context. */
  context: ModalsContextProps
  /** Props passed to `modals.openContextModal`. */
  innerProps: T
  /** Current modal id. */
  id: string
}

export type ModalState =
  | { id: string; type: 'content'; props: ModalSettings }
  | { id: string; type: 'confirm'; props: OpenConfirmModal }
  | { id: string; type: 'context'; props: OpenContextModal; ctx: string }

export interface ModalsContextProps {
  /** Shared Modal component props applied to every modal. */
  modalProps: ModalSettings
  /** Currently opened modal stack. */
  modals: ModalState[]
  /** Opens a regular modal and returns its id. */
  openModal: (props: ModalSettings) => string
  /** Opens a confirm modal and returns its id. */
  openConfirmModal: (props: OpenConfirmModal) => string
  /** Opens a predefined context modal and returns its id. */
  openContextModal: (modal: string, props: OpenContextModal) => string
  /** Closes the modal with the given id. */
  closeModal: (id: string, canceled?: boolean) => void
  /** Closes the context modal with the given id. */
  closeContextModal: (id: string, canceled?: boolean) => void
  /** Closes all opened modals. */
  closeAll: () => void
  /** Dynamically updates the content and properties of a regular or confirm modal. */
  updateModal: (payload: { modalId: string } & Partial<OpenConfirmModal>) => void
  /** Dynamically updates the content and properties of a context modal. */
  updateContextModal: (payload: { modalId: string } & Partial<OpenContextModal<any>>) => void
}

export const ModalsContextKey: InjectionKey<ModalsContextProps> = Symbol('ModalsContext')
