import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isFixed, isPinned, isPinnedOrReleased, isReleased, useHeadroom } from './use-headroom'

function renderHook(options?: Parameters<typeof useHeadroom>[0]) {
  let result!: ReturnType<typeof useHeadroom>
  mount(
    defineComponent({
      setup() {
        result = useHeadroom(options)
        return () => null
      },
    }),
  )

  return result
}

async function simulateScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
  window.dispatchEvent(new Event('scroll'))
  await nextTick()
}

describe('@mantine-vue/hooks/use-headroom', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  it('calculates fixed, pinned, and released states', () => {
    expect(isFixed(50, 100)).toBe(true)
    expect(isFixed(101, 100)).toBe(false)
    expect(isPinned(50, 100)).toBe(true)
    expect(isPinned(101, 100)).toBe(false)
    expect(isReleased(200, 100, 50)).toBe(true)
    expect(isReleased(50, 100, 150)).toBe(false)
  })

  it('calls onPin and onRelease when pinned state changes', () => {
    const pinned = { value: false }
    const onPin = vi.fn()
    const onRelease = vi.fn()

    isPinnedOrReleased(50, 100, pinned, false, onPin, onRelease)
    expect(onPin).toHaveBeenCalledTimes(1)
    expect(pinned.value).toBe(true)
    isPinnedOrReleased(200, 100, pinned, false, onPin, onRelease)
    expect(onRelease).toHaveBeenCalledTimes(1)
    expect(pinned.value).toBe(false)
  })

  it('starts fully visible at the top of the page', () => {
    const result = renderHook()
    expect(result.scrollProgress.value).toBe(1)
    expect(result.pinned.value).toBe(true)
  })

  it('gradually hides as the page scrolls past fixedAt', async () => {
    const result = renderHook({ fixedAt: 0, scrollDistance: 100 })

    await simulateScroll(50)
    expect(result.scrollProgress.value).toBe(0.5)
    await simulateScroll(100)
    expect(result.scrollProgress.value).toBe(0)
    expect(result.pinned.value).toBe(false)
  })

  it('gradually reveals as the page scrolls back up', async () => {
    const result = renderHook({ fixedAt: 0, scrollDistance: 100 })

    await simulateScroll(100)
    await simulateScroll(50)
    expect(result.scrollProgress.value).toBe(0.5)
  })
})
