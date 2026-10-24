import type { HTMLAttributes, VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../core'
import type { TransitionOverride } from '../Transition'

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
  transitionProps?: TransitionOverride

  /** Props passed down to the element that centres the content in the viewport. */
  innerProps?: HTMLAttributes
}

export interface ModalBaseContentProps
  extends Omit<BoxProps, keyof ModalBaseContentOwnProps>, ModalBaseContentOwnProps {}

export type ModalBaseContentFactory = Factory<{
  props: ModalBaseContentProps
  slots: ModalBaseContentSlots
  ref: HTMLElement
  exposed: { rootElement: Element | null }
  element: 'section'
}>
