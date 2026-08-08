import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'

export type ActionIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient'

/** Props declared by `ActionIcon` itself. See `ActionIconProps` for the full public type. */
export interface ActionIconOwnProps extends StylesApiProps<ActionIconProps> {
  /**
   * Root element or component rendered by `ActionIcon`.
   *
   * @default 'button'
   */
  component?: string

  /**
   * If set, `Loader` component is displayed instead of the `children`
   *
   * @default false
   */
  loading?: boolean

  /** Props passed down to the `Loader` component. Ignored when `loading` prop is not set. */
  loaderProps?: Record<string, any>

  /**
   * Controls width and height of the button. Numbers are converted to rem.
   *
   * @default 'md'
   */
  size?: MantineSize | `input-${MantineSize}` | (string & {}) | number

  /**
   * Key of `theme.colors` or any valid CSS color.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Gradient values used with `variant="gradient"`.
   *
   * @default theme.defaultGradient
   */
  gradient?: MantineGradient

  /**
   * Sets `disabled` attribute, prevents interactions
   *
   * @default false
   */
  disabled?: boolean

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: ActionIconVariant

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string
}

export interface ActionIconProps
  extends Omit<BoxProps, keyof ActionIconOwnProps>, ActionIconOwnProps {}

export interface ActionIconSlots {
  default?: () => VNodeChild
}
export type ActionIconStylesNames = 'root' | 'loader' | 'icon'
export type ActionIconCssVariables = {
  root:
    | '--ai-radius'
    | '--ai-size'
    | '--ai-bg'
    | '--ai-hover'
    | '--ai-hover-color'
    | '--ai-color'
    | '--ai-bd'
}
