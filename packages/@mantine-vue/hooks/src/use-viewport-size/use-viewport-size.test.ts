import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { useViewportSize } from './use-viewport-size'

function renderHook() {
  let result!: ReturnType<typeof useViewportSize>
  mount(
    defineComponent({
      setup() {
        result = useViewportSize()
        return () => null
      },
    }),
  )

  return result
}

describe('@mantine-vue/hooks/use-viewport-size', () => {
  it('returns width and height reflecting window dimensions', () => {
    const result = renderHook()

    expect(typeof result.width.value).toBe('number')
    expect(typeof result.height.value).toBe('number')
  })

  it('updates after a resize event', () => {
    const result = renderHook()

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })
    window.dispatchEvent(new Event('resize'))

    expect(result.width.value).toBe(1280)
    expect(result.height.value).toBe(800)
  })

  it('updates after an orientationchange event', () => {
    const result = renderHook()

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 390,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 844,
    })
    window.dispatchEvent(new Event('orientationchange'))

    expect(result.width.value).toBe(390)
    expect(result.height.value).toBe(844)
  })
})
