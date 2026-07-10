import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePrevious } from './use-previous'

describe('@mantine-vue/hooks/use-previous', () => {
  it('returns undefined on initial render', () => {
    const current = ref(1)
    let previous!: ReturnType<typeof usePrevious<number>>

    mount(
      defineComponent({
        setup() {
          previous = usePrevious(current)
          return () => null
        },
      }),
    )

    expect(previous.value).toBeUndefined()
  })

  it('returns the previous value after update', async () => {
    const current = ref(1)
    let previous!: ReturnType<typeof usePrevious<number>>

    mount(
      defineComponent({
        setup() {
          previous = usePrevious(current)
          return () => null
        },
      }),
    )

    current.value = 2
    await nextTick()
    expect(previous.value).toBe(1)
    current.value = 4
    await nextTick()
    expect(previous.value).toBe(2)
  })
})
