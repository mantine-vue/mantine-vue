import type { VNodeChild } from 'vue'
import type { MenuDropdownProps } from '../../Menu'

/** Props declared by a menubar dropdown itself. */
export interface MenubarDropdownOwnProps {
  /** Called before the built-in keyboard navigation handler. */
  onKeydown?: (event: KeyboardEvent) => void

  /** Called before the built-in pointer-enter handler. */
  onMouseenter?: (event: MouseEvent) => void

  /** Called before the built-in pointer-leave handler. */
  onMouseleave?: (event: MouseEvent) => void
}

/** Full public props accepted by a menubar dropdown. */
export interface MenubarDropdownProps
  extends Omit<MenuDropdownProps, keyof MenubarDropdownOwnProps>, MenubarDropdownOwnProps {}

export interface MenubarDropdownSlots {
  /** Dropdown content. */
  default?: () => VNodeChild
}
