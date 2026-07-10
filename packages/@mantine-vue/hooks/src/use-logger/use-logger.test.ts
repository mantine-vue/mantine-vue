import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLogger } from './use-logger'

describe('@mantine-vue/hooks/use-logger', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs mount and unmount events', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const data = { foo: 'bar' }
    const wrapper = mount(
      defineComponent({
        setup() {
          useLogger('Test', [data])
          return () => null
        },
      }),
    )

    expect(log).toHaveBeenCalledWith('Test mounted', data)
    wrapper.unmount()
    expect(log).toHaveBeenLastCalledWith('Test unmounted')
    expect(log).toHaveBeenCalledTimes(2)
  })

  it('logs mount, unmount and update events', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const data = ref({ foo: 'bar' })
    const wrapper = mount(
      defineComponent({
        setup() {
          useLogger('Test', [data])
          return () => null
        },
      }),
    )

    expect(log).toHaveBeenCalledWith('Test mounted', data.value)
    data.value = { foo: 'newBar' }
    await nextTick()
    expect(log).toHaveBeenCalledWith('Test updated', data.value)
    wrapper.unmount()
    expect(log).toHaveBeenLastCalledWith('Test unmounted')
    expect(log).toHaveBeenCalledTimes(3)
  })
})
