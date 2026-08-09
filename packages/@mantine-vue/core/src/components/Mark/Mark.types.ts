import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, StylesApiProps } from '../../core'

export type MarkStylesNames = 'root'

export type MarkCssVariables = {
  root: '--mark-bg-dark' | '--mark-bg-light'
}

export interface MarkSlots {
  /** Highlighted content. */
  default?: () => VNodeChild
}

/** Props declared by `Mark` itself. See `MarkProps` for the full public type. */
export interface MarkOwnProps extends StylesApiProps<MarkProps> {
  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default 'yellow'
   */
  color?: MantineColor
}

export interface MarkProps extends Omit<BoxProps, keyof MarkOwnProps>, MarkOwnProps {}
