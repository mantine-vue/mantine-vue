import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../core'

/** Props accepted by `ModalBaseBody`. Native div attributes are forwarded to the root element. */
export interface ModalBaseBodyProps extends BoxProps {
  /** Class applied to the modal body root. */
  class?: any
}

export interface ModalBaseBodySlots {
  /** Modal body content. */
  default?: () => VNodeChild
}

export type ModalBaseBodyFactory = Factory<{
  props: ModalBaseBodyProps
  slots: ModalBaseBodySlots
  element: 'div'
}>
