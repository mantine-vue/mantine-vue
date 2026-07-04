import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Indicator, MantineProvider } from '../../index'
import { getPositionVariables } from '../Indicator'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Indicator, props, children)),
  })
}

describe('@mantine-vue/core Indicator', () => {
  it('returns position variables for offset object', () => {
    expect(getPositionVariables('bottom-end', { x: 12, y: 20 })).toMatchObject({
      '--indicator-bottom': '1.25rem',
      '--indicator-right': '0.75rem',
      '--indicator-translate-x': '50%',
      '--indicator-translate-y': '50%',
    })
  })

  it('renders formatted label and variable contract', () => {
    const wrapper = withProvider(
      {
        label: 100,
        maxValue: 99,
        color: 'red.6',
        size: 14,
        radius: 'xl',
        position: 'bottom-start',
        offset: 8,
        zIndex: 300,
      },
      () => h('span', 'Target'),
    )
    const root = wrapper.find('.mantine-Indicator-root')
    const indicator = wrapper.find('.mantine-Indicator-indicator')

    expect(indicator.text()).toBe('99+')
    expect(root.text()).toContain('Target')
    expect(root.attributes('style')).toContain('--indicator-color: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain('--indicator-size: 0.875rem')
    expect(root.attributes('style')).toContain('--indicator-radius: var(--mantine-radius-xl)')
    expect(root.attributes('style')).toContain('--indicator-z-index: 300')
    expect(root.attributes('style')).toContain('--indicator-bottom: 0.5rem')
    expect(root.attributes('style')).toContain('--indicator-left: 0.5rem')
  })

  it('supports disabled, showZero, inline and indicator mods', () => {
    expect(
      withProvider({ label: 'Hidden', disabled: true })
        .find('.mantine-Indicator-indicator')
        .exists(),
    ).toBe(false)
    expect(
      withProvider({ label: 0, showZero: false }).find('.mantine-Indicator-indicator').exists(),
    ).toBe(false)

    const wrapper = withProvider({
      label: 'Live',
      inline: true,
      withBorder: true,
      processing: true,
    })
    const root = wrapper.find('.mantine-Indicator-root')
    const indicator = wrapper.find('.mantine-Indicator-indicator')

    expect(root.attributes('data-inline')).toBe('true')
    expect(indicator.attributes('data-with-label')).toBe('true')
    expect(indicator.attributes('data-with-border')).toBe('true')
    expect(indicator.attributes('data-processing')).toBe('true')
  })
})
