import type {
  BoxProps,
  MantineRadius,
  ObjectFit,
  StylesApiProps,
  PolymorphicFactory,
} from '../../core'
import type { VueRefTarget } from '@mantine-vue/hooks'

/** Props declared by `Image` itself. See `ImageProps` for the full public type. */
export interface ImageOwnProps extends StylesApiProps<ImageProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

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

/** Public contract of `Image`. `component` and `rootRef` come from the factory. */
export type ImageFactory = PolymorphicFactory<{
  props: Omit<ImageProps, 'component' | 'rootRef'>
  emits: ImageEmits
  ref: HTMLImageElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'img'
  defaultRef: HTMLImageElement
  stylesNames: ImageStylesNames
  vars: ImageCssVariables
}>
