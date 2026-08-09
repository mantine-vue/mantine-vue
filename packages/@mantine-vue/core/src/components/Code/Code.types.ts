import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, StylesApiProps } from '../../core'

export type CodeStylesNames = 'root'

export type CodeCssVariables = {
  root: '--code-bg'
}

export interface CodeSlots {
  /** Code content. */
  default?: () => VNodeChild
}

/** Props declared by `Code` itself. See `CodeProps` for the full public type. */
export interface CodeOwnProps extends StylesApiProps<CodeProps> {
  /**
   * Key of `theme.colors` or any valid CSS color, controls `background-color`
   * of the code. By default, calculated based on the color scheme.
   */
  color?: MantineColor

  /**
   * If set, code is rendered in `pre` instead of `code`.
   * @default false
   */
  block?: boolean
}

export interface CodeProps extends Omit<BoxProps, keyof CodeOwnProps>, CodeOwnProps {}
