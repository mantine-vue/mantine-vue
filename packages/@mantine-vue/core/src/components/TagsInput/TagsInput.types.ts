import type { VNodeChild } from 'vue'
import type { MantineNode } from '../../core'
import type { ComboboxData, OptionsFilter } from '../Combobox'

export type TagsInputStylesNames = string

/** A tag option, either from `data` or synthesised for a free-form tag. */
export interface TagsInputOption {
  /** Underlying value of the option. */
  value: string

  /** Display label of the option. */
  label: string

  /** Disabled state of the option. */
  disabled?: boolean
}

/** Payload passed to the `renderOption` prop and slot. */
export interface TagsInputOptionRenderPayload {
  /** Option the row is rendered for. */
  option: TagsInputOption

  /** Selected state of the option. */
  checked?: boolean
}

/** Payload passed to the `renderPill` prop and slot. */
export interface TagsInputPillRenderPayload {
  /** Option the pill was created from, synthesised for a free-form tag. */
  option: TagsInputOption

  /** Value of the pill. */
  value: string

  /** Removes this tag. */
  onRemove: () => void

  /** Disabled state of the input. */
  disabled: boolean
}

export interface TagsInputSlots {
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
  renderOption?: (input: TagsInputOptionRenderPayload) => VNodeChild

  /** Custom markup for a tag pill. The `renderPill` prop takes precedence. */
  renderPill?: (input: TagsInputPillRenderPayload) => VNodeChild

  /** Content rendered when no option matches the current search. */
  nothingFound?: () => VNodeChild

  /** Alias of the `nothingFound` slot. Takes precedence over it. */
  nothingFoundMessage?: () => VNodeChild
}

/**
 * Props declared by `TagsInput` itself.
 *
 * Every prop of `PillsInput` is also accepted and forwarded to the underlying input.
 */
export interface TagsInputProps {
  /** Tags, bound with `v-model`. */
  modelValue?: string[]

  /**
   * Uncontrolled initial tags.
   *
   * @default []
   */
  defaultValue?: string[]

  /**
   * Data used to generate the suggestion options. Tags are not limited to it.
   *
   * @default []
   */
  data?: ComboboxData<string>

  /**
   * Maximum number of tags.
   *
   * @default Infinity
   */
  maxTags?: number

  /**
   * If set, the same tag can be added more than once.
   *
   * @default false
   */
  allowDuplicates?: boolean

  /**
   * Characters that split the typed value into several tags.
   *
   * @default [',']
   */
  splitChars?: string[]

  /**
   * If set, the value left in the input is turned into a tag when the input loses focus.
   *
   * @default true
   */
  acceptValueOnBlur?: boolean

  /** Decides whether a tag already exists. Compares case-insensitively when not set. */
  isDuplicate?: (value: string, values: string[]) => boolean

  /** Search value, bound with `v-model:searchValue`. */
  searchValue?: string

  /** Uncontrolled initial search value. */
  defaultSearchValue?: string

  /**
   * If set, a clear button is rendered when at least one tag exists.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * Separator used to join the tags in the hidden input.
   *
   * @default ','
   */
  hiddenInputValuesDivider?: string

  /** Props passed down to the hidden input that carries the tags in a form. */
  hiddenInputProps?: Record<string, any>

  /**
   * Content rendered when no option matches the current search.
   * Can also be set with the `nothingFound` slot – the slot takes precedence.
   */
  nothingFoundMessage?: MantineNode

  /** Filters the options based on the current search. Uses a case-insensitive match when not set. */
  filter?: OptionsFilter<string>

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

  /** Open state of the dropdown. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: Record<string, any>

  /**
   * Custom markup for a dropdown option.
   * Can also be set with the scoped `renderOption` slot – the slot takes precedence.
   */
  renderOption?: (input: TagsInputOptionRenderPayload) => VNodeChild

  /**
   * Custom markup for a tag pill.
   * Can also be set with the scoped `renderPill` slot – the slot takes precedence.
   */
  renderPill?: (input: TagsInputPillRenderPayload) => VNodeChild

  /** Props passed down to the `ScrollArea.Autosize` of the dropdown. */
  scrollAreaProps?: Record<string, any>

  /**
   * If set, the dropdown opens when the input receives focus.
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

/** Input of {@link getSplittedTags}. */
export interface GetSplittedTagsInput {
  /** Raw value typed or pasted into the input. */
  value: string

  /** Characters the value is split on. */
  splitChars?: string[]

  /** Tags that already exist. */
  currentTags?: string[]

  /** If set, duplicates are kept. */
  allowDuplicates?: boolean

  /** Maximum number of tags. */
  maxTags?: number

  /** Decides whether a tag already exists. */
  isDuplicate?: (value: string, values: string[]) => boolean

  /** Called with each duplicate that is found. */
  onDuplicate?: (value: string) => void
}
