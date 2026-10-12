import { createSafeContext } from '../../core'
export interface HoverCardContextValue {
  openDropdown: () => void
  closeDropdown: () => void
  assignTarget: (node: HTMLElement | null) => void
  opened: boolean
  events: { hover: boolean; focus: boolean; touch: boolean }
  interactive: boolean
  role: 'dialog' | 'tooltip'
  withRoles: boolean
  dropdownId: string
  closeImmediately: () => void
  dismiss: () => void
}
export const [provideHoverCardContext, useHoverCardContext] =
  createSafeContext<HoverCardContextValue>('HoverCard component was not found in the tree')
