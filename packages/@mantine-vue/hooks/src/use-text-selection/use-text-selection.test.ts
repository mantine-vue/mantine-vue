import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useTextSelection } from './use-text-selection'

function renderHook() {
  let result!: ReturnType<typeof useTextSelection>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useTextSelection()
        return () => result.value?.toString()
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-text-selection', () => {
  it('registers a selectionchange listener on mount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    renderHook()
    expect(addSpy.mock.calls.some(([type]) => type === 'selectionchange')).toBe(true)
  })

  it('removes the selectionchange listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook()

    unmount()
    expect(removeSpy.mock.calls.some(([type]) => type === 'selectionchange')).toBe(true)
  })

  it('updates selection when selectionchange fires', () => {
    const { result } = renderHook()

    document.dispatchEvent(new Event('selectionchange'))
    expect(result.value).toBe(document.getSelection())
  })
})
