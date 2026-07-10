import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useIsFirstRender } from './use-is-first-render'

describe('@mantine-vue/hooks/use-is-first-render', () => {
  it('returns true on the first render', () => {
    let isFirst!: ReturnType<typeof useIsFirstRender>

    mount(
      defineComponent({
        setup() {
          isFirst = useIsFirstRender()
          return () => null
        },
      }),
    )

    expect(isFirst.value).toBe(true)
  })

  it('returns false on every subsequent update', async () => {
    const count = ref(0)
    let isFirst!: ReturnType<typeof useIsFirstRender>

    mount(
      defineComponent({
        setup() {
          isFirst = useIsFirstRender()
          return () => count.value
        },
      }),
    )

    count.value += 1
    await nextTick()
    expect(isFirst.value).toBe(false)
    count.value += 1
    await nextTick()
    expect(isFirst.value).toBe(false)
  })
})
