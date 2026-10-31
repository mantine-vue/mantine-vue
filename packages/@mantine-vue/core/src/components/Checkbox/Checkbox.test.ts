import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Checkbox, MantineProvider } from '../../index'

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

describe('@mantine-vue/core/Checkbox', () => {
  it('forwards readonly to the Checkbox input', () => {
    const wrapper = render(() => h(Checkbox, { readOnly: true }))
    expect(wrapper.find('input[type="checkbox"]').attributes('readonly')).toBeDefined()
  })
})
