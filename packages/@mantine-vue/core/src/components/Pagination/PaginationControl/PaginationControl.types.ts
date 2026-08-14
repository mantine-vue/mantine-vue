import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, Factory } from '../../../core'

export interface PaginationControlSlots {
  /** Control content, usually a page number or an edge icon. */
  default?: () => VNodeChild
}

/**
 * Props declared by `PaginationControl` itself.
 * See `PaginationControlProps` for the full public type.
 */
export interface PaginationControlOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * If set, the control is marked as the current page.
   *
   * @default false
   */
  active?: boolean

  /**
   * If set, the control cannot be interacted with. The parent `Pagination`
   * `disabled` prop is applied on top of this one.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the control has horizontal padding. Edge controls turn this off.
   *
   * @default true
   */
  withPadding?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class added to the control. */
  class?: any

  /** Inline style added to the control. */
  style?: any
}

export interface PaginationControlProps
  extends Omit<BoxProps, keyof PaginationControlOwnProps>, PaginationControlOwnProps {}

export type PaginationControlStylesNames = 'control'

export type PaginationControlFactory = Factory<{
  props: Omit<PaginationControlProps, 'rootRef'>
  ref: HTMLButtonElement
  slots: PaginationControlSlots
  element: 'button'
  stylesNames: PaginationControlStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
