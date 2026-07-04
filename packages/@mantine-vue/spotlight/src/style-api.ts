export function mergeClassNames(...items: any[]) {
  return items.reduce<Record<string, any>>((acc, item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return acc
    }

    Object.entries(item).forEach(([key, value]) => {
      acc[key] = acc[key] ? [acc[key], value] : value
    })

    return acc
  }, {})
}

export function mergeStyles(...items: any[]) {
  return items.reduce<Record<string, any>>((acc, item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return acc
    }

    Object.entries(item).forEach(([key, value]) => {
      acc[key] = acc[key] ? [acc[key], value] : value
    })

    return acc
  }, {})
}

export function renderContent(value: any) {
  return typeof value === 'function' ? value() : value
}
