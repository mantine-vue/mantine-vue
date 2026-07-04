import type { Primitive } from '../../core'
import type {
  ComboboxData,
  ComboboxGenericData,
  ComboboxGenericItem,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxParsedItem,
  ComboboxParsedItemGroup,
} from './Combobox.types'

function parseItem<Value extends Primitive>(
  item: Value | ComboboxGenericItem<Value> | ComboboxItem<Value> | ComboboxItemGroup<any>,
): ComboboxItem<Value> | ComboboxParsedItemGroup<Value> {
  if (typeof item === 'object' && item !== null && 'group' in item)
    return {
      group: item.group,
      items: item.items.map((entry: any) => parseItem(entry) as ComboboxItem<Value>),
    }
  if (typeof item === 'object' && item !== null && 'value' in item)
    return 'label' in item
      ? (item as ComboboxItem<Value>)
      : { value: item.value, label: String(item.value), disabled: item.disabled }
  return { value: item as Value, label: String(item) }
}
export function getParsedComboboxData<Value extends Primitive = string>(
  data?: ComboboxData<Value> | ComboboxGenericData<Value>,
): ComboboxParsedItem<Value>[] {
  return data ? data.map((item: any) => parseItem(item)) : []
}
export function isOptionsGroup<Value extends Primitive>(
  item: ComboboxParsedItem<Value>,
): item is ComboboxParsedItemGroup<Value> {
  return 'group' in item
}
export function getOptionsLockup<Value extends Primitive = string>(
  options: ComboboxParsedItem<Value>[],
): Record<PropertyKey, ComboboxItem<Value>> {
  const result: Record<PropertyKey, ComboboxItem<Value>> = {}
  options.forEach((item) =>
    isOptionsGroup(item)
      ? Object.assign(result, getOptionsLockup(item.items))
      : (result[String(item.value)] = item),
  )
  return result
}
export function defaultOptionsFilter<Value extends Primitive>({
  options,
  search,
  limit,
}: {
  options: ComboboxParsedItem<Value>[]
  search: string
  limit: number
}): ComboboxParsedItem<Value>[] {
  const query = search.trim().toLowerCase()
  const result: ComboboxParsedItem<Value>[] = []
  for (const item of options) {
    if (result.length >= limit) break
    if (isOptionsGroup(item)) {
      const group = defaultOptionsFilter({
        options: item.items,
        search,
        limit: limit - result.length,
      }) as ComboboxItem<Value>[]
      if (group.length) result.push({ group: item.group, items: group })
    } else if (item.label.toLowerCase().includes(query)) result.push(item)
  }
  return result
}
export function isEmptyComboboxData(data: ComboboxParsedItem<any>[]) {
  return data.every((item) => (isOptionsGroup(item) ? item.items.length === 0 : false))
}
export function validateOptions(options: ComboboxParsedItem<any>[], values = new Set<Primitive>()) {
  for (const option of options) {
    if (isOptionsGroup(option)) validateOptions(option.items, values)
    else {
      if (option.value === undefined)
        throw new Error('[@mantine-vue/core] Each option must have value property')
      if (values.has(option.value))
        throw new Error(
          `[@mantine-vue/core] Duplicate options are not supported. Option with value "${option.value}" was provided more than once`,
        )
      values.add(option.value)
    }
  }
}
export type PillReorderPosition = 'before' | 'after'
export function movePill<T>(
  value: T[],
  from: number,
  to: number,
  position: PillReorderPosition,
): T[] {
  if (
    from === to ||
    (position === 'before' && to === from + 1) ||
    (position === 'after' && to === from - 1)
  )
    return value
  const result = value.slice()
  const [item] = result.splice(from, 1)
  let target = from < to ? to - 1 : to
  if (position === 'after') target += 1
  result.splice(target, 0, item)
  return result
}
