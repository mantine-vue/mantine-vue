import type { Primitive } from '../../core'
import type { PopoverProps } from '../Popover/Popover.types'
import type { ComboboxStore } from './use-combobox/use-combobox'
export interface ComboboxGenericItem<Value extends Primitive = string> {
  value: Value
  disabled?: boolean
}
export interface ComboboxItem<Value extends Primitive = string> extends ComboboxGenericItem<Value> {
  label: string
}
export interface ComboboxItemGroup<T> {
  group: string
  items: T[]
}
export interface ComboboxParsedItemGroup<Value extends Primitive = string> {
  group: string
  items: ComboboxItem<Value>[]
}
export type ComboboxData<Value extends Primitive = string> = ReadonlyArray<
  | Value
  | ComboboxItem<Value>
  | ComboboxItemGroup<Value | ComboboxGenericItem<Value> | ComboboxItem<Value>>
>
export type ComboboxGenericData<Value extends Primitive = string> = ReadonlyArray<
  Value | ComboboxGenericItem<Value> | ComboboxItemGroup<Value | ComboboxGenericItem<Value>>
>
export type ComboboxParsedItem<Value extends Primitive = string> =
  | ComboboxItem<Value>
  | ComboboxParsedItemGroup<Value>
export interface ComboboxLikeRenderOptionInput<T> {
  option: T
  checked?: boolean
}
export interface ComboboxLikeProps<Value extends Primitive = string> {
  data?: ComboboxData<Value>
  dropdownOpened?: boolean
  defaultDropdownOpened?: boolean
  onDropdownOpen?: () => void
  onDropdownClose?: () => void
  selectFirstOptionOnChange?: boolean
  selectFirstOptionOnDropdownOpen?: boolean
  onOptionSubmit?: (value: Value) => void
  filter?: OptionsFilter<Value>
  limit?: number
  withScrollArea?: boolean
  maxDropdownHeight?: number | string
  floatingHeight?: 'viewport'
}
export type OptionsFilter<Value extends Primitive = string> = (input: {
  options: ComboboxParsedItem<Value>[]
  search: string
  limit: number
}) => ComboboxParsedItem<Value>[]

export interface ComboboxSlots {
  /** Content of the component. */
  default?: () => import('vue').VNodeChild
}

export type ComboboxStylesNames =
  | 'options'
  | 'dropdown'
  | 'option'
  | 'search'
  | 'empty'
  | 'footer'
  | 'header'
  | 'group'
  | 'groupLabel'

export interface ComboboxOptionProps {
  /** Value of the option, passed to `onOptionSubmit` when it is selected. */
  value: Primitive

  /**
   * If set, the option is highlighted as the active one.
   *
   * @default false
   */
  active?: boolean

  /**
   * If set, the option cannot be selected.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the option is marked selected for assistive technology.
   *
   * @default false
   */
  selected?: boolean

  /** `id` of the option. Generated automatically when not set. */
  id?: string

  /** Any other prop is forwarded to the option element. */
  [key: string]: any
}

/**
 * Props of `Combobox`.
 *
 * `Combobox` renders a `Popover`, so every `Popover` prop is accepted as well and
 * forwarded through the fallthrough attributes.
 */
export interface ComboboxProps extends PopoverProps {
  /** Store returned by `useCombobox`. An internal one is created when not set. */
  store?: ComboboxStore

  /** Called with the option value and its props when an option is selected. */
  onOptionSubmit?: (value: string, props: ComboboxOptionProps) => void

  /**
   * Controls the size of the options and the search field.
   *
   * @default 'sm'
   */
  size?: string

  /** Key of `theme.spacing` or any valid CSS value to set the dropdown padding. */
  dropdownPadding?: string | number

  /**
   * If set, the highlighted option is reset when the pointer moves over an option, so
   * the keyboard and pointer selections do not fight each other.
   *
   * @default false
   */
  resetSelectionOnOptionHover?: boolean

  /**
   * If set, the dropdown does not open.
   *
   * @default false
   */
  readOnly?: boolean

  /** Set to `viewport` to size the dropdown against the viewport rather than a fixed height. */
  floatingHeight?: 'viewport'

  /** Static selector the Styles API classes are generated from. Used by components built on `Combobox`. */
  __staticSelector?: string
}

