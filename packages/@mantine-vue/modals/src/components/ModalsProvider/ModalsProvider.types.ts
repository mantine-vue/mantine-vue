import type { ConfirmLabels, ModalSettings } from '../../context'

/** Props accepted by `ModalsProvider`. */
export interface ModalsProviderProps {
  /** Predefined modals. */
  modals?: Record<string, any>
  /** Shared Modal component props, applied for every modal. */
  modalProps?: ModalSettings
  /** Confirm modal labels. */
  labels?: ConfirmLabels
}
