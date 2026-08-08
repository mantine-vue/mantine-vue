import type { Component, VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'

/** Which end of the pagination an edge control moves to. */
export type PaginationEdgeKind = 'next' | 'previous' | 'first' | 'last'

export interface PaginationEdgeSlots {
  /** Icon rendered inside the control. Takes precedence over the `icon` prop. */
  icon?: () => VNodeChild
}

/** Props declared by the pagination edge controls. */
export interface PaginationEdgeOwnProps {
  /**
   * Component rendered as the icon. Defaults to the icon that matches the edge.
   * Can also be set with the `icon` slot – the slot takes precedence.
   */
  icon?: Component

  /**
   * If set, the control cannot be interacted with. It is also disabled
   * automatically once the edge is reached.
   *
   * @default false
   */
  disabled?: boolean
}

export interface PaginationEdgeProps
  extends Omit<BoxProps, keyof PaginationEdgeOwnProps>, PaginationEdgeOwnProps {}
