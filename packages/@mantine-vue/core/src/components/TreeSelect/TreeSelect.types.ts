import type { VNodeChild } from 'vue'
import type { MantineNode } from '../../core'
import type { TreeNodeData } from '../Tree'
import type { ComboboxProps } from '../Combobox'

export type TreeSelectMode = 'single' | 'multiple' | 'checkbox'
export type TreeSelectValue<Mode extends TreeSelectMode> = Mode extends 'single'
  ? string | null
  : string[]
export type CheckedStrategy = 'all' | 'parent' | 'child'

export interface TreeSelectRenderNodePayload {
  node: TreeNodeData
  level: number
  expanded: boolean
  hasChildren: boolean
  selected: boolean
  checked: boolean
  indeterminate: boolean
  expand: (event?: Event) => void
}
export interface TreeSelectChevronAriaLabels {
  expand?: string
  collapse?: string
}
/**
 * Props declared by `TreeSelect` itself.
 *
 * Every prop of `InputBase` – or of `PillsInput` in the multi-value modes – is also
 * accepted and forwarded to the underlying input.
 */
export interface TreeSelectProps<Mode extends TreeSelectMode = 'single'> {
  /** Tree the options are generated from. */
  data: TreeNodeData[]

  /**
   * Selection mode. `single` holds one value, `multiple` an array, `checkbox` an array
   * with checkboxes and parent/child cascading.
   *
   * @default 'single'
   */
  mode?: Mode

  /** Selected value or values, bound with `v-model`. */
  modelValue?: TreeSelectValue<Mode>

  /** Uncontrolled initial value. */
  defaultValue?: TreeSelectValue<Mode>

  /**
   * If set, checking a parent does not check its descendants; each node is independent.
   *
   * @default false
   */
  checkStrictly?: boolean

  /**
   * Which nodes end up in the value once a whole branch is checked. `child` keeps only
   * the leaves, `parent` collapses them into the parent, `all` keeps both.
   *
   * @default 'child'
   */
  checkedStrategy?: CheckedStrategy

  /** Values expanded on first render. */
  defaultExpandedValues?: string[]

  /**
   * If set, every branch starts expanded.
   *
   * @default false
   */
  defaultExpandAll?: boolean

  /** Expanded values. Controlled when set. */
  expandedValues?: string[]

  /**
   * If set, clicking a branch expands it as well as selecting it.
   *
   * @default false
   */
  expandOnClick?: boolean

  /**
   * If set, the input can be typed into to filter the tree.
   *
   * @default false
   */
  searchable?: boolean

  /** Search value, bound with `v-model:searchValue`. */
  searchValue?: string

  /** Uncontrolled initial search value. */
  defaultSearchValue?: string

  /** Decides whether a node matches the current search. Matches on the label when not set. */
  filter?: (query: string, node: TreeNodeData) => boolean

  /**
   * Content rendered when no node matches the current search.
   * Can also be set with the `nothingFound` slot – the slot takes precedence.
   */
  nothingFoundMessage?: MantineNode

  /**
   * If set, clicking the selected node deselects it. Only used in `single` mode.
   *
   * @default true
   */
  allowDeselect?: boolean

  /**
   * If set, a clear button is rendered when the input is not empty.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * Maximum number of values that can be selected.
   *
   * @default Infinity
   */
  maxValues?: number

  /** Maximum number of pills rendered before the rest are collapsed into a counter. */
  maxDisplayedValues?: number

  /** Content of the overflow pill. A function receives the number of hidden values. */
  maxDisplayedValuesContent?: VNodeChild | ((overflowCount: number) => VNodeChild)

  /** Custom markup for a tree row. */
  renderNode?: (payload: TreeSelectRenderNodePayload) => VNodeChild

  /**
   * If set, connector lines between a node and its children are rendered.
   *
   * @default true
   */
  withLines?: boolean

  /** Props passed down to the hidden input that carries the value in a form. */
  hiddenInputProps?: Record<string, any>

  /**
   * Separator used to join several values in the hidden input.
   *
   * @default ','
   */
  hiddenInputValuesDivider?: string

  /**
   * `max-height` of the dropdown.
   *
   * @default 220
   */
  maxDropdownHeight?: number | string

  /** Props passed down to the scrollable wrapper of the dropdown. */
  scrollAreaProps?: Record<string, any>

  /** Open state of the dropdown. */
  dropdownOpened?: boolean

  /** Uncontrolled initial open state of the dropdown. */
  defaultDropdownOpened?: boolean

  /** Props passed down to the underlying `Combobox`. */
  comboboxProps?: ComboboxProps

  /**
   * If set, the search is reset whenever the selection changes.
   *
   * @default true
   */
  clearSearchOnChange?: boolean

  /**
   * If set, the dropdown opens when a searchable input receives focus.
   *
   * @default true
   */
  openOnFocus?: boolean

  /** Labels for the expand and collapse actions of the chevrons. */
  chevronAriaLabels?: TreeSelectChevronAriaLabels
}

export interface TreeSelectSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
  renderNode?: (payload: TreeSelectRenderNodePayload) => VNodeChild
  nothingFound?: () => VNodeChild
  nothingFoundMessage?: () => VNodeChild
}
