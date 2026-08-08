import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../../core'

/** Props declared by `CardSection` itself. See `CardSectionProps` for the full public type. */
export interface CardSectionOwnProps {
  /**
   * Root element or component rendered by `CardSection`.
   *
   * @default 'div'
   */
  component?: string

  /**
   * Adds border to the root element
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * If set, the section inherits padding from the parent `Card`
   *
   * @default false
   */
  inheritPadding?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Card elements. */
  classNames?: StylesApiProps<CardSectionProps>['classNames']

  /** Inline styles applied to Card elements. */
  styles?: StylesApiProps<CardSectionProps>['styles']

  /** CSS variables applied to Card elements. */
  vars?: StylesApiProps<CardSectionProps>['vars']
}

export interface CardSectionSlots {
  /** Section content. */
  default?: () => VNodeChild
}

export interface CardSectionProps
  extends Omit<BoxProps, keyof CardSectionOwnProps>, CardSectionOwnProps {}
