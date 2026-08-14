import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type EmptyStateDescriptionStylesNames = 'description'

/** Props declared by `EmptyStateDescription` itself. See `EmptyStateDescriptionProps` for the full public type. */
export interface EmptyStateDescriptionOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateDescriptionFactory>['classNames']

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

export type EmptyStateDescriptionFactory = Factory<{
  props: Omit<EmptyStateDescriptionProps, 'rootRef'>
  ref: HTMLParagraphElement
  slots: EmptyStateDescriptionSlots
  element: 'p'
  stylesNames: EmptyStateDescriptionStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
