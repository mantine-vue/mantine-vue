import type { VNodeChild } from 'vue'
import type { ComboboxGenericData, OptionsFilter } from '../Combobox'

export type AutocompleteStylesNames = string

/** Payload passed to the `renderOption` prop and slot. */
export interface AutocompleteOptionRenderPayload {
  /** Option the row is rendered for. */
  option: any

  /** Selected state of the option. */
  checked?: boolean
}

export type RenderAutocompleteOption = (input: AutocompleteOptionRenderPayload) => any

export interface AutocompleteSlots {
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
  renderOption?: (input: AutocompleteOptionRenderPayload) => VNodeChild

  /** Content rendered when no option matches the current search. */
  nothingFound?: () => VNodeChild
}

/**
 * Props declared by `Autocomplete` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface AutocompleteProps {
  /** Input value, bound with `v-model`. */
  modelValue?: string

  /**
   * Uncontrolled initial input value.
   *
   * @default ''
   */
  defaultValue?: string

  /**
   * Data used to generate the options.
   *
   * @default []
   */
  data?: ComboboxGenericData

  /** Open state of the dropdown. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /**
   * If set, the first option is highlighted whenever the value changes.
   *
   * @default false
   */
  selectFirstOptionOnChange?: boolean

  /**
   * If set, the first option is highlighted when the dropdown opens.
   *
   * @default false
   */
  selectFirstOptionOnDropdownOpen?: boolean

  /** Filters the options based on the current search. Uses a case-insensitive match when not set. */
  filter?: OptionsFilter<any>

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
   * @default 250
   */
  maxDropdownHeight?: number | string

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: Record<string, any>

  /**
   * Custom markup for a dropdown option.
   * Can also be set with the scoped `renderOption` slot – the slot takes precedence.
   */
  renderOption?: RenderAutocompleteOption

  /** Props passed down to the `ScrollArea.Autosize` of the dropdown. */
  scrollAreaProps?: Record<string, any>

  /**
   * If set, a clear button is rendered in the right section when the input is not empty.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * If set, the highlighted option is selected when the input loses focus.
   *
   * @default false
   */
  autoSelectOnBlur?: boolean

  /**
   * If set, the dropdown opens when the input receives focus.
   *
   * @default true
   */
  openOnFocus?: boolean

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}
