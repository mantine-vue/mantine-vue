import { onUpdated, toValue, watch, type MaybeRefOrGetter } from 'vue'

function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) {
    return true
  }

  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false
  }

  const keys = Object.keys(a)
  const { length } = keys

  if (length !== Object.keys(b).length) {
    return false
  }

  for (let i = 0; i < length; i += 1) {
    const key = keys[i]

    if (!(key in b)) {
      return false
    }

    const aValue = (a as Record<string, unknown>)[key]
    const bValue = (b as Record<string, unknown>)[key]

    if (aValue !== bValue && !(Number.isNaN(aValue) && Number.isNaN(bValue))) {
      return false
    }
  }

  return true
}

function shallowCompareDeps(prev: unknown[] | undefined, curr: unknown[] | undefined): boolean {
  if (!prev || !curr) {
    return false
  }

  if (prev === curr) {
    return true
  }

  if (prev.length !== curr.length) {
    return false
  }

  for (let i = 0; i < prev.length; i += 1) {
    if (!shallowEqual(prev[i], curr[i])) {
      return false
    }
  }

  return true
}

export function useShallowEffect(
  effect: () => void,
  dependencies?: MaybeRefOrGetter<unknown>[],
): void {
  if (!dependencies) {
    effect()
    onUpdated(effect)
    return
  }

  let previous: unknown[] | undefined

  const getDeps = (): unknown[] => dependencies.map((dep) => toValue(dep))

  watch(
    getDeps,
    (curr) => {
      if (!shallowCompareDeps(previous, curr)) {
        previous = curr
        effect()
      }
    },
    { immediate: true },
  )
}
