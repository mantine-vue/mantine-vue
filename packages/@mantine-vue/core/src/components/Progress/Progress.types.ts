import type { BoxProps, MantineColor, MantineRadius, MantineSize, StylesApiProps } from '../../core'

export type ProgressStylesNames = 'root' | 'section' | 'label'

/** Props declared by `Progress` itself. See `ProgressProps` for the full public type. */
export interface ProgressOwnProps extends StylesApiProps<ProgressProps> {
  /** Value of the progress */
  value: number

  /**
   * Key of `theme.colors` or any valid CSS value
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * If set, the section has stripes
   *
   * @default false
   */
  striped?: boolean

  /**
   * If set, the sections stripes are animated (automatically enables striped)
   *
   * @default false
   */
  animated?: boolean

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
}

export interface ProgressProps extends Omit<BoxProps, keyof ProgressOwnProps>, ProgressOwnProps {}
