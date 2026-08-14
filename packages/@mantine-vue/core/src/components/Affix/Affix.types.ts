import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../core'

export type AffixStylesNames = 'root'

export type AffixCssVariables = {
  root: '--affix-z-index' | '--affix-top' | '--affix-left' | '--affix-bottom' | '--affix-right'
}

export interface AffixPosition {
  top?: string | number
  left?: string | number
  bottom?: string | number
  right?: string | number
}

/** Props declared by `Affix` itself. See `AffixProps` for the full public type. */
export interface AffixOwnProps extends StylesApiProps<AffixFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type AffixFactory = Factory<{
  props: Omit<AffixProps, 'rootRef'>
  slots: AffixSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: AffixStylesNames
  vars: AffixCssVariables
}>
