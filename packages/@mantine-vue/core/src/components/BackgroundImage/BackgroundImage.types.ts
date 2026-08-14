import type { VNodeChild } from 'vue'
import type { BoxProps, MantineRadius, StylesApiProps, PolymorphicFactory } from '../../core'
import type { VueRefTarget } from '@mantine-vue/hooks'

/** Props declared by `BackgroundImage` itself. See `BackgroundImageProps` for the full public type. */
export interface BackgroundImageOwnProps extends StylesApiProps<BackgroundImageProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

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

export type BackgroundImageStylesNames = 'root'

export type BackgroundImageCssVariables = {
  root: '--bi-radius'
}
export interface BackgroundImageSlots {
  /** Content rendered on top of the background image. */
  default?: () => VNodeChild
}

/** Public contract of `BackgroundImage`. `component` and `rootRef` come from the factory. */
export type BackgroundImageFactory = PolymorphicFactory<{
  props: Omit<BackgroundImageProps, 'component' | 'rootRef'>
  slots: BackgroundImageSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: BackgroundImageStylesNames
  vars: BackgroundImageCssVariables
}>
