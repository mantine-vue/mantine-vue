import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../core'

export interface ModalBaseContentSlots {
  /** Modal content. */
  default?: () => VNodeChild
}

/**
 * Props declared by `ModalBaseContent` itself.
 * See `ModalBaseContentProps` for the full public type.
 */
export interface ModalBaseContentOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Props passed down to the content transition, merged over the modal's own. */
  transitionProps?: Record<string, any>

  /** Props passed down to the element that centres the content in the viewport. */
  innerProps?: Record<string, any>
}

export interface ModalBaseContentProps
  extends Omit<BoxProps, keyof ModalBaseContentOwnProps>, ModalBaseContentOwnProps {}

export type ModalBaseContentFactory = Factory<{
  props: Omit<ModalBaseContentProps, 'rootRef'>
  slots: ModalBaseContentSlots
  ref: HTMLElement
  exposed: { rootElement: Element | null }
  element: 'section'
}>
