import type { VNodeChild } from 'vue'
import type { PopoverDropdownProps } from '../../Popover'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverCardDropdownOwnProps {}

/** Full public props accepted by `HoverCardDropdown`. */
export interface HoverCardDropdownProps
  extends Omit<PopoverDropdownProps, keyof HoverCardDropdownOwnProps>, HoverCardDropdownOwnProps {}

export interface HoverCardDropdownSlots {
  /** Dropdown content. */
  default?: () => VNodeChild
}
