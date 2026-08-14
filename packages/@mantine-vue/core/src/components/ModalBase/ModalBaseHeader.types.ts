import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../core'

/** Props accepted by `ModalBaseHeader`. Native header attributes are forwarded to the root. */
export interface ModalBaseHeaderProps extends BoxProps {
  /** Class applied to the modal header root. */
  class?: any
}

export interface ModalBaseHeaderSlots {
  /** Modal header content. */
  default?: () => VNodeChild
}

export type ModalBaseHeaderFactory = Factory<{
  props: ModalBaseHeaderProps
  slots: ModalBaseHeaderSlots
  element: 'header'
}>
