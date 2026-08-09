import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineRadius, MantineSize, StylesApiProps } from '../../../core'

export type ProgressRootStylesNames = 'root' | 'section' | 'label'

/** Props declared by `ProgressRoot` itself. See `ProgressRootProps` for the full public type. */
export interface ProgressRootOwnProps extends StylesApiProps<ProgressRootProps> {
  /**
   * Controls track height
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** If set, adjusts label text color based on section background color for readability */
  autoContrast?: boolean

  /**
   * Controls sections width transition duration, value is specified in ms
   *
   * @default 100
   */
  transitionDuration?: number

  /**
   * Controls orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ProgressRootProps
  extends Omit<BoxProps, keyof ProgressRootOwnProps>, ProgressRootOwnProps {}

export interface ProgressRootSlots {
  /** Progress sections. */
  default?: () => VNodeChild
}
