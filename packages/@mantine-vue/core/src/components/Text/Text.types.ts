import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineFontSize,
  MantineLineHeight,
  StylesApiProps,
  MantineElementType,
  PolymorphicFactory,
} from '../../core'

export type TextTruncate = 'end' | 'start' | boolean
export type TextVariant = 'text' | 'gradient'

/** Props declared by `Text` itself. See `TextProps` for the full public type. */
export interface TextOwnProps extends StylesApiProps<TextFactory> {
  /** Receives the root DOM node. See the polymorphic components guide. */
  rootRef?: VueRefTarget<Element>

  /** Root element or component rendered by `Text`. */
  component?: MantineElementType

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string

  /**
   * Controls `font-size` and `line-height`
   *
   * @default 'md'
   */
  size?: MantineFontSize | MantineLineHeight

  /** Number of lines after which Text will be truncated */
  lineClamp?: number

  /** Side on which Text must be truncated, if `true`, text is truncated from the start */
  truncate?: TextTruncate

  /**
   * Sets `line-height` to 1 for centering
   *
   * @default false
   */
  inline?: boolean

  /**
   * Determines whether font properties should be inherited from the parent
   *
   * @default false
   */
  inherit?: boolean

  /**
   * Gradient configuration, ignored when `variant` is not `gradient`
   *
   * @default theme.defaultGradient
   */
  gradient?: { from: string; to: string; deg?: number }

  /**
   * Shorthand for `component="span"`
   *
   * @default false
   */
  span?: boolean

  /** Controls `text-wrap` CSS property */
  textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: TextVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface TextProps extends Omit<BoxProps, keyof TextOwnProps>, TextOwnProps {}
export interface TextSlots {
  default?: () => VNodeChild
}
export type TextStylesNames = 'root'
export type TextCssVariables = {
  root: '--text-gradient' | '--text-line-clamp' | '--text-fz' | '--text-lh' | '--text-text-wrap'
}
import type { VueRefTarget } from '@mantine-vue/hooks'

export type TextFactory = PolymorphicFactory<{
  props: Omit<TextProps, 'component' | 'rootRef'>
  slots: TextSlots
  ref: HTMLParagraphElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'p'
  defaultRef: HTMLParagraphElement
  stylesNames: TextStylesNames
  vars: TextCssVariables
  variant: TextVariant
}>
