import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useShallowEffect } from './use-shallow-effect'

describe('@mantine-vue/hooks/use-shallow-effect', () => {
  it('is called on initial render', () => {
    const spy = vi.fn()
    mount(
      defineComponent({
        setup() {
          useShallowEffect(spy, [])
          return () => null
        },
      }),
    )

    expect(spy).toHaveBeenCalled()
  })

  it('is called without dependencies on every update', async () => {
    const spy = vi.fn()
    const count = ref(0)
    mount(
      defineComponent({
        setup() {
          useShallowEffect(spy)
          return () => count.value
        },
      }),
    )

    expect(spy).toHaveBeenCalledTimes(1)
    count.value += 1
    await nextTick()
    count.value += 1
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('does not rerun for shallow-equal dependencies', async () => {
    const spy = vi.fn()
    const dependency = ref({ a: 1 })
    mount(
      defineComponent({
        setup() {
          useShallowEffect(spy, [dependency])
          return () => dependency.value.a
        },
      }),
    )

    expect(spy).toHaveBeenCalledTimes(1)
    dependency.value = { a: 1 }
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
