import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps } from '../../core'

export type SpoilerStylesNames = 'root' | 'control' | 'content'

export type SpoilerCssVariables = {
  root: '--spoiler-transition-duration'
}

export interface SpoilerSlots {
  /** Content that is hidden behind the spoiler. */
  default?: () => VNodeChild

  /** Toggle button content while the content is collapsed. Takes precedence over the `showLabel` prop. */
  showLabel?: () => VNodeChild

  /** Toggle button content while the content is expanded. Takes precedence over the `hideLabel` prop. */
  hideLabel?: () => VNodeChild
}

/** Props declared by `Spoiler` itself. See `SpoilerProps` for the full public type. */
export interface SpoilerOwnProps extends StylesApiProps<SpoilerProps> {
  /**
   * Maximum height of visible content in px. When content exceeds this height,
   * the toggle control appears.
   * @default 100
   */
  maxHeight?: number

  /**
   * Content displayed in the toggle button when content is collapsed (to expand).
   * Can also be set with the `showLabel` slot – the slot takes precedence.
   */
  showLabel?: MantineNode

  /**
   * Content displayed in the toggle button when content is expanded (to collapse).
   * Can also be set with the `hideLabel` slot – the slot takes precedence.
   */
  hideLabel?: MantineNode

  /**
   * Initial expanded state in uncontrolled mode. If `true`, content starts
   * expanded. If `false`, content starts collapsed.
   * @default false
   */
  defaultExpanded?: boolean

  /** Controlled expanded state, bound with `v-model:expanded`. */
  expanded?: boolean

  /** Spoiler reveal transition duration in ms. Set to 0 to disable animation. */
  transitionDuration?: number

  /** Accessible label for the toggle button when collapsed. If not set, `showLabel` is used. */
  showAriaLabel?: string

  /** Accessible label for the toggle button when expanded. If not set, `hideLabel` is used. */
  hideAriaLabel?: string

  /**
   * Id used to connect the toggle button with the content region through
   * `aria-controls`. Generated automatically when not set.
   */
  id?: string
}

export interface SpoilerProps extends Omit<BoxProps, keyof SpoilerOwnProps>, SpoilerOwnProps {}

export interface SpoilerEmits {
  /** Emitted when expanded state changes, bound with `v-model:expanded`. */
  'update:expanded': [expanded: boolean]
}
