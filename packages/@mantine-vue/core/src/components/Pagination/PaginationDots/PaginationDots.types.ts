import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../../core'

/** Props declared by `PaginationDots` itself. See `PaginationDotsProps` for the full public type. */
export interface PaginationDotsOwnProps {
  /** Custom dots icon component, must accept svg element props and size prop */
  icon?: any
}

export interface PaginationDotsSlots {
  /** Custom dots icon. Used when the `icon` prop is not set. */
  icon?: () => VNodeChild
}

export interface PaginationDotsProps
  extends Omit<BoxProps, keyof PaginationDotsOwnProps>, PaginationDotsOwnProps {}

export type PaginationDotsStylesNames = 'dots'

export type PaginationDotsFactory = Factory<{
  props: PaginationDotsProps
  ref: HTMLSpanElement
  slots: PaginationDotsSlots
  element: 'span'
}>
