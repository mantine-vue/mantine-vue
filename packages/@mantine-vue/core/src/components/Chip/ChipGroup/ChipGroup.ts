import ChipGroupComponent from './ChipGroup.vue'

/** Manages the selected state of a set of `Chip` components. */
export const ChipGroup = ChipGroupComponent

export { ChipGroupContextKey, useChipGroupContext } from './ChipGroup.context'
export type {
  ChipGroupContextValue,
  ChipGroupProps,
  ChipGroupSlots,
  ChipGroupValue,
} from './ChipGroup.types'
