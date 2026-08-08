import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  StylesApiProps,
} from '../../core'

export type NotificationStylesNames =
  | 'root'
  | 'icon'
  | 'loader'
  | 'body'
  | 'title'
  | 'description'
  | 'closeButton'

/** Props declared by `Notification` itself. See `NotificationProps` for the full public type. */
export interface NotificationOwnProps extends StylesApiProps<NotificationProps> {
  /**
   * Controls icon background color or notification accent line color, key of `theme.colors` or any valid CSS color. When `icon` is provided, sets the icon background color. When no icon is provided, sets the colored accent line on the left.
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

  /** Notification icon, replaces color line */
  icon?: MantineNode

  /** Notification title, displayed above the message body */
  title?: MantineNode

  /**
   * If set, displays a `Loader` component instead of the icon. Takes precedence over the `icon` prop if both are provided.
   *
   * @default false
   */
  loading?: boolean

  /**
   * Adds border to the root element
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * If set, the close button is visible
   *
   * @default true
   */
  withCloseButton?: boolean

  /** Props passed down to the close button */
  closeButtonProps?: Record<string, any>

  /** Props passed down to the `Loader` component */
  loaderProps?: Record<string, any>

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface NotificationSlots {
  /** Notification description. */
  default?: () => VNodeChild
  /** Notification icon. Takes precedence over the `icon` prop. */
  icon?: () => VNodeChild
  /** Notification title. Takes precedence over the `title` prop. */
  title?: () => VNodeChild
}

export interface NotificationProps
  extends Omit<BoxProps, keyof NotificationOwnProps>, NotificationOwnProps {}
