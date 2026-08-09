import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineRadius,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
} from '../../core'
import type { AffixPosition } from '../Affix'
import type { MantineTransition } from '../Transition'

/** Props declared by `Dialog` itself. See `DialogProps` for the full public type. */
export interface DialogOwnProps extends StylesApiProps<DialogProps> {
  /** Opened state */
  opened: boolean

  /**
   * If set, the component uses `display: none` to hide the root element instead of removing the DOM node
   *
   * @default false
   */
  keepMounted?: boolean

  /**
   * If set, displays the close button
   *
   * @default false
   */
  withCloseButton?: boolean

  /**
   * Props passed down to the underlying `Transition` component
   *
   * @default { transition: 'pop-top-right', duration: 200 }
   */
  transitionProps?: {
    transition?: MantineTransition
    duration?: number
    keepMounted?: boolean
  }

  /**
   * Controls `width` of the dialog
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Root element `z-index` property
   *
   * @default 200
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
   * @default { bottom: 30, right: 30 }
   */
  position?: AffixPosition

  /**
   * Key of `theme.shadows` or any valid CSS value to set `box-shadow`
   *
   * @default 'md'
   */
  shadow?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius, numbers are converted to rem
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Adds border to the root element
   *
   * @default true
   */
  withBorder?: boolean

  /**
   * Padding, theme key: theme.spacing
   *
   * @default 'md'
   */
  p?: MantineSpacing
}

export interface DialogProps extends Omit<BoxProps, keyof DialogOwnProps>, DialogOwnProps {}

export interface DialogSlots {
  /** Dialog content. */
  default?: () => VNodeChild
}

export type DialogStylesNames = 'root' | 'closeButton'

export type DialogCssVariables = {
  root: '--dialog-size'
}
