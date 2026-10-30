import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Switch } from '../../index'

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

describe('@mantine-vue/core/Switch', () => {
  it('keeps uncontrolled value on click when readOnly is set', async () => {
    const onChange = vi.fn()
    const wrapper = render(() => h(Switch, { defaultChecked: true, readOnly: true, onChange }))
    const input = wrapper.find<HTMLInputElement>('input[role="switch"]')

    input.element.click()
    await nextTick()

    expect(input.element.checked).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
  })
})
