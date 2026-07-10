import { reactive } from 'vue'

/** Local re-declaration of the ES2024 `ReadonlySetLike` lib type so this file
 *  does not depend on the project `lib` compiler option including `esnext`. */
export interface ReadonlySetLike<T> {
  readonly size: number
  has(value: T): boolean
  keys(): IterableIterator<T>
}

export function readonlySetLikeToSet<T>(input: ReadonlySetLike<T>): Set<T> {
  if (input instanceof Set) {
    return input
  }
  const result = new Set<T>()
  const iterator = input.keys()
  let next = iterator.next()
  while (!next.done) {
    result.add(next.value)
    next = iterator.next()
  }
  return result
}

export function useSet<T>(values?: T[]): Set<T> {
  const rawSet = new Set<T>(values) as Set<T> & {
    union: <U>(other: ReadonlySetLike<U>) => Set<T | U>
    intersection: <U>(other: ReadonlySetLike<U>) => Set<T & U>
    difference: <U>(other: ReadonlySetLike<U>) => Set<T>
    symmetricDifference: <U>(other: ReadonlySetLike<U>) => Set<T | U>
  }

  // These combinators only read the current contents of `rawSet` through the
  // closure (never through `this`), so it is safe to invoke them through the
  // reactive proxy returned below.
  rawSet.union = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>(rawSet)
    readonlySetLikeToSet(other).forEach((item) => result.add(item))
    return result
  }

  rawSet.intersection = <U>(other: ReadonlySetLike<U>): Set<T & U> => {
    const result = new Set<T & U>()
    const otherSet = readonlySetLikeToSet(other)
    rawSet.forEach((item) => {
      if (otherSet.has(item as unknown as U)) {
        result.add(item as T & U)
      }
    })
    return result
  }

  rawSet.difference = <U>(other: ReadonlySetLike<U>): Set<T> => {
    const result = new Set<T>()
    const otherSet = readonlySetLikeToSet(other)
    rawSet.forEach((item) => {
      if (!otherSet.has(item as unknown as U)) {
        result.add(item)
      }
    })
    return result
  }

  rawSet.symmetricDifference = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>()
    const otherSet = readonlySetLikeToSet(other)

    rawSet.forEach((item) => {
      if (!otherSet.has(item as unknown as U)) {
        result.add(item)
      }
    })

    otherSet.forEach((item) => {
      if (!rawSet.has(item as unknown as T)) {
        result.add(item)
      }
    })

    return result
  }

  return reactive(rawSet) as Set<T>
}
