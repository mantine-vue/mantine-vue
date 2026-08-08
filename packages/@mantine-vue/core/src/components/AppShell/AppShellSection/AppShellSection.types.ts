import type { Component, VNodeChild } from 'vue'
import type { BoxMod, BoxProps } from '../../../core'

/** Props declared by `AppShellSection` itself. See `AppShellSectionProps` for the full public type. */
export interface AppShellSectionOwnProps {
  /**
   * If set, the section expands to take all available space
   *
   * @default false
   */
  grow?: boolean

  /**
   * Root element or component rendered by `AppShellSection`.
   *
   * @default 'div'
   */
  component?: string | Component

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface AppShellSectionProps
  extends Omit<BoxProps, keyof AppShellSectionOwnProps>, AppShellSectionOwnProps {}

export interface AppShellSectionSlots {
  /** Section content. */
  default?: () => VNodeChild
}
