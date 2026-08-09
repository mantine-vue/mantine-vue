import type { VNodeChild } from 'vue'
import type { MantineNode, Primitive } from '../../../core'
import type {
  ComboboxLikeRenderOptionInput,
  ComboboxParsedItem,
  OptionsFilter,
} from '../Combobox.types'

export type OptionsData = ComboboxParsedItem<Primitive>[]

export interface OptionsDropdownSlots {
  /** Custom markup for a dropdown option. Takes precedence over the `renderOption` prop. */
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => VNodeChild

  /** Content rendered when no option matches the current search. */
  nothingFound?: () => VNodeChild

  /** Alias of the `nothingFound` slot. Takes precedence over it. */
  nothingFoundMessage?: () => VNodeChild
}

/**
 * Props of `OptionsDropdown`.
 *
 * This component renders the shared dropdown used by `Select`, `MultiSelect`,
 * `Autocomplete` and `TagsInput`. It is internal to those components.
 */
export interface OptionsDropdownProps {
  /** Parsed options, already grouped. */
  data: OptionsData

  /** Filters the options based on the current search. Uses a case-insensitive match when not set. */
  filter?: OptionsFilter<Primitive>

  /** Current search value. Filtering is skipped entirely when this is not a string. */
  search?: string

  /** Maximum number of options rendered at a time. All options are rendered when not set. */
  limit?: number

  /**
   * If set, the options are rendered inside a `ScrollArea.Autosize`.
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

  /** Set to `viewport` to size the dropdown against the viewport instead of `maxDropdownHeight`. */
  floatingHeight?: 'viewport'

  /**
   * If set, the dropdown is hidden.
   *
   * @default false
   */
  hidden?: boolean

  /**
   * If set, the dropdown is hidden when no option is left after filtering.
   *
   * @default false
   */
  hiddenWhenEmpty?: boolean

  /**
   * If set, the options are filtered by `search`. Turn off to filter them yourself while
   * still showing the search value in the input.
   *
   * @default true
   */
  filterOptions?: boolean

  /**
   * If set, a check icon is rendered next to the selected options.
   *
   * @default false
   */
  withCheckIcon?: boolean

  /**
   * If set, unselected options reserve the space of the check icon so all labels line up.
   *
   * @default false
   */
  withAlignedLabels?: boolean

  /** Selected value, or values in multiple mode. Used to mark the checked options. */
  value?: Primitive | Primitive[] | null

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

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean

  /** `id` of the element that labels the option list. */
  labelId?: string

  /** `aria-label` of the option list, used when there is no visible label. */
  ariaLabel?: string

  /**
   * Custom markup for a dropdown option.
   * Can also be set with the scoped `renderOption` slot – the slot takes precedence.
   */
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => VNodeChild

  /** Props passed down to the `ScrollArea.Autosize` of the dropdown. */
  scrollAreaProps?: Record<string, any>
}
