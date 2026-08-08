import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineNode, MantineRadius, StylesApiProps } from '../../core'

/** Props declared by `Blockquote` itself. See `BlockquoteProps` for the full public type. */
export interface BlockquoteOwnProps extends StylesApiProps<BlockquoteProps> {
  /** Blockquote icon, displayed at the top left side */
  icon?: MantineNode

  /**
   * Controls icon `width` and `height`, numbers are converted to rem
   *
   * @default 48
   */
  iconSize?: string | number

  /**
   * Key of `theme.colors` or any valid CSS color
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** Reference to a cited quote */
  cite?: MantineNode

  /** Controls `text-wrap` CSS property */
  textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
}

export interface BlockquoteSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Blockquote icon. Used when the `icon` prop is not set. */
  icon?: () => VNodeChild
  /** Citation content. Used when the `cite` prop is not set. */
  cite?: () => VNodeChild
}

export interface BlockquoteProps
  extends Omit<BoxProps, keyof BlockquoteOwnProps>, BlockquoteOwnProps {}
