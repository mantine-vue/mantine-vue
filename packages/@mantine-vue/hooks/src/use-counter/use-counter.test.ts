import { describe, expect, it } from 'vitest'
import { useCounter } from './use-counter'

describe('@mantine-vue/hooks/use-counter', () => {
  it('correctly returns initial state', () => {
    const [count] = useCounter(20, { min: 0, max: 100 })
    expect(count.value).toBe(20)
  })

  it('correctly performs operations without initialValue or options', () => {
    const [count, handlers] = useCounter()

    expect(count.value).toBe(0)
    handlers.increment()
    expect(count.value).toBe(1)
    handlers.decrement()
    expect(count.value).toBe(0)
    handlers.set(5)
    expect(count.value).toBe(5)
    handlers.reset()
    expect(count.value).toBe(0)
  })

  it('correctly increments and decrements by custom step', () => {
    const [count, handlers] = useCounter(0, { step: 5 })

    handlers.increment()
    expect(count.value).toBe(5)
    handlers.increment()
    expect(count.value).toBe(10)
    handlers.decrement()
    expect(count.value).toBe(5)
  })

  it('clamps step increment/decrement to min/max', () => {
    const [count, handlers] = useCounter(0, { min: -3, max: 3, step: 5 })

    handlers.increment()
    expect(count.value).toBe(3)
    handlers.decrement()
    expect(count.value).toBe(-2)
    handlers.decrement()
    expect(count.value).toBe(-3)
  })

  it('correctly performs operations with initialValue and options', () => {
    const [count, handlers] = useCounter(11, { min: -10, max: 10 })

    expect(count.value).toBe(10)
    handlers.increment()
    expect(count.value).toBe(10)
    handlers.decrement()
    expect(count.value).toBe(9)
    handlers.set(5)
    expect(count.value).toBe(5)
    handlers.set(20)
    expect(count.value).toBe(10)
    handlers.reset()
    expect(count.value).toBe(10)
  })
})
