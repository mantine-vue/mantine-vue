import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type EmptyStateActionsStylesNames = 'actions'

/** Props declared by `EmptyStateActions` itself. See `EmptyStateActionsProps` for the full public type. */
export interface EmptyStateActionsOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateActionsFactory>['classNames']

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

export type EmptyStateActionsFactory = Factory<{
  props: Omit<EmptyStateActionsProps, 'rootRef'>
  ref: HTMLDivElement
  slots: EmptyStateActionsSlots
  element: 'div'
  stylesNames: EmptyStateActionsStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
