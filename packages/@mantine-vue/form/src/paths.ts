export function getPath(path: PropertyKey, values: Record<PropertyKey, any>) {
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc == null ? acc : acc[key]), values)
}

export function setPath(path: PropertyKey, value: any, values: Record<PropertyKey, any>) {
  const keys = String(path).split('.')
  const result = JSON.parse(JSON.stringify(values))
  let cursor: any = result

  keys.slice(0, -1).forEach((key) => {
    if (cursor[key] === undefined) {
      cursor[key] = {}
    }
    cursor = cursor[key]
  })

  cursor[keys[keys.length - 1]] = value
  return result
}

export function insertPath(
  path: PropertyKey,
  item: any,
  index: number | undefined,
  values: Record<PropertyKey, any>,
) {
  const currentValue = getPath(path, values)

  if (!Array.isArray(currentValue)) {
    return values
  }

  const cloned = [...currentValue]
  const position = index === undefined ? cloned.length : Math.min(Math.max(index, 0), cloned.length)
  cloned.splice(position, 0, item)

  return setPath(path, cloned, values)
}

export function removePath(path: PropertyKey, index: number, values: Record<PropertyKey, any>) {
  const currentValue = getPath(path, values)

  if (!Array.isArray(currentValue)) {
    return values
  }

  const cloned = [...currentValue]
  cloned.splice(index, 1)

  return setPath(path, cloned, values)
}

export function replacePath(
  path: PropertyKey,
  item: any,
  index: number,
  values: Record<PropertyKey, any>,
) {
  const currentValue = getPath(path, values)

  if (!Array.isArray(currentValue)) {
    return values
  }

  const cloned = [...currentValue]
  cloned[index] = item

  return setPath(path, cloned, values)
}

interface ReorderPayload {
  from: number
  to: number
}

export function reorderPath(
  path: PropertyKey,
  { from, to }: ReorderPayload,
  values: Record<PropertyKey, any>,
) {
  const currentValue = getPath(path, values)

  if (!Array.isArray(currentValue)) {
    return values
  }

  const cloned = [...currentValue]
  const item = cloned.splice(from, 1)[0]
  cloned.splice(to, 0, item)

  return setPath(path, cloned, values)
}

export function getDataPath(name: string | undefined, path: PropertyKey) {
  return name ? `${name}-${String(path)}` : String(path)
}
