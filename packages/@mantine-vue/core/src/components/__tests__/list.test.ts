import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { List, ListItem, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(List, props, children)),
  })
}

describe('@mantine-vue/core List', () => {
  it('changes root element and passes ordered attributes', () => {
    const wrapper = withProvider({ type: 'ordered', start: 5, reversed: true }, () =>
      h(ListItem, { value: 5 }, () => 'Item'),
    )
    const root = wrapper.find('ol.mantine-List-root')

    expect(root.exists()).toBe(true)
    expect(root.attributes('start')).toBe('5')
    expect(root.attributes('reversed')).toBe('')
    expect(wrapper.find('li').attributes('value')).toBe('5')
  })

  it('renders list icon for all items and allows item override', () => {
    const wrapper = withProvider(
      { icon: () => h('span', { 'data-testid': 'list-icon' }, '>') },
      () => [
        h(ListItem, null, () => 'Uses list icon'),
        h(
          ListItem,
          { icon: () => h('span', { 'data-testid': 'item-icon' }, '*') },
          () => 'Uses item icon',
        ),
      ],
    )

    expect(wrapper.findAll('[data-testid="list-icon"]')).toHaveLength(1)
    expect(wrapper.find('[data-testid="item-icon"]').exists()).toBe(true)
    expect(wrapper.findAll('.mantine-List-itemIcon')).toHaveLength(2)
  })

  it('sets root variables and item mods', () => {
    const wrapper = withProvider(
      { size: 'sm', spacing: 'lg', center: true, withPadding: true },
      () => h(ListItem, null, () => 'Item'),
    )
    const root = wrapper.find('.mantine-List-root')
    const item = wrapper.find('.mantine-List-item')

    expect(root.attributes('data-with-padding')).toBe('true')
    expect(root.attributes('style')).toContain('--list-fz: var(--mantine-font-size-sm)')
    expect(root.attributes('style')).toContain('--list-lh: var(--mantine-line-height-sm)')
    expect(root.attributes('style')).toContain('--list-spacing: var(--mantine-spacing-lg)')
    expect(item.attributes('data-centered')).toBe('true')
  })

  it('exposes static Item component', () => {
    expect(List.Item).toBe(ListItem)
  })
})
