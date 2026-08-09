import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../core'

export type MenubarStylesNames = 'root' | 'target'

export interface MenubarSlots {
  /** `Menubar.Menu` children. Each is assigned its index automatically. */
  default?: () => VNodeChild
}

/** Props declared by `Menubar` itself. See `MenubarProps` for the full public type. */
export interface MenubarOwnProps extends StylesApiProps<MenubarProps> {
  /** Index of the controlled opened menu; `null` closes all menus. Bound with `v-model:openIndex`. */
  openIndex?: number | null

  /**
   * Index of the menu opened initially in uncontrolled mode.
   *
   * @default null
   */
  defaultOpenIndex?: number | null

  /**
   * Event that opens a menu when none is open. `'click'` opens on target click and then
   * switches menus on hover, the desktop application pattern; `'hover'` opens on hover.
   *
   * @default 'click'
   */
  trigger?: 'click' | 'hover'

  /**
   * If set, arrow key navigation wraps from the last menu to the first and back.
   *
   * @default true
   */
  loop?: boolean

  /**
   * Dropdown position relative to the target element.
   *
   * @default 'bottom-start'
   */
  position?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface MenubarProps extends Omit<BoxProps, keyof MenubarOwnProps>, MenubarOwnProps {}
