import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Loader, MantineProvider, Overlay, Paper, UnstyledButton } from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core reusable primitives', () => {
  it('renders UnstyledButton as a button by default', () => {
    const wrapper = withProvider(UnstyledButton, {}, () => 'Click')
    const button = wrapper.find('button')

    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(button.classes()).toContain('mantine-UnstyledButton-root')
  })

  it('allows UnstyledButton polymorphic component override', () => {
    const wrapper = withProvider(UnstyledButton, { component: 'a', href: '#' }, () => 'Link')
    const anchor = wrapper.find('a')

    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('type')).toBeUndefined()
  })

  it('resolves Paper variables and border modifier', () => {
    const wrapper = withProvider(Paper, { radius: 'lg', shadow: 'md', withBorder: true })
    const paper = wrapper.find('.mantine-Paper-root')

    expect(paper.attributes('data-with-border')).toBe('true')
    expect(paper.attributes('style')).toContain('--paper-radius: var(--mantine-radius-lg)')
    expect(paper.attributes('style')).toContain('--paper-shadow: var(--mantine-shadow-md)')
  })

  it('resolves Overlay variables and modifiers', () => {
    const wrapper = withProvider(Overlay, {
      color: '#fff',
      backgroundOpacity: 0.25,
      blur: 4,
      radius: 'sm',
      center: true,
      fixed: true,
    })
    const overlay = wrapper.find('.mantine-Overlay-root')

    expect(overlay.attributes('data-center')).toBe('true')
    expect(overlay.attributes('data-fixed')).toBe('true')
    expect(overlay.attributes('style')).toContain('--overlay-bg: rgba(255, 255, 255, 0.25)')
    expect(overlay.attributes('style')).toContain('--overlay-filter: blur(0.25rem)')
    expect(overlay.attributes('style')).toContain('--overlay-radius: var(--mantine-radius-sm)')
  })

  it('renders Loader variants through loader registry', () => {
    const dots = withProvider(Loader, { type: 'dots', size: 'lg', color: 'red.6' })
    expect(dots.find('.mantine-Loader-root').attributes('style')).toContain(
      '--loader-size: var(--loader-size-lg)',
    )
    expect(dots.findAll('span').length).toBeGreaterThanOrEqual(4)

    const custom = withProvider(Loader, {}, () => h('span', { id: 'custom-loader' }, 'Loading'))
    expect(custom.find('#custom-loader').text()).toBe('Loading')
  })
})
