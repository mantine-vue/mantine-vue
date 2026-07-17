import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  MantineProvider,
} from '../../index'

function defaultChildren() {
  return h(DataList.Item, null, () => [
    h(DataList.ItemLabel, null, () => 'Label'),
    h(DataList.ItemValue, null, () => 'Value'),
  ])
}

function render(props: Record<string, any> = {}, children: any = defaultChildren) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(DataList, props, children)),
  })
}

describe('@mantine-vue/core DataList', () => {
  it('renders dl element', () => {
    expect(render().find('dl').exists()).toBe(true)
  })

  it('renders dt and dd elements', () => {
    const wrapper = render()
    expect(wrapper.find('dt').exists()).toBe(true)
    expect(wrapper.find('dd').exists()).toBe(true)
    expect(wrapper.find('dt').text()).toBe('Label')
    expect(wrapper.find('dd').text()).toBe('Value')
  })

  it('sets data-orientation attribute', () => {
    const wrapper = render({ orientation: 'horizontal' })
    expect(wrapper.find('.mantine-DataList-root').attributes('data-orientation')).toBe('horizontal')

    const vertical = render({ orientation: 'vertical' })
    expect(vertical.find('.mantine-DataList-root').attributes('data-orientation')).toBe('vertical')
  })

  it('sets data-with-divider attribute', () => {
    const wrapper = render({ withDivider: true })
    expect(wrapper.find('.mantine-DataList-root').attributes('data-with-divider')).toBeDefined()
  })

  it('sets label width css variable', () => {
    const wrapper = render({ labelWidth: 200 })
    expect(wrapper.find('.mantine-DataList-root').attributes('style')).toContain(
      '--data-list-label-width: 200px',
    )
  })

  it('sets gap and size css variables', () => {
    const wrapper = render({ gap: 'xl', size: 'lg' })
    const style = wrapper.find('.mantine-DataList-root').attributes('style')
    expect(style).toContain('--data-list-gap: var(--mantine-spacing-xl)')
    expect(style).toContain('--data-list-fz: var(--mantine-font-size-lg)')
  })

  it('exposes sub-components as static properties', () => {
    expect(DataList.Item).toBe(DataListItem)
    expect(DataList.ItemLabel).toBe(DataListItemLabel)
    expect(DataList.ItemValue).toBe(DataListItemValue)
  })
})
