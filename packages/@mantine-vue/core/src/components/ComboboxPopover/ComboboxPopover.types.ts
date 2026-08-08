import type { VNodeChild } from 'vue'
import type { MantineNode, Primitive, StylesApiProps } from '../../core'
import type {
  ComboboxData,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  ComboboxProps,
  ComboboxStylesNames,
  OptionsFilter,
} from '../Combobox'

export type ComboboxPopoverValue<
  Multiple extends boolean,
  Value extends Primitive = string,
> = Multiple extends true ? Value[] : Value | null

export type ComboboxPopoverStylesNames = ComboboxStylesNames

export interface ComboboxPopoverProps<
  Multiple extends boolean = false,
  Value extends Primitive = string,
> extends StylesApiProps<ComboboxPopoverProps<Multiple, Value>> {
  /** If set, multiple items can be selected at the same time */
  multiple?: Multiple

  /** Controlled component value, bound with `v-model`. */
  modelValue?: ComboboxPopoverValue<Multiple, Value>

  /** Uncontrolled component default value */
  defaultValue?: ComboboxPopoverValue<Multiple, Value>

  /** Data used to generate options */
  data?: ComboboxData<Value>

  /** Controlled dropdown opened state */
  dropdownOpened?: boolean

  /** Uncontrolled dropdown initial opened state */
  defaultDropdownOpened?: boolean

  /** Props passed down to Combobox component */
  comboboxProps?: ComboboxProps

  /** Function based on which items are filtered and sorted */
  filter?: OptionsFilter<Value>

  /** Maximum number of options displayed at a time @default Infinity */
  limit?: number

  /** Determines whether the options should be wrapped with ScrollArea.AutoSize @default true */
  withScrollArea?: boolean

  /** max-height of the dropdown @default 250 */
  maxDropdownHeight?: number | string

  /** If set, the first option is selected when dropdown opens @default false */
  selectFirstOptionOnDropdownOpen?: boolean

  /** Displays check icon near the selected option label @default true */
  withCheckIcon?: boolean

  /** Aligns unchecked labels with the checked one @default false */
  withAlignedLabels?: boolean

  /** Position of the check icon relative to the option label @default 'left' */
  checkIconPosition?: 'left' | 'right'

  /** Message displayed when no options match the search query or when there is no data. Can also be provided via the `#nothingFound` slot */
  nothingFoundMessage?: MantineNode

  /** Allows searching through options @default false */
  searchable?: boolean

  /** Controlled search value */
  searchValue?: string

  /** Default search value */
  defaultSearchValue?: string

  /** Allows deselecting the selected option by clicking it (only for single mode) @default true */
  allowDeselect?: boolean

  /** A function to render content of the option, replaces the default content of the option. Can also be provided via the `#option` slot */
  renderOption?: (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild

  /** Props passed down to the underlying ScrollArea component in the dropdown */
  scrollAreaProps?: Record<string, any>

  /** Props passed down to the hidden input */
  hiddenInputProps?: Record<string, any>

  /** Hidden input name for form submission */
  name?: string

  /** Hidden input form for form submission */
  form?: string

  /** Divider used to separate values in the hidden input value attribute @default ',' */
  hiddenInputValuesDivider?: string

  unstyled?: boolean
  [key: string]: any
}

export interface ComboboxPopoverSlots {
  /** Target element and any additional Combobox content */
  default?: () => VNodeChild
  /** Custom option content, alternative to the `renderOption` prop */
  option?: (input: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild
  /** Exact-name alias for the `renderOption` prop */
  renderOption?: (input: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild
  /** Custom "nothing found" content, alternative to the `nothingFoundMessage` prop */
  nothingFound?: () => VNodeChild
  /** Exact-name alias for the `nothingFoundMessage` prop */
  nothingFoundMessage?: () => VNodeChild
}
