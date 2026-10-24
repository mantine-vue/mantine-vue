import type { VNodeChild } from 'vue'
import type { TransitionOverride } from '../../Transition'

export interface MenubarMenuSlots {
  /** `Menubar.Target` and `Menubar.Dropdown` of this menu. */
  default?: () => VNodeChild
}

/** Props declared by `MenubarMenu` itself. */
export interface MenubarMenuProps {
  /** Props passed down to the underlying transition. */
  transitionProps?: TransitionOverride

  /**
   * Position of this menu within the menubar, assigned by the parent `Menubar`.
   *
   * @default -1
   */
  __index?: number
}
