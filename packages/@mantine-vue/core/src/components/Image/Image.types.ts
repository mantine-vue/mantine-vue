import type { BoxProps, MantineRadius, ObjectFit, StylesApiProps } from '../../core'

/** Props declared by `Image` itself. See `ImageProps` for the full public type. */
export interface ImageOwnProps extends StylesApiProps<ImageProps> {
  /** Image url */
  src?: any

  /** Image url used as a fallback if the image cannot be loaded */
  fallbackSrc?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default 0
   */
  radius?: MantineRadius

  /**
   * Controls `object-fit` style
   *
   * @default 'cover'
   */
  fit?: ObjectFit
}

export interface ImageProps extends Omit<BoxProps, keyof ImageOwnProps>, ImageOwnProps {}
export type ImageStylesNames = 'root'
export type ImageCssVariables = { root: '--image-radius' | '--image-object-fit' }
export interface ImageEmits {
  error: [event: Event]
}
