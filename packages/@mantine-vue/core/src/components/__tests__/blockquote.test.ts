import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Blockquote, MantineProvider } from '../../index'

function withProvider(
  props: Record<string, any> = {},
  children?: any,
  slots?: Record<string, any>,
) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () => h(Blockquote, props, slots ?? children)),
  })
}

describe('@mantine-vue/core Blockquote', () => {
  it('renders quote, icon, cite and variables', () => {
    const wrapper = withProvider(
      {
        icon: () => h('span', { id: 'icon' }, '"'),
        cite: 'Someone',
        color: 'red.6',
        iconSize: 32,
        radius: 'md',
        textWrap: 'balance',
      },
      () => 'Quote',
    )
    const root = wrapper.find('blockquote.mantine-Blockquote-root')

    expect(root.text()).toContain('Quote')
    expect(root.attributes('style')).toContain('--bq-bd: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain('--bq-icon-size: 2rem')
    expect(root.attributes('style')).toContain('--bq-radius: var(--mantine-radius-md)')
    expect(root.attributes('style')).toContain('--bq-text-wrap: balance')
    expect(wrapper.find('#icon').exists()).toBe(true)
    expect(wrapper.find('.mantine-Blockquote-cite').text()).toBe('Someone')
  })

  it('supports icon and cite slots', () => {
    const wrapper = withProvider({}, undefined, {
      default: () => 'Slot quote',
      icon: () => h('span', 'i'),
      cite: () => h('span', 'Slot cite'),
    })

    expect(wrapper.find('.mantine-Blockquote-icon').text()).toBe('i')
    expect(wrapper.find('.mantine-Blockquote-cite').text()).toBe('Slot cite')
    expect(wrapper.text()).toContain('Slot quote')
  })
})
