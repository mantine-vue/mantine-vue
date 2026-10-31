import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Radio, RadioGroup } from '../../index'

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

describe('@mantine-vue/core/Radio', () => {
  it('keeps uncontrolled value on click when readOnly is set', async () => {
    const onChange = vi.fn()
    const wrapper = render(() => h(Radio, { readOnly: true, value: 'a', onChange }))
    const input = wrapper.find<HTMLInputElement>('input[type="radio"]')

    input.element.click()
    await nextTick()

    expect(input.attributes('readonly')).toBeDefined()
    expect(input.element.checked).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not change Radio.Group value through a readOnly radio', async () => {
    const onChange = vi.fn()
    const wrapper = render(() =>
      h(RadioGroup, { value: null, onChange }, () => h(Radio, { value: 'a', readOnly: true })),
    )

    wrapper.find<HTMLInputElement>('input[type="radio"]').element.click()
    await nextTick()

    expect(onChange).not.toHaveBeenCalled()
  })
})
