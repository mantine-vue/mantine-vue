import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../core'

/** Props accepted by `ModalBaseTitle`. Native heading attributes are forwarded to the root. */
export interface ModalBaseTitleProps extends BoxProps {
  /** Class applied to the modal title root. */
  class?: any
}

export interface ModalBaseTitleSlots {
  /** Modal title content. */
  default?: () => VNodeChild
}
