import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Burger, MantineProvider, VisuallyHidden } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Burger, props, children)),
  })
}

describe('@mantine-vue/core Burger', () => {
  it('renders burger variables and accessible hidden label', () => {
    const wrapper = withProvider(
      {
        color: 'red.6',
        size: 'lg',
        lineSize: 3,
        transitionDuration: 150,
        transitionTimingFunction: 'linear',
      },
      () => h(VisuallyHidden, null, () => 'Menu'),
    )
    const root = wrapper.find('button.mantine-Burger-root')

    expect(root.attributes('type')).toBe('button')
    expect(root.attributes('style')).toContain('--burger-color: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain('--burger-size: var(--burger-size-lg)')
    expect(root.attributes('style')).toContain('--burger-line-size: 0.1875rem')
    expect(root.attributes('style')).toContain('--burger-transition-duration: 150ms')
    expect(root.attributes('style')).toContain('--burger-transition-timing-function: linear')
    expect(wrapper.find('.mantine-VisuallyHidden-root').text()).toBe('Menu')
  })

  it('sets data-opened attribute based on opened prop', () => {
    const opened = withProvider({ opened: true })
    expect(opened.find('.mantine-Burger-burger').attributes('data-opened')).toBe('true')

    const closed = withProvider({ opened: false })
    expect(closed.find('.mantine-Burger-burger').attributes('data-opened')).toBeUndefined()
  })
})
