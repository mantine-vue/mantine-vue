import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, MultiSelect } from '../../index'

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

describe('@mantine-vue/core/MultiSelect', () => {
  it('does not remove the last MultiSelect value with Backspace', async () => {
    const wrapper = render(() =>
      h(MultiSelect, {
        data: ['a', 'b'],
        defaultValue: ['a', 'b'],
        searchable: true,
        readOnly: true,
      }),
    )

    await wrapper.find('input:not([type="hidden"])').trigger('keydown', { key: 'Backspace' })
    expect(wrapper.findAll('.mantine-Pill-root')).toHaveLength(2)
  })
})
