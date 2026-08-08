import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  StylesApiProps,
} from '../../core'

type Position = 'top' | 'middle' | 'bottom'
type Placement = 'start' | 'center' | 'end'

export type IndicatorPosition = `${Position}-${Placement}`

/** Props declared by `Indicator` itself. See `IndicatorProps` for the full public type. */
export interface IndicatorOwnProps extends StylesApiProps<IndicatorProps> {
  /**
   * Indicator position relative to the target element
   *
   * @default 'top-end'
   */
  position?: IndicatorPosition

  /**
   * Distance in pixels to offset the indicator from its default position, useful for elements with border-radius. Can be a number for uniform offset or an object with `x` and `y` properties for separate horizontal and vertical offsets
   *
   * @default 0
   */
  offset?: number | { x: number; y: number }

  /**
   * Changes container display from block to inline-block, use when wrapping elements with fixed width
   *
   * @default false
   */
  inline?: boolean

  /**
   * Indicator width and height
   *
   * @default 10
   */
  size?: string | number

  /** Label displayed inside the indicator, for example, notification count */
  label?: MantineNode

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default 100
   */
  radius?: MantineRadius

  /**
   * Key of `theme.colors` or any valid CSS color value
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Adds border to the root element
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * Hides the indicator when set
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the indicator has processing animation
   *
   * @default false
   */
  processing?: boolean

  /**
   * Indicator z-index
   *
   * @default 200
   */
  zIndex?: string | number

  /** If set, adjusts text color based on background color */
  autoContrast?: boolean

  /** Maximum value to display. If label is a number greater than this value, it will be displayed as `{maxValue}+` */
  maxValue?: number

  /**
   * Determines whether indicator with label `0` should be displayed
   *
   * @default true
   */
  showZero?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface IndicatorSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Indicator label. Used when the `label` prop is not set. */
  label?: () => VNodeChild
}

export interface IndicatorProps
  extends Omit<BoxProps, keyof IndicatorOwnProps>, IndicatorOwnProps {}
