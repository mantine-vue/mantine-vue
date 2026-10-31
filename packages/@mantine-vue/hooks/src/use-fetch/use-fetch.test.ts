import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { useFetch } from './use-fetch'

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

describe('@mantine-vue/hooks/use-fetch', () => {
  it('ignores the result of a replaced request and clears stale errors', async () => {
    const resolvers: Array<(value: any) => void> = []
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise((resolve) => resolvers.push(resolve))),
    )
    const { result } = renderHook(() => useFetch<{ id: number }>('/data', { autoInvoke: false }))

    result.error.value = new Error('stale')
    result.refetch()
    result.refetch()

    resolvers[1]({ ok: true, json: () => Promise.resolve({ id: 2 }) })
    await flushPromises()
    resolvers[0]({ ok: true, json: () => Promise.resolve({ id: 1 }) })
    await flushPromises()

    expect(result.data.value).toEqual({ id: 2 })
    expect(result.error.value).toBe(null)
    expect(result.loading.value).toBe(false)
  })

  it('does not report an aborted request as an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, { signal }: RequestInit) =>
          new Promise((_, reject) => {
            signal!.addEventListener('abort', () => reject(signal!.reason))
          }),
      ),
    )
    const { result } = renderHook(() => useFetch('/data', { autoInvoke: false }))

    result.refetch()
    result.abort()
    await flushPromises()

    expect(result.error.value).toBe(null)
    expect(result.loading.value).toBe(false)
  })
})
