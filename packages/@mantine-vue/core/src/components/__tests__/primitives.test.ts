import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Box,
  Flex,
  Group,
  MantineProvider,
  OptionalPortal,
  Portal,
  Space,
  Stack,
  VisuallyHidden,
} from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core primitive components', () => {
  it('resolves Box style props without forwarding them as HTML attributes', () => {
    const wrapper = mount(Box, {
      props: {
        bg: 'red.5',
        c: 'blue',
        my: 'xl',
        mx: -8,
        bdrs: 'md',
        fz: 'sm',
        pos: 'relative',
      },
      slots: { default: () => 'My component' },
    })
    const node = wrapper.find('div')
    const style = node.attributes('style')

    expect(style).toContain('background: var(--mantine-color-red-5)')
    expect(style).toContain('color: var(--mantine-color-blue-text)')
    expect(style).toContain('margin-block: var(--mantine-spacing-xl)')
    expect(style).toContain('margin-inline: -0.5rem')
    expect(style).toContain('border-radius: var(--mantine-radius-md)')
    expect(style).toContain('font-size: var(--mantine-font-size-sm)')
    expect(style).toContain('position: relative')
    expect(node.attributes('bg')).toBeUndefined()
    expect(node.attributes('my')).toBeUndefined()
  })

  it('generates responsive styles for Box style props', () => {
    const wrapper = mount(Box, {
      props: {
        p: { base: 'sm', md: 'xl' },
        bg: { base: 'red.5', sm: 'blue.6' },
      },
    })
    const node = wrapper.find('div')

    expect(node.classes().some((className) => className.startsWith('mantine-vue-'))).toBe(true)
    expect(wrapper.html()).toContain('padding: var(--mantine-spacing-sm)')
    expect(wrapper.html()).toContain('background: var(--mantine-color-red-5)')
    expect(wrapper.html()).toContain('@media (min-width: 48em)')
    expect(wrapper.html()).toContain('@media (min-width: 62em)')
  })

  it('passes Box children to component prop as a slot function', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Component = defineComponent({
      setup(_props, { slots }) {
        return () => h('section', slots.default?.())
      },
    })

    try {
      const wrapper = mount(Box, {
        props: { component: Component },
        slots: { default: () => 'Component child' },
      })

      expect(wrapper.find('section').text()).toBe('Component child')
      expect(warn.mock.calls.flat().join('\n')).not.toContain(
        'Non-function value encountered for default slot',
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('renders VisuallyHidden through Box and style API', () => {
    const wrapper = withProvider(VisuallyHidden, {}, () => 'Hidden label')
    const node = wrapper.find('span')

    expect(node.exists()).toBe(true)
    expect(node.classes()).toContain('mantine-VisuallyHidden-root')
    expect(node.text()).toBe('Hidden label')
  })

  it('renders Space dimensions through Box sizing props', () => {
    const wrapper = withProvider(Space, { w: 16, h: '2rem' })
    const node = wrapper.find('div')

    expect(node.attributes('style')).toContain('width: 1rem')
    expect(node.attributes('style')).toContain('height: 2rem')
    expect(node.attributes('style')).toContain('min-width: 1rem')
    expect(node.attributes('style')).toContain('min-height: 2rem')
  })

  it('resolves Flex style props and responsive inline styles', () => {
    const wrapper = withProvider(Flex, {
      gap: 'md',
      align: 'center',
      direction: { base: 'column', sm: 'row' },
    })

    const node = wrapper.find('.mantine-Flex-root')
    expect(node.attributes('style')).toContain('gap: var(--mantine-spacing-md)')
    expect(node.attributes('style')).toContain('align-items: center')
    expect(wrapper.html()).toContain('@media (min-width: 48em)')
  })

  it('resolves Stack and Group variables through createVarsResolver', () => {
    const stack = withProvider(Stack, { gap: 'xl', align: 'center' })
    expect(stack.find('.mantine-Stack-root').attributes('style')).toContain(
      '--stack-gap: var(--mantine-spacing-xl)',
    )

    const group = withProvider(Group, { grow: true, gap: 'sm' }, () => [
      h('div', '1'),
      h('div', '2'),
    ])
    const node = group.find('.mantine-Group-root')

    expect(node.attributes('data-grow')).toBe('true')
    expect(node.attributes('style')).toContain('--group-gap: var(--mantine-spacing-sm)')
    expect(node.attributes('style')).toContain('--group-child-width')
  })

  it('disables OptionalPortal in test env but Portal uses Vue Teleport', async () => {
    const optional = withProvider(OptionalPortal, { withinPortal: true }, () => h('div', 'Inline'))
    expect(optional.text()).toContain('Inline')

    const portal = mount(Portal, {
      attachTo: document.body,
      slots: { default: () => h('div', { id: 'portal-child' }, 'Portal') },
    })

    await nextTick()

    expect(
      document.querySelector('[data-mantine-shared-portal-node] #portal-child')?.textContent,
    ).toBe('Portal')
    portal.unmount()
  })
})
