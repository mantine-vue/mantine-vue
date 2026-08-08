import type { ConfirmLabels } from '../../context'

/** Props accepted by `ConfirmModal`. */
export interface ConfirmModalProps {
  /** Modal id, defaults to a random id, can be used to close the modal programmatically. */
  id?: string
  /** Determines whether the modal should be closed when the confirm button is clicked. @default true */
  closeOnConfirm?: boolean
  /** Determines whether the modal should be closed when the cancel button is clicked. @default true */
  closeOnCancel?: boolean
  /** Cancel button props. */
  cancelProps?: Record<string, any>
  /** Confirm button props. */
  confirmProps?: Record<string, any>
  /** Buttons `Group` props. */
  groupProps?: Record<string, any>
  /** Cancel and confirm button labels, can be defined on `ModalsProvider`. */
  labels?: ConfirmLabels
}

/** Events emitted by `ConfirmModal`. */
export interface ConfirmModalEmits {
  /** Emitted when the cancel button is clicked. */
  cancel: []
  /** Emitted when the confirm button is clicked. */
  confirm: []
}

/** Callbacks accepted by the imperative `openConfirmModal` settings object. */
export interface ConfirmModalCallbacks {
  /** Called when the cancel button is clicked. */
  onCancel?: () => void
  /** Called when the confirm button is clicked. */
  onConfirm?: () => void
}
