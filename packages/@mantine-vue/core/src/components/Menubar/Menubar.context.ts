import type { Ref } from 'vue'
import { createSafeContext } from '../../core'

export interface MenubarContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any

  /** Unique id of the menubar instance, used to scope dropdown lookups across multiple menubars */
  id: string

  /** Revision counter bumped whenever the set of targets changes, used by menus to recompute their DOM index */
  revision: Ref<number>

  /** Index of the currently opened menu, `null` when all menus are closed */
  readonly openIndex: number | null

  /** Opens the menu at the given index, `null` closes all menus */
  setOpenIndex: (index: number | null) => void

  /** Opens the menu at the given index and records whether it was opened by click or hover */
  openMenu: (index: number, source: 'click' | 'hover') => void

  /** Closes all menus */
  closeMenu: () => void

  /** Schedules a delayed close, used by hover trigger when the pointer leaves the bar */
  scheduleClose: () => void

  /** Cancels a pending delayed close */
  cancelClose: () => void

  /** Returns how the currently opened menu was opened */
  getOpenSource: () => 'click' | 'hover' | null

  /** Returns the previously opened menu index, used to skip transitions when switching menus */
  getPreviousOpenIndex: () => number | null

  /** Index of the menu that currently holds the single menubar tab stop */
  readonly activeIndex: number

  /** Sets the roving tabindex to the given menu index */
  setActiveIndex: (index: number) => void

  readonly trigger: 'click' | 'hover'
  readonly loop: boolean
  readonly position: string
  readonly unstyled: boolean | undefined

  /** Returns the DOM-order index of a `Menubar.Menu` by its id */
  getMenuIndex: (id: string) => number

  /** Returns all top-level target buttons in DOM order */
  getTargets: () => HTMLButtonElement[]

  /** Returns the indexes of the enabled top-level targets in DOM order */
  getEnabledIndexes: () => number[]

  /** Returns the index of the next/previous enabled target relative to `current` */
  getAdjacentIndex: (current: number, direction: 1 | -1) => number

  /** Focuses the top-level target at the given index */
  focusTarget: (index: number) => void

  /** Focuses the first or last item of the (opened) menu at the given index */
  focusMenuItem: (index: number, position: 'first' | 'last') => void
}

export const [provideMenubarContext, useMenubarContext] = createSafeContext<MenubarContextValue>(
  'Menubar component was not found in the tree',
)

export interface MenubarMenuContextValue {
  readonly id: string
  readonly index: number
  readonly opened: boolean
}

export const [provideMenubarMenuContext, useMenubarMenuContext] =
  createSafeContext<MenubarMenuContextValue>('Menubar.Menu component was not found in the tree')
