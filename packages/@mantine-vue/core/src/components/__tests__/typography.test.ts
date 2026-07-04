import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Typography } from '../../index'

describe('@mantine-vue/core Typography', () => {
  it('renders typographic content with root selector', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Typography, null, () => [h('h1', 'Heading'), h('p', 'Paragraph'), h('code', 'code')]),
        ),
    })

    expect(wrapper.find('.mantine-Typography-root').exists()).toBe(true)
    expect(wrapper.text()).toContain('Heading')
    expect(wrapper.text()).toContain('Paragraph')
    expect(wrapper.text()).toContain('code')
  })
})
