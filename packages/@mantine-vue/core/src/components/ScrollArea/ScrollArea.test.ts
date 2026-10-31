import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, ScrollArea } from '../../index'

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

describe('@mantine-vue/core/ScrollArea', () => {
  it('does not set --scrollarea-offset-size by default', () => {
    const wrapper = render(() => h(ScrollArea, { scrollbarSize: 6 }))
    const root = wrapper.find('.mantine-ScrollArea-root').element as HTMLElement

    expect(root.style.getPropertyValue('--scrollarea-offset-size')).toBe('')
  })
})
