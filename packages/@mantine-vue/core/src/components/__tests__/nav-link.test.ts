import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, NavLink } from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core NavLink', () => {
  it('renders label, description and sections', () => {
    const wrapper = withProvider(() =>
      h(NavLink, {
        label: 'Dashboard',
        description: 'Overview',
        leftSection: () => h('span', { class: 'left-section' }, 'L'),
        rightSection: () => h('span', { class: 'right-section' }, 'R'),
        active: true,
      }),
    )

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.find('.left-section').exists()).toBe(true)
    expect(wrapper.find('.right-section').exists()).toBe(true)
    expect(wrapper.find('.mantine-NavLink-root').attributes('data-active')).toBe('true')
  })

  it('toggles nested children in uncontrolled mode', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(NavLink, { label: 'Parent', onChange }, () => h(NavLink, { label: 'Child' })),
    )

    const root = () => wrapper.find('.mantine-NavLink-root')
    expect(root().attributes('data-expanded')).toBeUndefined()

    await root().trigger('click')

    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(root().attributes('data-expanded')).toBe('true')

    await root().trigger('click')

    expect(onChange).toHaveBeenLastCalledWith(false)
    expect(root().attributes('data-expanded')).toBeUndefined()
  })

  it('respects controlled opened state', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(NavLink, { label: 'Parent', opened: false, onChange }, () =>
        h(NavLink, { label: 'Child' }),
      ),
    )

    await wrapper.find('.mantine-NavLink-root').trigger('click')

    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(wrapper.find('.mantine-NavLink-root').attributes('data-expanded')).toBeUndefined()
  })

  it('toggles nested children with Space key', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(NavLink, { label: 'Parent', onChange }, () => h(NavLink, { label: 'Child' })),
    )

    await wrapper.find('.mantine-NavLink-root').trigger('keydown', { code: 'Space' })

    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(wrapper.text()).toContain('Child')
  })

  it('supports disabled and noWrap states', () => {
    const wrapper = withProvider(() =>
      h(NavLink, { label: 'Disabled', disabled: true, noWrap: true, description: 'Description' }),
    )

    expect(wrapper.find('.mantine-NavLink-root').attributes('data-disabled')).toBe('true')
    expect(wrapper.find('.mantine-NavLink-body').attributes('data-no-wrap')).toBe('true')
  })
})
