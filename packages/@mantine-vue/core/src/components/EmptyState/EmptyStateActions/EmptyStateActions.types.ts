import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type EmptyStateActionsStylesNames = 'actions'

/** Props declared by `EmptyStateActions` itself. See `EmptyStateActionsProps` for the full public type. */
export interface EmptyStateActionsOwnProps {
  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateActionsProps>['classNames']

  /** Inline styles applied to EmptyState elements. */
  styles?: StylesApiProps<EmptyStateActionsProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface EmptyStateActionsProps
  extends Omit<BoxProps, keyof EmptyStateActionsOwnProps>, EmptyStateActionsOwnProps {}

export interface EmptyStateActionsSlots {
  /** Action buttons or controls. */
  default?: () => VNodeChild
}
