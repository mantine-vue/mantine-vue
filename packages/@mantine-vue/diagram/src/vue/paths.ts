/** Reads a dot separated path, e.g. `'data.seats'`. */
export function getPath(source: unknown, path: string): unknown {
  let current: any = source

  for (const key of path.split('.')) {
    if (current == null || typeof current !== 'object') {
      return undefined
    }

    current = current[key]
  }

  return current
}

const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

/**
 * Returns a copy of `source` with `value` at a dot separated path. Objects along the path are
 * copied, everything else is shared. `undefined` removes the key.
 */
export function setPath<T extends Record<string, any>>(source: T, path: string, value: unknown): T {
  const keys = path.split('.')

  if (keys.some((key) => UNSAFE_KEYS.has(key))) {
    throw new Error(`[@mantine-vue/diagram] Invalid property path "${path}"`)
  }

  const update = (target: any, index: number): any => {
    const key = keys[index]
    const copy = target && typeof target === 'object' ? { ...target } : {}

    if (index === keys.length - 1) {
      if (value === undefined) {
        delete copy[key]
      } else {
        copy[key] = value
      }
    } else {
      copy[key] = update(copy[key], index + 1)
    }

    return copy
  }

  return update(source, 0)
}
