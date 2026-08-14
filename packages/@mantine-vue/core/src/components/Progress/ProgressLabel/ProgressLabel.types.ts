import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

/** Props declared by `ProgressLabel` itself. See `ProgressLabelProps` for the full public type. */
export interface ProgressLabelOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to Progress elements. */
  classNames?: StylesApiProps<ProgressLabelFactory>['classNames']

  /** Inline styles applied to Progress elements. */
  styles?: StylesApiProps<ProgressLabelProps>['styles']

  /** Class added to the root element, if applicable */
  className?: any

  /** Inline style added to root component element, can subscribe to theme defined on MantineProvider */
  style?: any
}

export interface ProgressLabelSlots {
  /** Label content. */
  default?: () => VNodeChild
}

export interface ProgressLabelProps
  extends Omit<BoxProps, keyof ProgressLabelOwnProps>, ProgressLabelOwnProps {}

export type ProgressLabelStylesNames = 'label'

export type ProgressLabelFactory = Factory<{
  props: Omit<ProgressLabelProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ProgressLabelSlots
  element: 'div'
  stylesNames: ProgressLabelStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
