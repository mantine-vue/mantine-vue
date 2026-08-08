import type { VNodeChild } from 'vue'
import type { CloseButtonProps } from '../CloseButton'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModalBaseCloseButtonOwnProps {}

/** Full public props accepted by the close button rendered in a modal header. */
export interface ModalBaseCloseButtonProps
  extends
    Omit<CloseButtonProps, keyof ModalBaseCloseButtonOwnProps>,
    ModalBaseCloseButtonOwnProps {}

export interface ModalBaseCloseButtonSlots {
  /** Custom close button content. */
  default?: () => VNodeChild
  /** Custom close icon. */
  icon?: () => VNodeChild
}
