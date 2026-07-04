import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Fieldset, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(Fieldset, { legend: 'Legend', ...props }, () => 'Field content'),
      ),
  })
}

describe('@mantine-vue/core Fieldset', () => {
  it('renders legend and children', () => {
    const wrapper = withProvider()

    expect(wrapper.find('fieldset').exists()).toBe(true)
    expect(wrapper.find('legend').text()).toBe('Legend')
    expect(wrapper.text()).toContain('Field content')
  })

  it('supports variant and radius variables', () => {
    const wrapper = withProvider({ variant: 'filled', radius: 'sm' })
    const root = wrapper.find('.mantine-Fieldset-root')

    expect(root.attributes('data-variant')).toBe('filled')
    expect(root.attributes('style')).toContain('--fieldset-radius: var(--mantine-radius-sm)')
  })
})
