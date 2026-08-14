import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type EmptyStateIndicatorStylesNames = 'indicator'

/** Props declared by `EmptyStateIndicator` itself. See `EmptyStateIndicatorProps` for the full public type. */
export interface EmptyStateIndicatorOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateIndicatorFactory>['classNames']

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

export type EmptyStateIndicatorFactory = Factory<{
  props: Omit<EmptyStateIndicatorProps, 'rootRef'>
  ref: HTMLDivElement
  slots: EmptyStateIndicatorSlots
  element: 'div'
  stylesNames: EmptyStateIndicatorStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
