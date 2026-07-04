import type { SelectData, SelectDataItem } from '../types'

function upperFirst(value: string) {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`
}

export type { SelectData, SelectDataItem }

export function transformSelectData(data: SelectData): SelectDataItem[] {
  return data.map((item) => {
    if (typeof item === 'string') {
      return { label: upperFirst(item), value: item }
    }

    return { value: item.value, label: upperFirst(item.label) }
  })
}
