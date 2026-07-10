import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useScrollDirection } from './use-scroll-direction'

function renderHook() {
  let result!: ReturnType<typeof useScrollDirection>
  mount(
    defineComponent({
      setup() {
        result = useScrollDirection()
        return () => null
      },
    }),
  )

  return result
}

function simulateScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('@mantine-vue/hooks/use-scroll-direction', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  it('returns "unknown" initially', () => {
    const result = renderHook()
    expect(result.value).toBe('unknown')
  })

  it('returns "down" after the first scroll down event', () => {
    const result = renderHook()
    simulateScroll(100)
    expect(result.value).toBe('down')
  })

  it('returns "up" after scrolling up', () => {
    const result = renderHook()
    simulateScroll(100)
    simulateScroll(50)
    expect(result.value).toBe('up')
  })

  it('returns "down" again after reversing back down', () => {
    const result = renderHook()
    simulateScroll(100)
    simulateScroll(50)
    simulateScroll(150)
    expect(result.value).toBe('down')
  })
})
