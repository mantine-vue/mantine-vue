import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../../core'

export type InputPlaceholderStylesNames = 'placeholder'

/** Props declared by `InputPlaceholder` itself. See `InputPlaceholderProps` for the full public type. */
export interface InputPlaceholderOwnProps {
  /**
   * If set, the placeholder has error styles
   *
   * @default false
   */
  error?: any

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to the placeholder. */
  classNames?: StylesApiProps<InputPlaceholderProps>['classNames']

  /** Inline styles applied to the placeholder. */
  styles?: StylesApiProps<InputPlaceholderProps>['styles']

  /** Removes default placeholder styles. */
  unstyled?: boolean
}

export interface InputPlaceholderSlots {
  /** Placeholder content. */
  default?: () => VNodeChild
}

export interface InputPlaceholderProps
  extends Omit<BoxProps, keyof InputPlaceholderOwnProps>, InputPlaceholderOwnProps {}
