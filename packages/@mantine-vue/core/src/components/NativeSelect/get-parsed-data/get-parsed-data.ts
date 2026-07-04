export type NativeSelectPrimitive = string | number | boolean | bigint

export interface NativeSelectItem<Value extends NativeSelectPrimitive = string> {
  value: Value
  label?: string
  disabled?: boolean
}

export interface NativeSelectItemGroup<Value extends NativeSelectPrimitive = string> {
  group: string
  items: Array<Value | NativeSelectItem<Value>>
}

export type NativeSelectData<Value extends NativeSelectPrimitive = string> = Array<
  Value | NativeSelectItem<Value> | NativeSelectItemGroup<Value>
>

export interface NativeSelectParsedItem<Value extends NativeSelectPrimitive = string> {
  value: Value
  label: string
  disabled?: boolean
}

export interface NativeSelectParsedItemGroup<Value extends NativeSelectPrimitive = string> {
  group: string
  items: NativeSelectParsedItem<Value>[]
}

export type NativeSelectParsedData<Value extends NativeSelectPrimitive = string> = Array<
  NativeSelectParsedItem<Value> | NativeSelectParsedItemGroup<Value>
>

function parseItem<Value extends NativeSelectPrimitive = string>(
  item: Value | NativeSelectItem<Value> | NativeSelectItemGroup<Value>,
): NativeSelectParsedItem<Value> | NativeSelectParsedItemGroup<Value> {
  if (typeof item === 'object' && item !== null && 'group' in item) {
    return {
      group: item.group,
      items: item.items.map((value) => parseItem<Value>(value) as NativeSelectParsedItem<Value>),
    }
  }

  if (typeof item === 'object' && item !== null && 'value' in item) {
    return {
      ...item,
      label: item.label ?? `${item.value}`,
    }
  }

  return { value: item as Value, label: `${item}` }
}

export function getParsedNativeSelectData<Value extends NativeSelectPrimitive = string>(
  data: NativeSelectData<Value> | undefined,
): NativeSelectParsedData<Value> {
  return data?.map((item) => parseItem<Value>(item)) ?? []
}
