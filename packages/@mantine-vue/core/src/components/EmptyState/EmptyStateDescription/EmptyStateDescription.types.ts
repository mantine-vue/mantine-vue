import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type EmptyStateDescriptionStylesNames = 'description'

/** Props declared by `EmptyStateDescription` itself. See `EmptyStateDescriptionProps` for the full public type. */
export interface EmptyStateDescriptionOwnProps {
  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateDescriptionProps>['classNames']

  /** Inline styles applied to EmptyState elements. */
  styles?: StylesApiProps<EmptyStateDescriptionProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface EmptyStateDescriptionProps
  extends Omit<BoxProps, keyof EmptyStateDescriptionOwnProps>, EmptyStateDescriptionOwnProps {}

export interface EmptyStateDescriptionSlots {
  /** Description content. */
  default?: () => VNodeChild
}
