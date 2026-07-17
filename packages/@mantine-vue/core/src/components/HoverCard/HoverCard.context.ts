import { createSafeContext } from '../../core'
export interface HoverCardContextValue {
  openDropdown: () => void
  closeDropdown: () => void
  assignTarget: (node: HTMLElement | null) => void
}
export const [provideHoverCardContext, useHoverCardContext] =
  createSafeContext<HoverCardContextValue>('HoverCard component was not found in the tree')
