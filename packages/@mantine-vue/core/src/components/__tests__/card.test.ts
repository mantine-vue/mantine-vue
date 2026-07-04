import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Card, CardSection, MantineProvider } from '../../index'

function withProvider(children: any, props: Record<string, any> = {}) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Card, props, children)),
  })
}

describe('@mantine-vue/core Card', () => {
  it('renders root variables and orientation', () => {
    const wrapper = withProvider(() => 'Content', {
      padding: 'lg',
      shadow: 'sm',
      radius: 'md',
      withBorder: true,
      orientation: 'horizontal',
    })
    const root = wrapper.find('.mantine-Card-root')

    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.attributes('data-with-border')).toBe('true')
    expect(root.attributes('style')).toContain('--card-padding: var(--mantine-spacing-lg)')
    expect(root.attributes('style')).toContain('--paper-radius: var(--mantine-radius-md)')
  })

  it('marks first and last sections and passes orientation to sections', () => {
    const wrapper = withProvider(
      () => [
        h(CardSection, { id: 'first' }),
        h('div', 'Content'),
        h(CardSection, { id: 'last', withBorder: true, inheritPadding: true }),
      ],
      { orientation: 'horizontal' },
    )
    const sections = wrapper.findAll('.mantine-Card-section')

    expect(sections).toHaveLength(2)
    expect(sections[0].attributes('data-first-section')).toBe('')
    expect(sections[0].attributes('data-last-section')).toBeUndefined()
    expect(sections[0].attributes('data-orientation')).toBe('horizontal')
    expect(sections[1].attributes('data-first-section')).toBeUndefined()
    expect(sections[1].attributes('data-last-section')).toBe('')
    expect(sections[1].attributes('data-with-border')).toBe('true')
    expect(sections[1].attributes('data-inherit-padding')).toBe('true')
  })

  it('exposes static Section component', () => {
    expect(Card.Section).toBe(CardSection)
  })
})
