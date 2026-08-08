import HoverCardGroupComponent from './HoverCardGroup.vue'

/** Shares open and close delays with every descendant `HoverCard`. */
export const HoverCardGroup = HoverCardGroupComponent

export { HoverCardGroupKey } from './HoverCardGroup.context'
export type {
  HoverCardGroupContextValue,
  HoverCardGroupProps,
  HoverCardGroupSlots,
} from './HoverCardGroup.types'
