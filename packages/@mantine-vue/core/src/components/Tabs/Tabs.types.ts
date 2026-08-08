import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, MantineRadius, StylesApiProps } from '../../core'

export type TabsStylesNames = 'root' | 'list' | 'panel' | 'tab' | 'tabSection' | 'tabLabel'

export type TabsVariant = 'default' | 'outline' | 'pills'

export type TabsCssVariables = {
  root: '--tabs-radius' | '--tabs-color' | '--tabs-text-color'
}

export interface TabsSlots {
  /** `Tabs.List` and `Tabs.Panel` children. */
  default?: () => VNodeChild
}

/** Props declared by `Tabs` itself. See `TabsProps` for the full public type. */
export interface TabsOwnProps extends StylesApiProps<TabsProps> {
  /** Value of the active tab, bound with `v-model`. */
  modelValue?: string | null

  /** Uncontrolled initial active tab. */
  defaultValue?: string | null

  /**
   * Direction the tabs are laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal'

  /**
   * Side the list is rendered on when the orientation is vertical.
   *
   * @default 'left'
   */
  placement?: 'left' | 'right'

  /** Base `id` used to connect each tab with its panel. Generated when not set. */
  id?: string

  /**
   * If set, arrow key navigation wraps from the last tab to the first and back.
   *
   * @default true
   */
  loop?: boolean

  /**
   * If set, moving to a tab with the keyboard activates it immediately.
   *
   * @default true
   */
  activateTabWithKeyboard?: boolean

  /**
   * If set, clicking the active tab deactivates it and no panel is shown.
   *
   * @default false
   */
  allowTabDeactivation?: boolean

  /**
   * Controls the visual representation of the tabs.
   *
   * @default 'default'
   */
  variant?: TabsVariant

  /**
   * Key of `theme.colors` or any valid CSS color of the active tab.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: MantineRadius

  /**
   * If set, the list is rendered below the panels.
   *
   * @default false
   */
  inverted?: boolean

  /**
   * If set, the content of inactive panels stays mounted.
   *
   * @default true
   */
  keepMounted?: boolean

  /** If set, adjusts text color based on background color for the active tab. */
  autoContrast?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface TabsProps extends Omit<BoxProps, keyof TabsOwnProps>, TabsOwnProps {}

export interface TabsEmits {
  /** Emitted with the value of the tab that was activated, or `null` when deactivated, bound with `v-model`. */
  'update:modelValue': [value: string | null]

  /** Emitted with the value of the tab that was activated, or `null` when deactivated. */
  change: [value: string | null]
}
