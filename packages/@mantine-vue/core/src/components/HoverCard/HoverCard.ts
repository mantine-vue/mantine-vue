import HoverCardComponent from './HoverCard.vue'
import { HoverCardDropdown } from './HoverCardDropdown/HoverCardDropdown'
import { HoverCardGroup } from './HoverCardGroup/HoverCardGroup'
import { HoverCardTarget } from './HoverCardTarget/HoverCardTarget'

/** `Popover` whose open state is driven by hovering the target. */
export const HoverCard = Object.assign(HoverCardComponent, {
  Target: HoverCardTarget,
  Dropdown: HoverCardDropdown,
  Group: HoverCardGroup,
})

export type { HoverCardOwnProps, HoverCardProps, HoverCardSlots } from './HoverCard.types'
