import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../../core'

export type CheckboxIndicatorVariant = 'filled' | 'outline'

/** Props declared by `CheckboxIndicator` itself. See `CheckboxIndicatorProps` for the full public type. */
export interface CheckboxIndicatorOwnProps extends StylesApiProps<CheckboxIndicatorProps> {
  /**
   * Key of `theme.colors` or any valid CSS color to set input background color in checked state
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls size of the component
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default 'sm'
   */
  radius?: MantineRadius

  /** Key of `theme.colors` or any valid CSS color to set icon color, by default value depends on `theme.autoContrast` */
  iconColor?: string

  /** If set, adjusts icon color based on background color for `filled` variant */
  autoContrast?: boolean

  /**
   * Indeterminate state of the checkbox. If set, `checked` prop is ignored.
   *
   * @default false
   */
  indeterminate?: boolean

  /** Icon for checked or indeterminate state */
  icon?: any

  /** Determines whether the component should have checked styles */
  checked?: boolean

  /**
   * Indicates disabled state
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'filled'
   */
  variant?: CheckboxIndicatorVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface CheckboxIndicatorSlots {
  /** Custom state icon. */
  icon?: (props: { indeterminate?: boolean; class?: any; style?: any }) => VNodeChild
}

export interface CheckboxIndicatorProps
  extends Omit<BoxProps, keyof CheckboxIndicatorOwnProps>, CheckboxIndicatorOwnProps {}
