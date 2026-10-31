import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Divider, MantineProvider } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(component: () => any) {
  const wrapper = mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => component()),
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

describe('@mantine-vue/core/Divider', () => {
  it('sets aria-orientation on Divider', () => {
    const wrapper = render(() => h(Divider, { orientation: 'vertical' }))
    expect(wrapper.find('.mantine-Divider-root').attributes('aria-orientation')).toBe('vertical')
  })
})
