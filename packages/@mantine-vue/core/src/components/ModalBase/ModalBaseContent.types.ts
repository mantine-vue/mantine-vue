import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../core'

export interface ModalBaseContentSlots {
  /** Modal content. */
  default?: () => VNodeChild
}

/**
 * Props declared by `ModalBaseContent` itself.
 * See `ModalBaseContentProps` for the full public type.
 */
export interface ModalBaseContentOwnProps {
  /** Props passed down to the content transition, merged over the modal's own. */
  transitionProps?: Record<string, any>

  /** Props passed down to the element that centres the content in the viewport. */
  innerProps?: Record<string, any>
}

export interface ModalBaseContentProps
  extends Omit<BoxProps, keyof ModalBaseContentOwnProps>, ModalBaseContentOwnProps {}
