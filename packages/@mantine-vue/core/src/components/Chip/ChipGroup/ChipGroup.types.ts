import type { VNodeChild } from 'vue'

/** Value held by a `Chip.Group`: an array in `multiple` mode, a single value otherwise. */
export type ChipGroupValue = string | null | string[]

export interface ChipGroupContextValue {
  /** Reports whether a given chip value is currently selected. */
  isChipSelected: (value: string) => boolean

  /** Called with a chip's change event when it is toggled. */
  onChange: (event: Event) => void

  /** Whether more than one chip can be selected at a time. */
  multiple?: boolean
}

export interface ChipGroupSlots {
  /** `Chip` components that belong to the group. */
  default?: () => VNodeChild
}

/** Props declared by `ChipGroup` itself. */
export interface ChipGroupProps {
  /**
   * If set, multiple chips can be selected at a time and the value is an array.
   *
   * @default false
   */
  multiple?: boolean

  /** Selected value, bound with `v-model`. */
  modelValue?: string | string[] | null

  /** Uncontrolled initial selected value. */
  defaultValue?: string | string[] | null
}
