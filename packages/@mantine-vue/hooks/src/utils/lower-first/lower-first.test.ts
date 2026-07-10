import { describe, expect, it } from 'vitest'
import { lowerFirst } from './lower-first'

describe('@mantine-vue/hooks/lower-first', () => {
  it('converts first letter to lower case', () => {
    expect(lowerFirst('Hello')).toBe('hello')
    expect(lowerFirst('HELLO')).toBe('hELLO')
    expect(lowerFirst('hELLO')).toBe('hELLO')
  })

  it('returns empty string if value cannot be lowercased', () => {
    expect(lowerFirst('')).toBe('')
    expect(lowerFirst(null as any)).toBe('')
  })
})
