import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { Cascader, DirectionProvider, MantineProvider } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(component: () => any, dir: 'ltr' | 'rtl' = 'ltr') {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(DirectionProvider, { initialDirection: dir }, () => component()),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('@mantine-vue/core/Cascader', () => {
  const data = [{ value: 'parent', label: 'Parent', children: [{ value: 'c', label: 'Child' }] }]

  it('opens Cascader with ArrowLeft and not ArrowRight', async () => {
    const onDropdownOpen = vi.fn()
    const wrapper = render(
      () => h(Cascader, { data, onDropdownOpen, comboboxProps: { withinPortal: false } }),
      'rtl',
    )
    const input = wrapper.find('input:not([type="hidden"])')

    await input.trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(onDropdownOpen).not.toHaveBeenCalled()

    await input.trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()
    expect(onDropdownOpen).toHaveBeenCalledTimes(1)
  })
})
