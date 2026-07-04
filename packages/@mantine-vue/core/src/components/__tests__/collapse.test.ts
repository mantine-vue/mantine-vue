import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Collapse, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Collapse, props, children)),
  })
}

describe('@mantine-vue/core Collapse', () => {
  it('renders expanded content with vertical collapse props', () => {
    const wrapper = withProvider({ expanded: true }, () => h('div', 'Content'))
    const root = wrapper.find('div')

    expect(root.attributes('aria-hidden')).toBe('false')
    expect(root.attributes('inert')).toBe('false')
    expect(root.attributes('style')).toContain('box-sizing: border-box')
    expect(root.text()).toBe('Content')
  })

  it('keeps collapsed content mounted by default', () => {
    const wrapper = withProvider({ expanded: false }, () => h('div', 'Content'))
    const root = wrapper.find('div')

    expect(root.attributes('aria-hidden')).toBe('true')
    expect(root.attributes('inert')).toBe('true')
    expect(root.attributes('style')).toContain('height: 0px')
    expect(root.text()).toBe('Content')
  })

  it('unmounts collapsed content when keepMounted is false', () => {
    const wrapper = withProvider({ expanded: false, keepMounted: false }, () => h('div', 'Content'))
    expect(wrapper.text()).not.toContain('Content')
  })

  it('supports horizontal orientation and transition callbacks', async () => {
    const onTransitionEnd = vi.fn()
    const wrapper = withProvider(
      { expanded: true, orientation: 'horizontal', onTransitionEnd },
      () => h('div', 'Content'),
    )
    const root = wrapper.find('div')

    expect(root.attributes('style')).toContain('box-sizing: border-box')
    const event = new Event('transitionend') as TransitionEvent
    Object.defineProperty(event, 'propertyName', { value: 'width' })
    root.element.dispatchEvent(event)
    expect(onTransitionEnd).toHaveBeenCalledTimes(1)
  })
})
