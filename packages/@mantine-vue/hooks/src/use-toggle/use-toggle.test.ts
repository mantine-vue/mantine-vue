import { describe, expect, it } from 'vitest'
import { useToggle } from './use-toggle'

describe('@mantine-vue/hooks/use-toggle', () => {
  it('returns correct initial state', () => {
    const [state] = useToggle(['dark', 'light'] as const)
    expect(state.value).toBe('dark')
  })

  it('correctly toggles value', () => {
    const [state, toggle] = useToggle(['dark', 'light'] as const)

    toggle()
    expect(state.value).toBe('light')
    toggle()
    expect(state.value).toBe('dark')
  })

  it('correctly toggles more than two values', () => {
    const [state, toggle] = useToggle(['dark', 'light', 'normal'] as const)

    toggle()
    expect(state.value).toBe('light')
    toggle()
    expect(state.value).toBe('normal')
    toggle()
    expect(state.value).toBe('dark')
    toggle('normal')
    expect(state.value).toBe('normal')
    toggle()
    expect(state.value).toBe('dark')
  })

  it('allows to set value', () => {
    const [state, toggle] = useToggle(['dark', 'light'] as const)

    toggle('dark')
    expect(state.value).toBe('dark')
    toggle('dark')
    expect(state.value).toBe('dark')
  })

  it('allows to set value with callback function', () => {
    const [state, toggle] = useToggle(['dark', 'light'] as const)

    toggle((value) => value)
    expect(state.value).toBe('dark')
  })

  it('allows to use hook without options', () => {
    const [state, toggle] = useToggle()

    expect(state.value).toBe(false)
    toggle()
    expect(state.value).toBe(true)
  })
})
