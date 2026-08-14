import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type EmptyStateTitleStylesNames = 'title'

/** Props declared by `EmptyStateTitle` itself. See `EmptyStateTitleProps` for the full public type. */
export interface EmptyStateTitleOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Heading order. When set, renders an `h1`–`h6`; otherwise renders a `div`. */
  order?: 1 | 2 | 3 | 4 | 5 | 6

  /** Class names applied to EmptyState elements. */
  classNames?: StylesApiProps<EmptyStateTitleFactory>['classNames']

  /** Inline styles applied to EmptyState elements. */
  styles?: StylesApiProps<EmptyStateTitleProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface EmptyStateTitleProps
  extends Omit<BoxProps, keyof EmptyStateTitleOwnProps>, EmptyStateTitleOwnProps {}

export interface EmptyStateTitleSlots {
  /** Title content. */
  default?: () => VNodeChild
}

export type EmptyStateTitleFactory = Factory<{
  props: Omit<EmptyStateTitleProps, 'rootRef'>
  ref: HTMLDivElement
  slots: EmptyStateTitleSlots
  element: 'div'
  stylesNames: EmptyStateTitleStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
