import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  AppShell,
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  DEFAULT_THEME,
  MantineProvider,
  getAppShellVariables,
} from '../../index'

function renderShell(props: Record<string, any> = {}) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(AppShell, props, () => [
          h(AppShellHeader, null, () => 'Header'),
          h(AppShellNavbar, null, () => [
            h(AppShellSection, null, () => 'Navigation'),
            h(AppShellSection, { grow: true }, () => 'Growing navigation'),
          ]),
          h(AppShellAside, null, () => 'Aside'),
          h(AppShellMain, null, () => 'Main'),
          h(AppShellFooter, null, () => 'Footer'),
        ]),
      ),
  })
}

describe('@mantine-vue/core AppShell variables', () => {
  it('creates base fixed-layout variables', () => {
    const result = getAppShellVariables({
      navbar: { width: 240, breakpoint: 'sm' },
      aside: { width: 180, breakpoint: 'md' },
      header: { height: 60 },
      footer: { height: 40 },
      padding: 'md',
      theme: DEFAULT_THEME,
      mode: 'fixed',
    })

    expect(result.baseStyles['--app-shell-navbar-width']).toBe('15rem')
    expect(result.baseStyles['--app-shell-navbar-offset']).toBe('15rem')
    expect(result.baseStyles['--app-shell-aside-width']).toBe('11.25rem')
    expect(result.baseStyles['--app-shell-header-offset']).toBe('3.75rem')
    expect(result.baseStyles['--app-shell-footer-offset']).toBe('2.5rem')
    expect(result.baseStyles['--app-shell-padding']).toBe('var(--mantine-spacing-md)')
  })

  it('creates responsive collapse and static-grid variables', () => {
    const result = getAppShellVariables({
      navbar: { width: { base: 200, lg: 300 }, breakpoint: 'sm', collapsed: { mobile: true } },
      aside: { width: 160, breakpoint: 'md', collapsed: { desktop: true } },
      header: { height: { base: 50, md: 70 } },
      padding: { base: 'xs', md: 'lg' },
      theme: DEFAULT_THEME,
      mode: 'static',
    })
    const serialized = JSON.stringify(result.media)

    expect(result.baseStyles['--app-shell-main-grid-row']).toBe('2')
    expect(result.baseStyles['--app-shell-header-position']).toBe('sticky')
    expect(serialized).toContain('--app-shell-navbar-transform')
    expect(serialized).toContain('--app-shell-aside-display')
    expect(serialized).toContain('--app-shell-padding')
    expect(serialized).toContain('--app-shell-header-height')
  })
})

describe('@mantine-vue/core AppShell', () => {
  it('renders all semantic compound components and inherited state', () => {
    const wrapper = renderShell({
      header: { height: 60 },
      footer: { height: 40 },
      navbar: { width: 220, breakpoint: 'sm' },
      aside: { width: 180, breakpoint: 'md' },
      zIndex: 120,
    })

    expect(wrapper.find('header').text()).toBe('Header')
    expect(wrapper.find('nav').text()).toContain('Navigation')
    expect(wrapper.find('aside').text()).toBe('Aside')
    expect(wrapper.find('main').text()).toBe('Main')
    expect(wrapper.find('footer').text()).toBe('Footer')
    expect(wrapper.find('header').attributes('data-with-border')).toBeDefined()
    expect(wrapper.find('nav').attributes('style')).toContain(
      '--app-shell-navbar-z-index: calc(120 + 1)',
    )
    expect(wrapper.find('.mantine-AppShell-section[data-grow]').exists()).toBe(true)
  })

  it('injects responsive styles and supports static mode', () => {
    const wrapper = renderShell({
      mode: 'static',
      id: 'dashboard-shell',
      header: { height: 64 },
      navbar: { width: { base: 200, md: 260 }, breakpoint: 'sm' },
      padding: { base: 'xs', md: 'lg' },
    })
    const root = wrapper.find('#dashboard-shell')
    const inlineStyles = root.find('style[data-mantine-inline-styles]').element.textContent ?? ''

    expect(root.attributes('data-mode')).toBe('static')
    expect(inlineStyles).toContain('#dashboard-shell')
    expect(inlineStyles).toContain('--app-shell-navbar-width: 12.5rem')
    expect(inlineStyles).toContain('@media')
  })

  it('hides structural regions when disabled but keeps main content', () => {
    const wrapper = renderShell({ disabled: true })

    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.find('main').text()).toBe('Main')
  })

  it('exposes the Mantine compound API', () => {
    expect(AppShell.Header).toBe(AppShellHeader)
    expect(AppShell.Navbar).toBe(AppShellNavbar)
    expect(AppShell.Aside).toBe(AppShellAside)
    expect(AppShell.Main).toBe(AppShellMain)
    expect(AppShell.Footer).toBe(AppShellFooter)
    expect(AppShell.Section).toBe(AppShellSection)
  })
})
