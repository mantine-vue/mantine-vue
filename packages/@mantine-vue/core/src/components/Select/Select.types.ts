import type { VNodeChild } from 'vue'
import type { MantineNode, Primitive } from '../../core'
import type { ComboboxData, ComboboxItem, OptionsFilter } from '../Combobox'

export type SelectStylesNames = string

/** Payload passed to the `renderOption` prop and slot. */
export interface SelectOptionRenderPayload<Value extends Primitive = string> {
  /** Option the row is rendered for. */
  option: ComboboxItem<Value>

  /** Selected state of the option. */
  checked?: boolean
}

export interface SelectSlots {
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
  renderOption?: (input: SelectOptionRenderPayload) => VNodeChild

  /** Content rendered when no option matches the current search. */
  nothingFound?: () => VNodeChild

  /** Alias of the `nothingFound` slot. Takes precedence over it. */
  nothingFoundMessage?: () => VNodeChild
}

/**
 * Props declared by `Select` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface SelectProps<Value extends Primitive = string> {
  /** Selected value, bound with `v-model`. */
  modelValue?: Value | null

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: Value | null

  /**
   * Data used to generate the options.
   *
   * @default []
   */
  data?: ComboboxData<Value>

  /**
   * If set, the input can be typed into to filter the options.
   *
   * @default false
   */
  searchable?: boolean

  /** Search value, bound with `v-model:searchValue`. */
  searchValue?: string

  /** Uncontrolled initial search value. */
  defaultSearchValue?: string

  /**
   * If set, clicking the selected option deselects it.
   *
   * @default true
   */
  allowDeselect?: boolean

  /**
   * If set, a clear button is rendered when a value is selected.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * If set, a check icon is rendered next to the selected option.
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

  /**
   * Content rendered when no option matches the current search.
   * Can also be set with the `nothingFound` slot – the slot takes precedence.
   */
  nothingFoundMessage?: MantineNode

  /** Filters the options based on the current search. Uses a case-insensitive match when not set. */
  filter?: OptionsFilter<Value>

  /** Maximum number of options rendered at a time. All options are rendered when not set. */
  limit?: number

  /** Open state of the dropdown. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /**
   * If set, the first option is highlighted whenever the search changes.
   *
   * @default false
   */
  selectFirstOptionOnChange?: boolean

  /**
   * If set, the first option is highlighted when the dropdown opens, instead of the
   * currently selected one.
   *
   * @default false
   */
  selectFirstOptionOnDropdownOpen?: boolean

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

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: Record<string, any>

  /** Props passed down to the hidden input that carries the value in a form. */
  hiddenInputProps?: Record<string, any>

  /**
   * Custom markup for a dropdown option.
   * Can also be set with the scoped `renderOption` slot – the slot takes precedence.
   */
  renderOption?: (input: SelectOptionRenderPayload) => any

  /** Props passed down to the `ScrollArea.Autosize` of the dropdown. */
  scrollAreaProps?: Record<string, any>

  /**
   * If set, the highlighted option is selected when the input loses focus.
   *
   * @default false
   */
  autoSelectOnBlur?: boolean

  /**
   * If set, the dropdown opens when a searchable input receives focus.
   *
   * @default true
   */
  openOnFocus?: boolean

  /**
   * How the clear button and the right section share the right side of the input.
   * `both` keeps them side by side, `rightSection` and `clear` keep only one.
   */
  clearSectionMode?: 'both' | 'rightSection' | 'clear'

  /** Key of `theme.colors` or any valid CSS color used by the chevron. */
  chevronColor?: string

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}

export interface SelectEmits<Value extends Primitive = string> {
  /** Emitted with the next value when the selection changes, bound with `v-model`. */
  'update:modelValue': [value: Value | null]

  /** Emitted with the next value and the matching option when the selection changes. */
  change: [value: Value | null, option: ComboboxItem<Value> | null]

  /** Emitted with the next search value, bound with `v-model:searchValue`. */
  'update:searchValue': [value: string]

  /** Emitted with the next search value when it changes. */
  'search-change': [value: string]

  /** Emitted when the value is cleared with the clear button. */
  clear: []

  /** Emitted when the dropdown opens. */
  'dropdown-open': []

  /** Emitted when the dropdown closes. */
  'dropdown-close': []

  /** Emitted with the option value when an option is submitted. */
  'option-submit': [value: Value]
}
