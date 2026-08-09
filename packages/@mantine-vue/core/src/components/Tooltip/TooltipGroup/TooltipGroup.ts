import TooltipGroupComponent from './TooltipGroup.vue'

/** Shares open and close delays with every descendant `Tooltip`. */
export const TooltipGroup = TooltipGroupComponent

export { TooltipGroupKey } from './TooltipGroup.context'
export type {
  TooltipGroupContextValue,
  TooltipGroupProps,
  TooltipGroupSlots,
} from './TooltipGroup.types'
