import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Button, ButtonGroup, ButtonGroupSection, MantineProvider } from '../../index'

function withProvider(
  component: any,
  props: Record<string, any> = {},
  children?: any,
  slots?: Record<string, any>,
) {
  return mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(component, props, slots ?? children)),
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

describe('@mantine-vue/core Button', () => {
  it('renders variant variables and label content', () => {
    const wrapper = withProvider(
      Button,
      { color: 'red.6', variant: 'outline', size: 'lg', radius: 'sm', justify: 'space-between' },
      () => 'Save',
    )
    const root = wrapper.find('button.mantine-Button-root')

    expect(root.attributes('type')).toBe('button')
    expect(root.attributes('data-variant')).toBe('outline')
    expect(root.attributes('style')).toContain('--button-height: var(--button-height-lg)')
    expect(root.attributes('style')).toContain('--button-padding-x: var(--button-padding-x-lg)')
    expect(root.attributes('style')).toContain('--button-radius: var(--mantine-radius-sm)')
    expect(root.attributes('style')).toContain('--button-color: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain(
      '--button-bd: 0.0625rem solid var(--mantine-color-red-6)',
    )
    expect(root.attributes('style')).toContain('--button-justify: space-between')
    expect(wrapper.find('.mantine-Button-label').text()).toBe('Save')
  })

  it('reactively updates variant attributes and styles', async () => {
    const variant = ref<'light' | 'transparent'>('light')
    const wrapper = mount({
      setup: () => ({ variant }),
      render() {
        return h(MantineProvider, { env: 'test' }, () =>
          h(
            Button,
            { color: 'blue', variant: this.variant },
            () => `Current variant: ${this.variant}`,
          ),
        )
      },
    })
    const root = () => wrapper.find('button.mantine-Button-root')

    expect(root().attributes('data-variant')).toBe('light')
    expect(root().attributes('style')).toContain('--button-bg: var(--mantine-color-blue-light)')
    expect(root().text()).toContain('Current variant: light')

    variant.value = 'transparent'
    await nextTick()

    expect(root().attributes('data-variant')).toBe('transparent')
    expect(root().attributes('style')).toContain('--button-bg: transparent')
    expect(root().text()).toContain('Current variant: transparent')
  })

  it('sets disabled and loading attributes through Box mods', () => {
    const wrapper = withProvider(Button, { loading: true }, () => 'Save')
    const root = wrapper.find('button.mantine-Button-root')

    expect(root.attributes('disabled')).toBeDefined()
    expect(root.attributes('data-loading')).toBe('true')
    expect(wrapper.find('.mantine-Button-loader').exists()).toBe(true)
    expect(wrapper.find('.mantine-Loader-root').exists()).toBe(true)
  })

  it('sets data-disabled without forcing native disabled when data-disabled is used', () => {
    const wrapper = withProvider(Button, { 'data-disabled': true }, () => 'Read only')
    const root = wrapper.find('button.mantine-Button-root')

    expect(root.attributes('data-disabled')).toBe('true')
    expect(root.attributes('disabled')).toBeUndefined()
  })

  it('renders left and right sections from props and scoped slots', () => {
    const wrapper = withProvider(
      Button,
      { leftSection: () => h('span', { id: 'left-prop' }, 'L') },
      undefined,
      {
        default: () => 'Save',
        rightSection: () => h('span', { id: 'right-slot' }, 'R'),
      },
    )

    expect(wrapper.find('.mantine-Button-section[data-position="left"]').text()).toBe('L')
    expect(wrapper.find('.mantine-Button-section[data-position="right"]').text()).toBe('R')
    expect(wrapper.find('#left-prop').exists()).toBe(true)
    expect(wrapper.find('#right-slot').exists()).toBe(true)
  })

  it('renders Button group and group section', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(ButtonGroup, { orientation: 'vertical', borderWidth: 2 }, () => [
            h(Button, null, () => 'A'),
            h(
              ButtonGroupSection,
              { variant: 'light', color: 'blue.6', size: 'compact-md' },
              () => 'B',
            ),
          ]),
        ),
    })
    const group = wrapper.find('.mantine-ButtonGroup-group')
    const section = wrapper.find('.mantine-ButtonGroupSection-groupSection')

    expect(group.attributes('role')).toBe('group')
    expect(group.attributes('data-orientation')).toBe('vertical')
    expect(group.attributes('style')).toContain('--button-border-width: 0.125rem')
    expect(section.attributes('style')).toContain(
      '--section-height: var(--section-height-compact-md)',
    )
    expect(section.attributes('style')).toContain(
      '--section-padding-x: var(--section-padding-x-compact-md)',
    )
    expect(section.attributes('style')).toContain('--section-bg: #228be6')
  })

  it('exposes static group components', () => {
    expect(Button.Group).toBe(ButtonGroup)
    expect(Button.GroupSection).toBe(ButtonGroupSection)
  })
})
