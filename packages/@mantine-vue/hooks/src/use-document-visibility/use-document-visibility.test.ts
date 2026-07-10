import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDocumentVisibility } from './use-document-visibility'

function setVisibilityState(value: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    get: () => value,
    configurable: true,
  })
}

function renderHook() {
  let result!: ReturnType<typeof useDocumentVisibility>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useDocumentVisibility()
        return () => null
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

afterEach(() => {
  setVisibilityState('visible')
})

describe('@mantine-vue/hooks/use-document-visibility', () => {
  it('returns visible as the initial state', () => {
    const { result } = renderHook()
    expect(result.value).toBe('visible')
  })

  it('updates to hidden when visibilitychange fires', () => {
    const { result } = renderHook()

    setVisibilityState('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    expect(result.value).toBe('hidden')
  })

  it('updates back to visible on subsequent visibilitychange', () => {
    const { result } = renderHook()

    setVisibilityState('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    setVisibilityState('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    expect(result.value).toBe('visible')
  })

  it('removes the listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook()

    unmount()
    expect(removeSpy.mock.calls.some(([type]) => type === 'visibilitychange')).toBe(true)
  })
})
