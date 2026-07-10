import { describe, expect, it } from 'vitest'
import { useMap } from './use-map'

describe('@mantine-vue/hooks/use-map', () => {
  it('has correct initial state', () => {
    const map = useMap([
      ['a', 1],
      ['b', 2],
    ])

    expect(map.get('a')).toBe(1)
    expect(map.get('b')).toBe(2)
  })

  it('sets, deletes, and clears values', () => {
    const map = useMap<string, number>()

    map.set('a', 1)
    map.set('b', 2)
    expect(map.get('a')).toBe(1)
    expect(map.get('b')).toBe(2)
    map.delete('a')
    expect(map.get('a')).toBeUndefined()
    expect(map.get('b')).toBe(2)
    map.clear()
    expect(map.get('b')).toBeUndefined()
  })
})
