import { describe, expect, it } from 'vitest'
import { useSet } from './use-set'

describe('@mantine-vue/hooks/use-set', () => {
  it('has correct initial state', () => {
    const set = useSet([1, 2])

    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
  })

  it('adds, deletes, and clears values', () => {
    const set = useSet<number>()

    set.add(1)
    set.add(2)
    expect(set.has(1)).toBe(true)
    set.delete(1)
    expect(set.has(1)).toBe(false)
    expect(set.has(2)).toBe(true)
    set.clear()
    expect(set.has(2)).toBe(false)
  })

  it('supports set combinators without mutating the original set', () => {
    const set = useSet([1, 2, 3])

    expect(set.union(new Set([3, 4])).size).toBe(4)
    expect(set.intersection(new Set([2, 3, 4]))).toStrictEqual(new Set([2, 3]))
    expect(set.difference(new Set([3, 4]))).toStrictEqual(new Set([1, 2]))
    expect(set.symmetricDifference(new Set([3, 4, 5]))).toStrictEqual(new Set([1, 2, 4, 5]))
    expect(set).toStrictEqual(new Set([1, 2, 3]))
  })
})
