import type { CSSProperties, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineNode,
  MantineRadius,
  MantineSize,
  MantineVariant,
  StylesApiProps,
} from '../../core'

export type ButtonSize = MantineSize | `compact-${MantineSize}` | (string & {})

export type ButtonVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient'

export type ButtonStylesNames = 'root' | 'inner' | 'loader' | 'section' | 'label'

export type ButtonCssVariables = {
  root:
    | '--button-justify'
    | '--button-height'
    | '--button-padding-x'
    | '--button-fz'
    | '--button-radius'
    | '--button-bg'
    | '--button-hover'
    | '--button-color'
    | '--button-bd'
    | '--button-hover-color'
}

export interface ButtonSlots {
  /** Button label. */
  default?: () => VNodeChild

  /** Content on the left side of the label. Takes precedence over the `leftSection` prop. */
  leftSection?: () => VNodeChild

  /** Content on the right side of the label. Takes precedence over the `rightSection` prop. */
  rightSection?: () => VNodeChild
}

/** Props declared by `Button` itself. See `ButtonProps` for the full public type. */
export interface ButtonOwnProps extends StylesApiProps<ButtonProps> {
  /**
   * Controls the `height`, `font-size` and horizontal `padding` of the button.
   *
   * @default 'sm'
   */
  size?: ButtonSize

  /**
   * Key of `theme.colors` or any valid CSS color.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Sets `justify-content` of the `inner` element.
   *
   * @default 'center'
   */
  justify?: CSSProperties['justifyContent']

  /**
   * Content on the left side of the label.
   * Can also be set with the `leftSection` slot – the slot takes precedence.
   */
  leftSection?: MantineNode

  /**
   * Content on the right side of the label.
   * Can also be set with the `rightSection` slot – the slot takes precedence.
   */
  rightSection?: MantineNode

  /**
   * If set, the button takes the full width of its container.
   *
   * @default false
   */
  fullWidth?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: MantineRadius

  /** Gradient configuration used when `variant` is `gradient`. */
  gradient?: MantineGradient

  /**
   * Sets the `disabled` attribute and applies disabled styles.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, a `Loader` is rendered over the label and the button is disabled.
   *
   * @default false
   */
  loading?: boolean

  /** Props passed down to the `Loader`. Only used when `loading` is set. */
  loaderProps?: Record<string, any>

  /**
   * If set, adjusts the text color based on the background color for the `filled` variant.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Element or component rendered as the root.
   *
   * @default 'button'
   */
  component?: any

  /**
   * Controls the visual representation of the button.
   *
   * @default 'filled'
   */
  variant?: MantineVariant<ButtonVariant>

  /**
   * Applies disabled styles without setting the `disabled` attribute, which keeps the
   * button focusable and able to show a tooltip.
   *
   * @default false
   */
  'data-disabled'?: boolean

  /** camelCase alias of `data-disabled`, for use where a hyphenated prop is inconvenient. */
  dataDisabled?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ButtonProps extends Omit<BoxProps, keyof ButtonOwnProps>, ButtonOwnProps {}
