import { inject, provide, type InjectionKey } from 'vue'
import { createSafeContext } from '../../core'

export interface DrawerContextValue {
  /** Styles API accessor of the owning `Drawer.Root`. */
  getStyles: any

  /** `border-radius` of the drawer, forwarded to the content. */
  radius?: string | number

  /** Component used to render the scrollable area of the content. */
  scrollAreaComponent?: any
}

export const [provideDrawerContext, useDrawerContext] = createSafeContext<DrawerContextValue>(
  'Drawer component was not found in tree',
)

export interface DrawerStackContextValue {
  /** Ids of the drawers currently open, in the order they were opened. */
  stack: string[]

  /** Adds a drawer to the stack. */
  addModal: (id: string, zIndex: string | number) => void

  /** Removes a drawer from the stack. */
  removeModal: (id: string) => void

  /** `z-index` of a drawer, derived from its position in the stack. */
  getZIndex: (id: string) => string

  /** Id of the drawer on top of the stack. */
  currentId: string

  /** Highest `z-index` any drawer of the stack has asked for. */
  maxZIndex: string | number
}

export const DrawerStackContextKey: InjectionKey<DrawerStackContextValue> =
  Symbol('DrawerStackContext')

/** Returns `null` outside a `Drawer.Stack`, which is the normal case for a lone drawer. */
export function useDrawerStackContext(): DrawerStackContextValue | null {
  return inject(DrawerStackContextKey, null)
}

export function provideDrawerStackContext(value: DrawerStackContextValue) {
  provide(DrawerStackContextKey, value)
}
