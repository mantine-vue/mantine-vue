import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { AspectRatio, Center, Container, Divider, MantineProvider } from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core display and layout components', () => {
  it('renders Center with inline modifier', () => {
    const wrapper = withProvider(Center, { inline: true }, () => 'Centered')
    const node = wrapper.find('.mantine-Center-root')

    expect(node.exists()).toBe(true)
    expect(node.attributes('data-inline')).toBe('true')
    expect(node.text()).toBe('Centered')
  })

  it('resolves Container size and strategy modifiers', () => {
    const wrapper = withProvider(Container, { size: 'lg', strategy: 'grid', fluid: true }, () =>
      h('div', 'Content'),
    )
    const node = wrapper.find('.mantine-Container-root')

    expect(node.attributes('data-strategy')).toBe('grid')
    expect(node.attributes('data-fluid')).toBe('true')
    expect(node.attributes('style')).toBeUndefined()
  })

  it('resolves AspectRatio CSS variable', () => {
    const wrapper = withProvider(AspectRatio, { ratio: 16 / 9 }, () => h('img'))
    const node = wrapper.find('.mantine-AspectRatio-root')

    expect(node.attributes('style')).toContain('--ar-ratio: 1.7777777777777777')
    expect(node.find('img').exists()).toBe(true)
  })

  it('renders Divider with color, variant, size and label', () => {
    const wrapper = withProvider(Divider, {
      color: 'red.6',
      variant: 'dashed',
      size: 'sm',
      label: 'Section',
      labelPosition: 'left',
    })
    const root = wrapper.find('.mantine-Divider-root')
    const label = wrapper.find('.mantine-Divider-label')

    expect(root.attributes('role')).toBe('separator')
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.attributes('data-with-label')).toBe('true')
    expect(root.attributes('style')).toContain('--divider-border-style: dashed')
    expect(root.attributes('style')).toContain('--divider-size: var(--divider-size-sm)')
    expect(root.attributes('style')).toContain('--divider-color: var(--mantine-color-red-6)')
    expect(label.attributes('data-position')).toBe('left')
    expect(label.text()).toBe('Section')
  })
})
