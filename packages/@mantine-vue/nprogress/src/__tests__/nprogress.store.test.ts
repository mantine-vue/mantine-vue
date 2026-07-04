import { describe, expect, it, vi } from 'vitest'
import {
  completeNavigationProgressAction,
  createNprogressStore,
  decrementNavigationProgressAction,
  incrementNavigationProgressAction,
  resetNavigationProgressAction,
  setNavigationProgressAction,
  startNavigationProgressAction,
  stopNavigationProgressAction,
} from '../nprogress.store'

describe('@mantine-vue/nprogress store', () => {
  it('sets, increments and decrements progress within bounds', () => {
    const store = createNprogressStore()

    setNavigationProgressAction(120, store)
    expect(store.getState().progress).toBe(100)
    expect(store.getState().mounted).toBe(true)

    decrementNavigationProgressAction(store)
    expect(store.getState().progress).toBe(99)

    incrementNavigationProgressAction(store)
    expect(store.getState().progress).toBe(100)
  })

  it('starts and stops interval progress', () => {
    vi.useFakeTimers()
    const store = createNprogressStore()
    store.setState({ ...store.getState(), stepInterval: 100 })

    startNavigationProgressAction(store)
    expect(store.getState().progress).toBe(10)
    expect(store.getState().mounted).toBe(true)

    vi.advanceTimersByTime(100)
    expect(store.getState().progress).toBe(20)

    stopNavigationProgressAction(store)
    expect(store.getState().interval).toBe(-1)
    vi.useRealTimers()
  })

  it('completes and resets after configured timeout', () => {
    vi.useFakeTimers()
    const store = createNprogressStore()
    store.setState({ ...store.getState(), progress: 40, mounted: true, stepInterval: 100 })

    completeNavigationProgressAction(store)
    expect(store.getState().progress).toBe(100)

    vi.advanceTimersByTime(50)
    expect(store.getState().mounted).toBe(false)

    vi.advanceTimersByTime(100)
    expect(store.getState().progress).toBe(0)

    resetNavigationProgressAction(store)
    expect(store.getState().mounted).toBe(false)
    vi.useRealTimers()
  })
})