/** Props shared by `Combobox.Target` and `Combobox.EventsTarget`. */
export interface ComboboxTargetProps {
  /**
   * Name of the prop the target ref is passed to on the child.
   *
   * @default 'ref'
   */
  refProp?: string

  /**
   * If set, the arrow keys and `Enter` move through and submit the options.
   *
   * @default true
   */
  withKeyboardNavigation?: boolean

  /**
   * If set, the combobox ARIA attributes are added to the target.
   *
   * @default true
   */
  withAriaAttributes?: boolean

  /**
   * If set, `aria-expanded` reflects the dropdown state.
   *
   * @default false
   */
  withExpandedAttribute?: boolean

  /**
   * Kind of element the target is, which decides the ARIA role and the key handling.
   *
   * @default 'input'
   */
  targetType?: 'button' | 'input'

  /**
   * `autocomplete` attribute of the target.
   *
   * @default 'off'
   */
  autoComplete?: string

  /** Any other prop is merged into the cloned child. */
  [key: string]: any
}

export type ComboboxEventsTargetProps = ComboboxTargetProps

/** Props of `Combobox.DropdownTarget`. */
export interface ComboboxDropdownTargetProps {
  /**
   * Name of the prop the target ref is passed to on the child.
   *
   * @default 'ref'
   */
  refProp?: string

  /** Any other prop is forwarded to `Popover.Target`. */
  [key: string]: any
}

/** Props of `Combobox.Dropdown`. */
export interface ComboboxDropdownProps {
  /**
   * If set, the dropdown is hidden without unmounting it.
   *
   * @default false
   */
  hidden?: boolean

  /** Any other prop is forwarded to `Popover.Dropdown`. */
  [key: string]: any
}

/** Props of `Combobox.Options`. */
export interface ComboboxOptionsProps {
  /** `id` of the option list. Generated automatically when not set. */
  id?: string

  /** `id` of the element that labels the option list. */
  labelledBy?: string

  /** Any other prop is forwarded to the list element. */
  [key: string]: any
}

/** Props of `Combobox.Search`. */
export interface ComboboxSearchProps {
  /** Search value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial search value. */
  defaultValue?: string

  /**
   * If set, the combobox ARIA attributes are added to the field.
   *
   * @default true
   */
  withAriaAttributes?: boolean

  /**
   * If set, the arrow keys and `Enter` move through and submit the options.
   *
   * @default true
   */
  withKeyboardNavigation?: boolean

  /** Controls the size of the field. Inherits the `Combobox` size when not set. */
  size?: string

  /** Any other prop is forwarded to the underlying `Input`. */
  [key: string]: any
}

/** Props of `Combobox.Empty`, rendered when no option matched. */
export interface ComboboxEmptyProps {
  [key: string]: any
}

/** Props of `Combobox.Header`. */
export interface ComboboxHeaderProps {
  [key: string]: any
}

/** Props of `Combobox.Footer`. */
export interface ComboboxFooterProps {
  [key: string]: any
}

/** Props of `Combobox.Group`. */
export interface ComboboxGroupProps {
  /** Label of the group. No label element is rendered when not set. */
  label?: any

  /** `id` of the label. Generated automatically when not set. */
  id?: string

  /** Any other prop is forwarded to the group element. */
  [key: string]: any
}

/** Props of `Combobox.Chevron`. */
export interface ComboboxChevronProps {
  /** Controls the size of the chevron. */
  size?: string

  /** Error state of the input the chevron belongs to. Applies error styles when truthy. */
  error?: any

  /** Key of `theme.colors` or any valid CSS color. */
  color?: string

  /** Any other prop is forwarded to the svg element. */
  [key: string]: any
}

/** Props of `Combobox.ClearButton`. */
export interface ComboboxClearButtonProps {
  [key: string]: any
}

/** Props of `Combobox.HiddenInput`, which carries the value in a form. */
export interface ComboboxHiddenInputProps {
  /** Value, or values in multiple mode. */
  value: Primitive | Primitive[] | null

  /**
   * Separator used to join several values.
   *
   * @default ','
   */
  valuesDivider?: string

  /** Any other prop is forwarded to the input element. */
  [key: string]: any
}
