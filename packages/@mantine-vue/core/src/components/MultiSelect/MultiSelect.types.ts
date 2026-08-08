import type { VNodeChild } from 'vue'
import type { Primitive } from '../../core'
import type { ComboboxData, ComboboxStylesNames, OptionsFilter } from '../Combobox'
import type { PillGroupStylesNames } from '../Pill'
import type { PillsInputFieldStylesNames } from '../PillsInput/PillsInputField/PillsInputField.types'
import type { PillsInputStylesNames } from '../PillsInput'

export type MultiSelectStylesNames =
  | PillsInputStylesNames
  | ComboboxStylesNames
  | PillGroupStylesNames
  | PillsInputFieldStylesNames

/** Payload passed to the `renderOption` prop and slot. */
export interface MultiSelectOptionRenderPayload {
  /** Option the row is rendered for. */
  option: any

  /** Selected state of the option. */
  checked?: boolean
}

/** Payload passed to the `renderPill` prop and slot. */
export interface MultiSelectPillRenderPayload {
  /** Option the pill was created from. */
  option: any

  /** Value of the pill. */
  value: Primitive

  /** Removes this value from the selection. */
  onRemove: () => void

  /** Disabled state of the input. */
  disabled: boolean
}

export interface MultiSelectSlots {
  /** Input label. */
  label?: () => VNodeChild

  /** Description rendered below the label. */
  description?: () => VNodeChild

  /** Error message rendered below the input. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side of the input. */
  rightSection?: () => VNodeChild

  /** Custom markup for a dropdown option. Takes precedence over the `renderOption` prop. */
  renderOption?: (input: MultiSelectOptionRenderPayload) => VNodeChild

  /** Custom markup for a selected value pill. Takes precedence over the `renderPill` prop. */
  renderPill?: (input: MultiSelectPillRenderPayload) => VNodeChild

  /** Content rendered when no option matches the current search. */
  nothingFound?: () => VNodeChild

  /** Alias of the `nothingFound` slot. Takes precedence over it. */
  nothingFoundMessage?: () => VNodeChild
}

/**
 * Props declared by `MultiSelect` itself.
 *
 * Every prop of `PillsInput` is also accepted and forwarded to the underlying input.
 */
export interface MultiSelectProps<Value extends Primitive = string> {
  /** Selected values, bound with `v-model`. */
  modelValue?: Value[]

  /**
   * Uncontrolled initial values.
   *
   * @default []
   */
  defaultValue?: Value[]

  /**
   * Data used to generate the options.
   *
   * @default []
   */
  data?: ComboboxData<Value>

  /**
   * Maximum number of values that can be selected.
   *
   * @default Infinity
   */
  maxValues?: number

  /**
   * If set, the input can be typed into to filter the options.
   *
   * @default false
   */
  searchable?: boolean

  /**
   * If set, already selected options are removed from the dropdown.
   *
   * @default false
   */
  hidePickedOptions?: boolean

  /** Search value, bound with `v-model:searchValue`. */
  searchValue?: string

  /** Uncontrolled initial search value. */
  defaultSearchValue?: string

  /** Called with the next search value when it changes. */
  onSearchChange?: (value: string) => void

  /**
   * If set, a clear button is rendered when at least one value is selected.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * If set, the search is reset whenever the selection changes.
   *
   * @default true
   */
  clearSearchOnChange?: boolean

  /**
   * Separator used to join the values in the hidden input.
   *
   * @default ','
   */
  hiddenInputValuesDivider?: string

  /**
   * Content rendered when no option matches the current search.
   * Can also be set with the `nothingFound` slot – the slot takes precedence over the prop.
   */
  nothingFoundMessage?: any

  /**
   * If set, a check icon is rendered next to the selected options.
   *
   * @default true
   */
  withCheckIcon?: boolean

  /**
   * If set, unselected options reserve the space of the check icon so all labels line up.
   *
   * @default false
   */
  withAlignedLabels?: boolean

  /**
   * Side of the option the check icon is rendered on.
   *
   * @default 'left'
   */
  checkIconPosition?: 'left' | 'right'

  /** Filters the options based on the current search. Uses a case-insensitive match when not set. */
  filter?: OptionsFilter<Value>

  /** Maximum number of options rendered at a time. All options are rendered when not set. */
  limit?: number

  /**
   * If set, the dropdown is rendered inside a `ScrollArea.Autosize`.
   *
   * @default true
   */
  withScrollArea?: boolean

  /**
   * `max-height` of the dropdown. Only used when `withScrollArea` is set.
   *
   * @default 220
   */
  maxDropdownHeight?: number | string

  /** Open state of the dropdown. Bound with `v-model:dropdownOpened`. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: Record<string, any>

  /** Props passed down to the hidden input that carries the values in a form. */
  hiddenInputProps?: Record<string, any>

  /**
   * Custom markup for a dropdown option.
   * Can also be set with the scoped `renderOption` slot – the slot takes precedence over the prop.
   */
  renderOption?: (input: MultiSelectOptionRenderPayload) => any

  /**
   * Custom markup for a selected value pill.
   * Can also be set with the scoped `renderPill` slot – the slot takes precedence over the prop.
   */
  renderPill?: (input: MultiSelectPillRenderPayload) => any

  /** Props passed down to the `ScrollArea.Autosize` of the dropdown. */
  scrollAreaProps?: Record<string, any>

  /**
   * If set, the dropdown opens when a searchable input receives focus.
   *
   * @default true
   */
  openOnFocus?: boolean

  /**
   * If set, the first option is highlighted when the dropdown opens.
   *
   * @default false
   */
  selectFirstOptionOnDropdownOpen?: boolean

  /** Any other prop is forwarded to the underlying `PillsInput`. */
  [key: string]: any
}
