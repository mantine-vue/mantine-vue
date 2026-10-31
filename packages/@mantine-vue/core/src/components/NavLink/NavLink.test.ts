import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, NavLink } from '../../index'

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

describe('@mantine-vue/core/NavLink', () => {
  it('links NavLink with its collapsed children', async () => {
    const wrapper = render(() => h(NavLink, { label: 'Parent' }, () => h(NavLink, { label: 'C' })))
    const link = wrapper.find('.mantine-NavLink-root')

    expect(link.attributes('aria-expanded')).toBe('false')

    await link.trigger('click')

    expect(link.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find(`[id="${link.attributes('aria-controls')}"]`).exists()).toBe(true)
  })

  it('does not set aria attributes on NavLink without children', () => {
    const wrapper = render(() => h(NavLink, { label: 'Leaf' }))
    const link = wrapper.find('.mantine-NavLink-root')

    expect(link.attributes('aria-expanded')).toBeUndefined()
    expect(link.attributes('aria-controls')).toBeUndefined()
  })
})
