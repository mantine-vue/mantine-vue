import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { MantineProvider, Menu } from '../../index'

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

describe('@mantine-vue/core/Menu', () => {
  it('sets aria-disabled on Menu.Item with data-disabled', async () => {
    const wrapper = render(() =>
      h(
        Menu,
        { opened: true, withinPortal: false, transitionProps: { duration: 0 } },
        {
          default: () => [
            h(Menu.Target, null, () => h('button', 'Target')),
            h(Menu.Dropdown, null, () => [
              h(Menu.Item, { 'data-disabled': '' }, () => 'Disabled'),
              h(Menu.Item, null, () => 'Enabled'),
            ]),
          ],
        },
      ),
    )
    await flushPromises()

    const items = wrapper.findAll('[role="menuitem"]')
    expect(items[0].attributes('aria-disabled')).toBe('true')
    expect(items[1].attributes('aria-disabled')).toBeUndefined()
  })
})
