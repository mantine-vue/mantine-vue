import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, TagsInput } from '../../index'

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

describe('@mantine-vue/core/TagsInput', () => {
  it('does not add tags on paste in TagsInput', async () => {
    const onPaste = vi.fn()
    const wrapper = render(() =>
      h(TagsInput, { defaultValue: ['a'], readOnly: true, onPaste } as any),
    )

    await wrapper.find('input:not([type="hidden"])').trigger('paste', {
      clipboardData: { getData: () => 'b,c' },
    })
    expect(wrapper.findAll('.mantine-Pill-root')).toHaveLength(1)
    expect(onPaste).toHaveBeenCalledTimes(1)
  })
})
