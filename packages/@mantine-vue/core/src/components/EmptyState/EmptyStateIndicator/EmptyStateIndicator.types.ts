import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type EmptyStateIndicatorStylesNames = 'indicator'

/** Props declared by `EmptyStateIndicator` itself. See `EmptyStateIndicatorProps` for the full public type. */
export interface EmptyStateIndicatorOwnProps {
  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateIndicatorProps>['classNames']

  /** Inline styles applied to EmptyState elements. */
  styles?: StylesApiProps<EmptyStateIndicatorProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface EmptyStateIndicatorProps
  extends Omit<BoxProps, keyof EmptyStateIndicatorOwnProps>, EmptyStateIndicatorOwnProps {}

export interface EmptyStateIndicatorSlots {
  /** Icon or illustration displayed inside the indicator. */
  default?: () => VNodeChild
}
