import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useDidUpdate } from './use-did-update'

describe('@mantine-vue/hooks/use-did-update', () => {
  it('calls fn on dependencies change', async () => {
    const fn = vi.fn()
    const dependency = ref('')

    mount(
      defineComponent({
        setup() {
          useDidUpdate(fn, [dependency])
          return () => null
        },
      }),
    )

    expect(fn).not.toHaveBeenCalled()
    dependency.value = 'foo'
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not call fn on the initial mount', () => {
    const fn = vi.fn()

    mount(
      defineComponent({
        setup() {
          useDidUpdate(fn, ['value'])
          return () => null
        },
      }),
    )

    expect(fn).not.toHaveBeenCalled()
  })

  it('calls cleanup returned by fn before the next run', async () => {
    const cleanup = vi.fn()
    const dependency = ref('a')

    mount(
      defineComponent({
        setup() {
          useDidUpdate(() => cleanup, [dependency])
          return () => null
        },
      }),
    )

    dependency.value = 'b'
    await nextTick()
    expect(cleanup).not.toHaveBeenCalled()
    dependency.value = 'c'
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('fires on every component update when no dependency array is provided', async () => {
    const fn = vi.fn()
    const count = ref(0)

    mount(
      defineComponent({
        setup() {
          useDidUpdate(fn)
          return () => count.value
        },
      }),
    )

    expect(fn).not.toHaveBeenCalled()
    count.value += 1
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    count.value += 1
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
