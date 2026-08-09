import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type {
  BoxProps,
  MantineRadius,
  MantineSpacing,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'
import type { CardSection } from './CardSection/CardSection'

/** Props declared by `Card` itself. See `CardProps` for the full public type. */
export interface CardOwnProps extends StylesApiProps<CardProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Card`.
   *
   * @default 'div'
   */
  component?: MantineElementType

  /** Key of `theme.shadows` or any valid CSS value to set `box-shadow` */
  shadow?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius, numbers are converted to rem
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Adds border to the card
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * Key of `theme.spacing` or any valid CSS value to set padding
   *
   * @default 'md'
   */
  padding?: MantineSpacing

  /**
   * Card orientation
   *
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface CardProps extends Omit<BoxProps, keyof CardOwnProps>, CardOwnProps {}

export interface CardSlots {
  default?: () => VNodeChild
}
export type CardStylesNames = 'root' | 'section'
export type CardCssVariables = { root: '--card-padding' }

/** Public contract of `Card`. `component` and `rootRef` come from the factory. */
export type CardFactory = PolymorphicFactory<{
  props: Omit<CardProps, 'component' | 'rootRef'>
  slots: CardSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: CardStylesNames
  vars: CardCssVariables
  staticComponents: {
    Section: typeof CardSection
  }
}>
