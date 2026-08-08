import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, MantineNode, SectionSlots } from '../../../core'

export type TabsTabStylesNames = 'tab' | 'tabSection' | 'tabLabel'

export interface TabsTabSlots extends SectionSlots {
  /** Tab label. */
  default?: () => VNodeChild
}

/** Props declared by `TabsTab` itself. See `TabsTabProps` for the full public type. */
export interface TabsTabOwnProps {
  /** Value of the associated panel. */
  value: string

  /**
   * Content displayed on the right side of the label.
   * Can also be set with the `rightSection` slot – the slot takes precedence.
   */
  rightSection?: MantineNode

  /**
   * Content displayed on the left side of the label.
   * Can also be set with the `leftSection` slot – the slot takes precedence.
   */
  leftSection?: MantineNode

  /** Key of `theme.colors` or any valid CSS color, controls tab color based on `variant`. */
  color?: MantineColor

  /**
   * If set, the tab cannot be activated and is skipped by keyboard navigation.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Value of the `tabindex` attribute. Resolved from the active state when not set.
   */
  tabIndex?: number

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to the compound selectors the tab renders. */
  classNames?: Partial<Record<TabsTabStylesNames, string>> | ((...args: any[]) => any)

  /** Inline styles applied to the compound selectors the tab renders. */
  styles?: Partial<Record<TabsTabStylesNames, any>> | ((...args: any[]) => any)
}

export interface TabsTabProps extends Omit<BoxProps, keyof TabsTabOwnProps>, TabsTabOwnProps {}

export interface TabsTabEmits {
  /** Emitted when the tab is clicked, before the associated panel is activated. */
  click: [event: MouseEvent]

  /** Emitted on keydown, before the built-in arrow key navigation runs. */
  keydown: [event: KeyboardEvent]
}
