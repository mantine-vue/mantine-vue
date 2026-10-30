import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Chip, ChipGroup, MantineProvider } from '../../index'

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

describe('@mantine-vue/core/Chip', () => {
  it('keeps uncontrolled value on click when readOnly is set', async () => {
    const onChange = vi.fn()
    const wrapper = render(() =>
      h(Chip, { defaultChecked: true, readOnly: true, onChange }, () => 'chip'),
    )
    const input = wrapper.find<HTMLInputElement>('.mantine-Chip-input')

    input.element.click()
    await nextTick()

    expect(input.attributes('readonly')).toBeDefined()
    expect(input.element.checked).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not change Chip.Group value through a readOnly chip', async () => {
    const onChange = vi.fn()
    const wrapper = render(() =>
      h(ChipGroup, { multiple: true, value: [], onChange }, () =>
        h(Chip, { value: 'a', readOnly: true }, () => 'chip'),
      ),
    )

    wrapper.find<HTMLInputElement>('.mantine-Chip-input').element.click()
    await nextTick()

    expect(onChange).not.toHaveBeenCalled()
  })
})
