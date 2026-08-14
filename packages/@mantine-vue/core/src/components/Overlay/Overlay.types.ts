import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineRadius,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'
import type { VueRefTarget } from '@mantine-vue/hooks'

/** Props declared by `Overlay` itself. See `OverlayProps` for the full public type. */
export interface OverlayOwnProps extends StylesApiProps<OverlayProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Overlay`.
   *
   * @default 'div'
   */
  component?: MantineElementType

  /**
   * Overlay `background-color` opacity 0–1, ignored when `gradient` prop is set
   *
   * @default 0.6
   */
  backgroundOpacity?: number

  /**
   * Overlay `background-color`
   *
   * @default #000
   */
  color?: string

  /**
   * Overlay background blur in px (converted to rem). Applies `backdrop-filter: blur()`. Note: backdrop-filter is not supported in all browsers.
   *
   * @default 0
   */
  blur?: string | number

  /** Changes overlay to gradient. If set, both `color` and `backgroundOpacity` props are ignored. */
  gradient?: string

  /**
   * Overlay z-index
   *
   * @default getDefaultZIndex('modal')
   */
  zIndex?: string | number

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius
   *
   * @default 0
   */
  radius?: MantineRadius

  /**
   * Centers content inside the overlay using flexbox (sets display: flex, align-items: center, justify-content: center)
   *
   * @default false
   */
  center?: boolean

  /**
   * Changes position from `absolute` to `fixed` (viewport-relative instead of parent-relative)
   *
   * @default false
   */
  fixed?: boolean
}

export interface OverlayProps extends Omit<BoxProps, keyof OverlayOwnProps>, OverlayOwnProps {}

export type OverlayStylesNames = 'root'

export type OverlayCssVariables = {
  root: '--overlay-bg' | '--overlay-filter' | '--overlay-radius' | '--overlay-z-index'
}
export interface OverlaySlots {
  /** Overlay content. */
  default?: () => VNodeChild
}

/** Public contract of `Overlay`. `component` and `rootRef` come from the factory. */
export type OverlayFactory = PolymorphicFactory<{
  props: Omit<OverlayProps, 'component' | 'rootRef'>
  slots: OverlaySlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: OverlayStylesNames
  vars: OverlayCssVariables
}>
