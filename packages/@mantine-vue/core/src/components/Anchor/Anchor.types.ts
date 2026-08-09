import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'
import type { TextVariant } from '../Text/Text'

export type AnchorVariant = TextVariant

/** Props declared by `Anchor` itself. See `AnchorProps` for the full public type. */
export interface AnchorOwnProps extends StylesApiProps<AnchorProps> {
  /**
   * Root element or component rendered by `Anchor`.
   *
   * @default 'a'
   */
  component?: string

  /**
   * Defines when `text-decoration: underline` styles are applied.
   *
   * @default 'hover'
   */
  underline?: 'always' | 'hover' | 'not-hover' | 'never'

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: AnchorVariant
}

export interface AnchorProps extends Omit<BoxProps, keyof AnchorOwnProps>, AnchorOwnProps {}

export interface AnchorSlots {
  /** Link content. */
  default?: () => VNodeChild
}
