import type { BoxProps, MantineRadius, StylesApiProps } from '../../core'

/** Props declared by `BackgroundImage` itself. See `BackgroundImageProps` for the full public type. */
export interface BackgroundImageOwnProps extends StylesApiProps<BackgroundImageProps> {
  /** Image url */
  src: string

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius, numbers are converted to rem
   *
   * @default 0
   */
  radius?: MantineRadius
}

export interface BackgroundImageProps
  extends Omit<BoxProps, keyof BackgroundImageOwnProps>, BackgroundImageOwnProps {}
