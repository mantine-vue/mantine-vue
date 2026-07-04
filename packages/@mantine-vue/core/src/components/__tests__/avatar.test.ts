import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Avatar, AvatarGroup, getInitials, getInitialsColor, MantineProvider } from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core Avatar', () => {
  it('generates initials and initials colors', () => {
    expect(getInitials('John Mol')).toBe('JM')
    expect(getInitials('John')).toBe('JO')
    expect(getInitialsColor('John Doe', ['red', 'blue'])).toBe('blue')
  })

  it('renders placeholder without src and image with src', async () => {
    const onError = vi.fn()
    const wrapper = withProvider(Avatar, {
      src: 'image.png',
      alt: 'test-alt',
      imageProps: { 'aria-label': 'test-label', onError },
    })

    expect(wrapper.find('img').attributes('src')).toBe('image.png')
    expect(wrapper.find('img').attributes('alt')).toBe('test-alt')
    expect(wrapper.find('img').attributes('aria-label')).toBe('test-label')

    await wrapper.find('img').trigger('error')
    expect(onError).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.mantine-Avatar-placeholder').exists()).toBe(true)
  })

  it('renders initials placeholder and variant variables', () => {
    const wrapper = withProvider(Avatar, {
      name: 'John Doe',
      color: 'initials',
      size: 'lg',
      radius: 'md',
      variant: 'light',
    })
    const root = wrapper.find('.mantine-Avatar-root')

    expect(wrapper.find('.mantine-Avatar-placeholder').text()).toBe('JD')
    expect(root.attributes('style')).toContain('--avatar-size: var(--avatar-size-lg)')
    expect(root.attributes('style')).toContain('--avatar-radius: var(--mantine-radius-md)')
    expect(root.attributes('style')).toContain('--avatar-bg: var(--mantine-color-lime-light)')
  })

  it('sets within-group attribute and group spacing', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(AvatarGroup, { spacing: 'lg' }, () => [h(Avatar), h(Avatar)]),
        ),
    })

    expect(wrapper.find('.mantine-AvatarGroup-group').attributes('style')).toContain(
      '--ag-spacing: var(--mantine-spacing-lg)',
    )
    wrapper.findAll('.mantine-Avatar-root').forEach((avatar) => {
      expect(avatar.attributes('data-within-group')).toBe('true')
    })
  })

  it('exposes static Group component', () => {
    expect(Avatar.Group).toBe(AvatarGroup)
  })
})
