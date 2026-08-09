import type { VNodeChild } from 'vue'
import type { ClassNames, MantineNode, Styles } from '../../core'

export interface CascaderOption {
  value: string
  label?: VNodeChild
  children?: CascaderOption[]
  disabled?: boolean
}

export interface CascaderFormatValueInput {
  value: string[]
  options: CascaderOption[]
}

export type CascaderFormatValue = (input: CascaderFormatValueInput) => string

export interface CascaderSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
  separator?: () => VNodeChild
  nothingFoundMessage?: () => VNodeChild
  /** Alias used by other Combobox-based components. */
  nothingFound?: () => VNodeChild
  renderSearchOption?: (input: { query: string; options: CascaderOption[] }) => VNodeChild
  renderOption?: (input: { option: CascaderOption; level: number }) => VNodeChild
}

/**
 * Props declared by `Cascader` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface CascaderProps {
  /** Tree of options the columns are generated from. */
  data: CascaderOption[]

  /** Selected path, from the root option down to the selected one. Bound with `v-model`. */
  modelValue?: string[] | null

  /** Uncontrolled initial path. */
  defaultValue?: string[] | null

  /**
   * If set, selecting an intermediate option commits it, instead of only committing a
   * full path down to a leaf.
   *
   * @default false
   */
  changeOnSelect?: boolean

  /** If set, the dropdown closes on selection. Defaults to closing only on a leaf. */
  closeOnSelect?: boolean

  /**
   * If set, selecting the already selected path clears it.
   *
   * @default true
   */
  allowDeselect?: boolean

  /**
   * If set, a check icon is rendered next to the selected option.
   *
   * @default true
   */
  withCheckIcon?: boolean

  /**
   * Side of the option the check icon is rendered on.
   *
   * @default 'right'
   */
  checkIconPosition?: 'left' | 'right'

  /**
   * If set, each level is rendered as its own column. Otherwise the levels replace one
   * another in a single column.
   *
   * @default true
   */
  withColumns?: boolean

  /**
   * Interaction that opens the next level.
   *
   * @default 'click'
   */
  expandTrigger?: 'click' | 'hover'

  /**
   * If set, the input can be typed into to search the whole tree, which replaces the
   * columns with a flat list of matching paths.
   *
   * @default false
   */
  searchable?: boolean

  /** Search value, bound with `v-model:searchValue`. */
  searchValue?: string

  /** Uncontrolled initial search value. */
  defaultSearchValue?: string

  /** Decides whether a path matches the current search. Matches on the labels when not set. */
  filter?: (query: string, options: CascaderOption[]) => boolean

  /**
   * Custom markup for a row of the flat search list.
   * Can also be set with the scoped `renderSearchOption` slot.
   */
  renderSearchOption?: (query: string, options: CascaderOption[]) => VNodeChild

  /** Formats the selected path for display in the input. Joins the labels when not set. */
  formatValue?: CascaderFormatValue

  /**
   * Custom markup for a column option.
   * Can also be set with the scoped `renderOption` slot.
   */
  renderOption?: (option: CascaderOption, level: number) => VNodeChild

  /**
   * Content rendered between the labels of the selected path.
   * Can also be set with the `separator` slot.
   */
  separator?: MantineNode

  /**
   * Width of a single column.
   *
   * @default 200
   */
  columnWidth?: number | string

  /**
   * Number of columns visible at a time. Deeper levels are reached with the previous and
   * next level controls.
   *
   * @default 3
   */
  maxDisplayedLevels?: number

  /**
   * `aria-label` of the control that scrolls to the previous levels.
   *
   * @default 'Show previous levels'
   */
  previousLevelsControlLabel?: string

  /**
   * `aria-label` of the control that scrolls to the next levels.
   *
   * @default 'Show next levels'
   */
  nextLevelsControlLabel?: string

  /**
   * `max-height` of the dropdown.
   *
   * @default 260
   */
  maxDropdownHeight?: number | string

  /**
   * Content rendered when no path matches the current search.
   * Can also be set with the `nothingFound` slot – the slot takes precedence over the prop.
   */
  nothingFoundMessage?: MantineNode

  /**
   * If set, a clear button is rendered when a path is selected.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * How the clear button and the right section share the right side of the input.
   *
   * @default 'both'
   */
  clearSectionMode?: 'both' | 'rightSection' | 'clear'

  /** Props passed down to the clear button. */
  clearButtonProps?: Record<string, unknown>

  /** Open state of the dropdown. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: Record<string, unknown>

  /** Props passed down to the scrollable wrapper of the dropdown. */
  scrollAreaProps?: Record<string, unknown>

  /** Key of `theme.colors` or any valid CSS color used by the chevron. */
  chevronColor?: string

  /** Props passed down to the hidden input that carries the value in a form. */
  hiddenInputProps?: Record<string, unknown>

  /**
   * If set, the dropdown opens when a searchable input receives focus.
   *
   * @default true
   */
  openOnFocus?: boolean

  /**
   * If set, the value cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Controls the size of the input and the options.
   *
   * @default 'sm'
   */
  size?: string | number

  /** `classNames` of the Styles API. */
  classNames?: ClassNames

  /** `styles` of the Styles API. */
  styles?: Styles

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}
