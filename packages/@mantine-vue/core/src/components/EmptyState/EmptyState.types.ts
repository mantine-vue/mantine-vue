import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineSize,
  StylesApiProps,
} from '../../core'

export type EmptyStateStylesNames =
  | 'root'
  | 'body'
  | 'indicator'
  | 'title'
  | 'description'
  | 'actions'

export type EmptyStateVariant = 'filled' | 'light'

export type EmptyStateCssVariables = {
  root:
    | '--empty-state-indicator-size'
    | '--empty-state-gap'
    | '--empty-state-title-fz'
    | '--empty-state-description-fz'
    | '--empty-state-indicator-bg'
    | '--empty-state-indicator-color'
}

export interface EmptyStateSlots {
  /** Extra content rendered in the body, usually `EmptyState.Actions`. */
  default?: () => VNodeChild

  /** Icon or illustration rendered inside `EmptyState.Indicator`. */
  icon?: () => VNodeChild

  /** Title rendered inside `EmptyState.Title`. */
  title?: () => VNodeChild

  /** Description rendered inside `EmptyState.Description`. */
  description?: () => VNodeChild
}

/** Props declared by `EmptyState` itself. See `EmptyStateProps` for the full public type. */
export interface EmptyStateOwnProps extends StylesApiProps<EmptyStateProps> {
  /**
   * Controls the indicator size, the gap between elements and the font sizes of the
   * title and the description.
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {})

  /**
   * Content alignment. `center` stacks the content in a centered column, `left` and
   * `right` place the indicator on the side with the content next to it.
   *
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Controls the indicator appearance. `filled` and `light` render a colored circular
   * background behind the icon. Without it the icon is rendered with a dimmed color.
   */
  variant?: EmptyStateVariant | (string & {})

  /**
   * Key of `theme.colors` or any valid CSS color used by the `filled` and `light`
   * variants.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Title content, rendered inside `EmptyState.Title`.
   * Can also be set with the `title` slot – the slot takes precedence.
   */
  title?: MantineNode

  /**
   * Description content, rendered inside `EmptyState.Description`.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Icon or illustration, rendered inside `EmptyState.Indicator`.
   * Can also be set with the `icon` slot – the slot takes precedence.
   */
  icon?: MantineNode

  /**
   * If set, a neutral circular background is rendered behind the indicator. Setting
   * `variant` always renders a colored background regardless of this prop.
   *
   * @default false
   */
  withIndicatorBackground?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface EmptyStateProps
  extends Omit<BoxProps, keyof EmptyStateOwnProps>, EmptyStateOwnProps {}
