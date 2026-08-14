import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, StylesApiProps, Factory } from '../../core'

export type MarkStylesNames = 'root'

export type MarkCssVariables = {
  root: '--mark-bg-dark' | '--mark-bg-light'
}

export interface MarkSlots {
  /** Highlighted content. */
  default?: () => VNodeChild
}

/** Props declared by `Mark` itself. See `MarkProps` for the full public type. */
export interface MarkOwnProps extends StylesApiProps<MarkFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default 'yellow'
   */
  color?: MantineColor
}

export interface MarkProps extends Omit<BoxProps, keyof MarkOwnProps>, MarkOwnProps {}

export type MarkFactory = Factory<{
  props: Omit<MarkProps, 'rootRef'>
  ref: HTMLElement
  slots: MarkSlots
  element: 'mark'
  stylesNames: MarkStylesNames
  vars: MarkCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
