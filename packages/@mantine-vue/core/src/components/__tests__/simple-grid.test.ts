import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, SimpleGrid } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(SimpleGrid, props, children)),
  })
}

describe('@mantine-vue/core SimpleGrid', () => {
  it('renders media variables and grid children', () => {
    const wrapper = withProvider(
      {
        cols: { base: 1, sm: 2 },
        spacing: 'lg',
        verticalSpacing: 'sm',
        autoRows: 'minmax(0, auto)',
      },
      () => [h('div', 'A'), h('div', 'B')],
    )
    const root = wrapper.find('.mantine-SimpleGrid-root')
    const style = wrapper.find('style[data-mantine-inline-styles="true"]').html()

    expect(root.exists()).toBe(true)
    expect(root.text()).toContain('A')
    expect(style).toContain('--sg-cols: 1')
    expect(style).toContain('--sg-spacing-x: var(--mantine-spacing-lg)')
    expect(style).toContain('--sg-spacing-y: var(--mantine-spacing-sm)')
    expect(style).toContain('@media (min-width: 48em)')
    expect(style).toContain('--sg-cols: 2')
  })

  it('supports container queries and auto columns', () => {
    const wrapper = withProvider({
      type: 'container',
      minColWidth: 120,
      autoFlow: 'auto-fit',
      spacing: { base: 'xs', '42em': 'md' },
    })
    const root = wrapper.find('.mantine-SimpleGrid-root')
    const style = wrapper.find('style[data-mantine-inline-styles="true"]').html()

    expect(wrapper.find('.mantine-SimpleGrid-container').exists()).toBe(true)
    expect(root.attributes('data-auto-cols')).toBe('auto-fit')
    expect(style).toContain('--sg-min-col-width: 7.5rem')
    expect(style).toContain('@container simple-grid (min-width: 42em)')
    expect(style).toContain('--sg-spacing-x: var(--mantine-spacing-md)')
    expect(style).not.toContain('min-width: base')
  })
})
