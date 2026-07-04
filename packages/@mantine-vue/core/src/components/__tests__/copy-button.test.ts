import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Button, CopyButton, MantineProvider } from '../../index'

describe('@mantine-vue/core CopyButton', () => {
  it('exposes copied state and copy handler through scoped slot', async () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            CopyButton,
            { value: 'copy me' },
            {
              default: ({ copied, copy }: any) =>
                h(Button, { onClick: copy }, () => (copied ? 'Copied' : 'Copy')),
            },
          ),
        ),
    })

    expect(wrapper.find('button').text()).toContain('Copy')
    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(wrapper.find('button').text()).toContain('Copied')
  })
})
