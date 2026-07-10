import { describe, expect, it } from 'vitest'
import { useStateHistory } from './use-state-history'

describe('@mantine-vue/hooks/use-state-history', () => {
  it('initializes with the given value', () => {
    const [value] = useStateHistory(1)
    expect(value.value).toBe(1)
  })

  it('remembers previous state in history', () => {
    const [value, handlers, history] = useStateHistory(1)

    handlers.set(2)
    expect(value.value).toBe(2)
    expect(history.value).toStrictEqual({ history: [1, 2], current: 1 })
    handlers.set(3)
    expect(value.value).toBe(3)
    expect(history.value).toStrictEqual({ history: [1, 2, 3], current: 2 })
  })

  it('allows going back and forward in history', () => {
    const [value, handlers, history] = useStateHistory(1)

    handlers.set(2)
    handlers.set(3)
    handlers.set(4)
    expect(value.value).toBe(4)
    expect(history.value).toStrictEqual({ history: [1, 2, 3, 4], current: 3 })
    handlers.back()
    expect(value.value).toBe(3)
    handlers.back()
    expect(value.value).toBe(2)
    handlers.forward()
    expect(value.value).toBe(3)
    handlers.forward()
    expect(value.value).toBe(4)
  })

  it('does not allow to go back/forward beyond history', () => {
    const [value, handlers, history] = useStateHistory(1)

    handlers.set(2)
    handlers.set(3)
    handlers.set(4)
    handlers.forward()
    handlers.forward()
    expect(value.value).toBe(4)
    expect(history.value).toStrictEqual({ history: [1, 2, 3, 4], current: 3 })
    handlers.back(3)
    expect(value.value).toBe(1)
    handlers.back()
    expect(value.value).toBe(1)
    expect(history.value).toStrictEqual({ history: [1, 2, 3, 4], current: 0 })
  })

  it('erases forward history when new value is set', () => {
    const [value, handlers, history] = useStateHistory(1)

    handlers.set(2)
    handlers.set(3)
    handlers.set(4)
    handlers.back(3)
    handlers.set(5)
    expect(value.value).toBe(5)
    expect(history.value).toStrictEqual({ history: [1, 5], current: 1 })
  })

  it('resets history', () => {
    const [value, handlers, history] = useStateHistory(1)

    handlers.set(2)
    handlers.set(3)
    handlers.reset()
    expect(value.value).toBe(1)
    expect(history.value).toStrictEqual({ history: [1], current: 0 })
  })
})
