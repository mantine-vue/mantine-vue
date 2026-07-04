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

export function getDataPath(name: string | undefined, path: PropertyKey) {
  return name ? `${name}-${String(path)}` : String(path)
}
