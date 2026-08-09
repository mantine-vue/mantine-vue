import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, JustifyContent, StylesApiProps } from '../../../core'

export type TabsListStylesNames = 'list'

/** Props declared by `TabsList` itself. See `TabsListProps` for the full public type. */
export interface TabsListOwnProps {
  /**
   * Determines whether tabs should take all available space
   *
   * @default false
   */
  grow?: boolean

  /**
   * Tabs alignment
   *
   * @default flex-start
   */
  justify?: JustifyContent

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Tabs elements. */
  classNames?: StylesApiProps<TabsListProps>['classNames']

  /** Inline styles applied to Tabs elements. */
  styles?: StylesApiProps<TabsListProps>['styles']
}

export interface TabsListSlots {
  /** Tab controls. */
  default?: () => VNodeChild
}

export interface TabsListProps extends Omit<BoxProps, keyof TabsListOwnProps>, TabsListOwnProps {}
