import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineRadius, MantineSize, StylesApiProps } from '../../core'

export type CloseButtonVariant = 'subtle' | 'transparent'

/** Props declared by `CloseButton` itself. See `CloseButtonProps` for the full public type. */
export interface CloseButtonOwnProps extends StylesApiProps<CloseButtonProps> {
  /**
   * Root element or component rendered by `CloseButton`.
   *
   * @default 'button'
   */
  component?: string

  /**
   * Controls width and height of the button. Numbers are converted to rem.
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Sets `disabled` attribute, assigns disabled styles
   *
   * @default false
   */
  disabled?: boolean

  /**
   * `X` icon `width` and `height`
   *
   * @default 70%
   */
  iconSize?: string | number

  /** React node to replace the default close icon. If set, `iconSize` prop is ignored. */
  icon?: MantineNode

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'subtle'
   */
  variant?: CloseButtonVariant

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string
}

export interface CloseButtonSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Close icon. Used when the `icon` prop is not set. */
  icon?: () => VNodeChild
}

export interface CloseButtonProps
  extends Omit<BoxProps, keyof CloseButtonOwnProps>, CloseButtonOwnProps {}
