import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Badge, MantineProvider, ThemeIcon } from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core variant display components', () => {
  it('renders Badge with sections and variant variables', () => {
    const wrapper = withProvider(
      Badge,
      {
        color: 'red.6',
        variant: 'outline',
        size: 'lg',
        radius: 'sm',
        leftSection: 'L',
        rightSection: 'R',
      },
      () => 'Status',
    )
    const root = wrapper.find('.mantine-Badge-root')

    expect(root.attributes('data-variant')).toBe('outline')
    expect(root.attributes('data-with-left-section')).toBe('true')
    expect(root.attributes('data-with-right-section')).toBe('true')
    expect(root.attributes('style')).toContain('--badge-height: var(--badge-height-lg)')
    expect(root.attributes('style')).toContain('--badge-radius: var(--mantine-radius-sm)')
    expect(root.attributes('style')).toContain('--badge-color: var(--mantine-color-red-6)')
    expect(wrapper.find('.mantine-Badge-label').text()).toBe('Status')
  })

  it('renders dot and circle Badge modifiers', () => {
    const wrapper = withProvider(Badge, {
      color: 'blue.6',
      variant: 'dot',
      circle: true,
      fullWidth: true,
    })
    const root = wrapper.find('.mantine-Badge-root')

    expect(root.attributes('data-variant')).toBe('dot')
    expect(root.attributes('data-circle')).toBe('true')
    expect(root.attributes('data-block')).toBe('true')
    expect(root.attributes('style')).toContain('--badge-dot-color: var(--mantine-color-blue-6)')
  })

  it('renders ThemeIcon with variant resolver variables', () => {
    const wrapper = withProvider(
      ThemeIcon,
      { color: 'green', variant: 'light', size: 'xl', radius: 'md' },
      () => h('span', 'i'),
    )
    const root = wrapper.find('.mantine-ThemeIcon-root')

    expect(root.attributes('data-variant')).toBe('light')
    expect(root.attributes('style')).toContain('--ti-size: var(--ti-size-xl)')
    expect(root.attributes('style')).toContain('--ti-radius: var(--mantine-radius-md)')
    expect(root.attributes('style')).toContain('--ti-bg: var(--mantine-color-green-light)')
    expect(root.attributes('style')).toContain('--ti-color: var(--mantine-color-green-light-color)')
    expect(root.text()).toBe('i')
  })
})
