import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useClipboard } from './use-clipboard'

function renderHook<T>(hook: () => T) {
  let result!: T
  mount(
    defineComponent({
      setup() {
        result = hook()
        return () => null
      },
    }),
  )
  return { result }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('@mantine-vue/hooks/use-clipboard', () => {
  it('resets copied when a later copy fails', async () => {
    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('x'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const { result } = renderHook(() => useClipboard())

    await result.copy('a')
    expect(result.copied.value).toBe(true)

    await result.copy('b')
    expect(result.copied.value).toBe(false)
    expect(result.error.value).toBeInstanceOf(Error)
  })
})
