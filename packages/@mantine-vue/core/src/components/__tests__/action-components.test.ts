import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
  CloseButton,
  MantineProvider,
  Transition,
} from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
    },
    {
      global: {
        stubs: {
          transition: false,
          Transition: false,
        },
      },
    },
  )
}

describe('@mantine-vue/core action components', () => {
  it('renders Transition slot only when mounted in test environment', () => {
    const mounted = withProvider(Transition, { mounted: true }, ({ opacity }: any) =>
      h('span', { style: { opacity } }, 'visible'),
    )
    expect(mounted.find('span').text()).toBe('visible')

    const hidden = withProvider(Transition, { mounted: false }, () => h('span', 'hidden'))
    expect(hidden.find('span').exists()).toBe(false)
  })

  it('renders ActionIcon variant variables and icon slot', () => {
    const wrapper = withProvider(
      ActionIcon,
      { color: 'red.6', variant: 'outline', size: 'lg', radius: 'sm' },
      () => h('span', { id: 'icon' }, 'A'),
    )
    const root = wrapper.find('button.mantine-ActionIcon-root')

    expect(root.attributes('type')).toBe('button')
    expect(root.classes()).toContain('mantine-active')
    expect(root.attributes('data-variant')).toBe('outline')
    expect(root.attributes('style')).toContain('--ai-size: var(--ai-size-lg)')
    expect(root.attributes('style')).toContain('--ai-radius: var(--mantine-radius-sm)')
    expect(root.attributes('style')).toContain('--ai-color: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain(
      '--ai-bd: 0.0625rem solid var(--mantine-color-red-6)',
    )
    expect(wrapper.find('#icon').text()).toBe('A')
  })

  it('renders ActionIcon loading state through Loader and Transition', () => {
    const wrapper = withProvider(ActionIcon, { loading: true }, () => h('span', 'Save'))
    const root = wrapper.find('button.mantine-ActionIcon-root')

    expect(root.attributes('disabled')).toBeDefined()
    expect(root.classes()).not.toContain('mantine-active')
    expect(root.attributes('data-loading')).toBe('true')
    expect(wrapper.find('.mantine-ActionIcon-loader').exists()).toBe(true)
    expect(wrapper.find('.mantine-Loader-root').exists()).toBe(true)
  })

  it('renders ActionIcon group and group section', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(ActionIconGroup, { orientation: 'vertical', borderWidth: 2 }, () => [
            h(ActionIcon, null, () => 'A'),
            h(ActionIconGroupSection, { variant: 'light', color: 'blue.6', size: 'lg' }, () => 'B'),
          ]),
        ),
    })
    const group = wrapper.find('.mantine-ActionIconGroup-group')
    const section = wrapper.find('.mantine-ActionIconGroupSection-groupSection')

    expect(group.attributes('role')).toBe('group')
    expect(group.attributes('data-orientation')).toBe('vertical')
    expect(group.attributes('style')).toContain('--ai-border-width: 0.125rem')
    expect(section.attributes('style')).toContain('--section-height: var(--section-height-lg)')
    expect(section.attributes('style')).toContain('--section-bg: #228be6')
  })

  it('renders CloseButton with default close icon and size variables', () => {
    const wrapper = withProvider(CloseButton, {
      size: 'xl',
      radius: 'md',
      iconSize: 12,
      disabled: true,
    })
    const root = wrapper.find('button.mantine-CloseButton-root')

    expect(root.attributes('disabled')).toBeDefined()
    expect(root.attributes('data-disabled')).toBe('true')
    expect(root.attributes('style')).toContain('--cb-size: var(--cb-size-xl)')
    expect(root.attributes('style')).toContain('--cb-radius: var(--mantine-radius-md)')
    expect(root.attributes('style')).toContain('--cb-icon-size: 0.75rem')
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
