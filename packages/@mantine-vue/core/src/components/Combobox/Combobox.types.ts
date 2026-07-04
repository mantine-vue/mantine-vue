import type { Primitive } from '../../core'
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
