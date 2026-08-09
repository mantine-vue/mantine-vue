import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineNode, MantineRadius, StylesApiProps } from '../../core'

export type AlertStylesNames =
  | 'root'
  | 'wrapper'
  | 'body'
  | 'title'
  | 'label'
  | 'message'
  | 'icon'
  | 'closeButton'

export type AlertVariant = 'filled' | 'light' | 'outline' | 'default' | 'transparent' | 'white'

export type AlertCssVariables = {
  root: '--alert-radius' | '--alert-bg' | '--alert-color' | '--alert-bd'
}

export interface AlertSlots {
  /** Alert message. */
  default?: () => VNodeChild

  /** Alert title. Takes precedence over the `title` prop when both are set. */
  title?: () => VNodeChild

  /** Icon displayed next to the title. Takes precedence over the `icon` prop. */
  icon?: () => VNodeChild
}

/** Props declared by `Alert` itself. See `AlertProps` for the full public type. */
export interface AlertOwnProps extends StylesApiProps<AlertProps> {
  /**
   * Id used to connect the root element with its title and message through
   * `aria-labelledby` and `aria-describedby`. Generated automatically when not set.
   */
  id?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius.
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Alert title.
   * Can also be set with the `title` slot – the slot takes precedence over the prop.
   */
  title?: MantineNode

  /**
   * Icon displayed next to the title.
   * Can also be set with the `icon` slot – the slot takes precedence over the prop.
   */
  icon?: MantineNode

  /**
   * Determines whether close button should be displayed.
   * @default false
   */
  withCloseButton?: boolean

  /** Close button `aria-label`. */
  closeButtonLabel?: string

  /**
   * If set, adjusts text color based on background color for `filled` variant.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Controls visual representation of the alert.
   * @default 'light'
   */
  variant?: AlertVariant

  /**
   * Value of the `role` attribute set on the root element.
   * @default 'alert'
   */
  role?: string
}

export interface AlertProps extends Omit<BoxProps, keyof AlertOwnProps>, AlertOwnProps {}
