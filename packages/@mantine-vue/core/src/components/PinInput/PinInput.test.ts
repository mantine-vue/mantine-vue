import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, PinInput } from '../../index'

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

describe('@mantine-vue/core/PinInput', () => {
  it('ignores Delete, Backspace and paste in PinInput and keeps arrow navigation', async () => {
    const wrapper = render(() => h(PinInput, { defaultValue: '1234', readOnly: true }))
    const inputs = wrapper.findAll<HTMLInputElement>('input.mantine-PinInput-input')
    const values = () => inputs.map((input) => input.element.value)

    await inputs[0].trigger('keydown', { key: 'Delete' })
    await inputs[3].trigger('keydown', { key: 'Backspace' })
    await inputs[0].trigger('paste', { clipboardData: { getData: () => '5678' } })
    expect(values()).toEqual(['1', '2', '3', '4'])

    inputs[0].element.focus()
    await inputs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(inputs[1].element)
  })
})
