import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'

export type AffixStylesNames = 'root'

export interface AffixPosition {
  top?: string | number
  left?: string | number
  bottom?: string | number
  right?: string | number
}

/** Props declared by `Affix` itself. See `AffixProps` for the full public type. */
export interface AffixOwnProps extends StylesApiProps<AffixProps> {
  /**
   * Root element `z-index` property
   *
   * @default getDefaultZIndex('modal')
   */
  zIndex?: string | number

  /**
   * Determines whether the component is rendered within `Portal`
   *
   * @default true
   */
  withinPortal?: boolean

  /** Props passed down to the `Portal` component. Ignored when `withinPortal` is `false`. */
  portalProps?: Record<string, any>

  /**
   * Affix position on screen
   *
   * @default { bottom: 0, right: 0 }
   */
  position?: AffixPosition
}

export interface AffixProps extends Omit<BoxProps, keyof AffixOwnProps>, AffixOwnProps {}

export interface AffixSlots {
  /** Fixed-position content. */
  default?: () => VNodeChild
}
