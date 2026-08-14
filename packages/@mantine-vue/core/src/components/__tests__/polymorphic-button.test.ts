import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Button, MantineProvider } from '../../index'

/** Runtime behaviour of the polymorphic factory, covered in depth on `Button`. */

function withProvider(props: Record<string, any> = {}, children?: any, theme?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test', theme }, () => h(Button, props, children)),
  })
}

const RouterLinkStub = defineComponent({
  name: 'RouterLinkStub',
  props: { to: { type: String, required: true } },
  setup(props, { attrs, slots }) {
    return () => h('a', { ...attrs, href: props.to, 'data-router-link': 'true' }, slots.default?.())
  },
})

describe('@mantine-vue/core polymorphicFactory (Button)', () => {
  it('renders the default root as a button', () => {
    const wrapper = withProvider({}, () => 'Label')
    const root = wrapper.find('.mantine-Button-root')

    expect(root.element.tagName).toBe('BUTTON')
    expect(root.attributes('type')).toBe('button')
    expect(root.text()).toContain('Label')
  })

  it('renders an anchor when component="a"', () => {
    const wrapper = withProvider({ component: 'a', href: '/docs' }, () => 'Documentation')
    const root = wrapper.find('.mantine-Button-root')

    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/docs')
    // `type` is only added for a real button root
    expect(root.attributes('type')).toBeUndefined()
  })

  it('renders a custom Vue component as the root', () => {
    const wrapper = withProvider({ component: RouterLinkStub, to: '/docs' }, () => 'Documentation')
    const root = wrapper.find('.mantine-Button-root')

    expect(root.attributes('data-router-link')).toBe('true')
    expect(root.attributes('href')).toBe('/docs')
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
  })

  it('forwards root attributes and listeners to the selected root', async () => {
    const onClick = vi.fn()
    const wrapper = withProvider({
      component: 'a',
      href: '/docs',
      target: '_blank',
      rel: 'noreferrer',
      id: 'docs-link',
      'aria-label': 'Docs',
      onClick,
    })
    const root = wrapper.find('.mantine-Button-root')

    expect(root.attributes('target')).toBe('_blank')
    expect(root.attributes('rel')).toBe('noreferrer')
    expect(root.attributes('id')).toBe('docs-link')
    expect(root.attributes('aria-label')).toBe('Docs')

    await root.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not leak Mantine props onto the DOM as invalid attributes', () => {
    const wrapper = withProvider({
      component: 'a',
      href: '/docs',
      variant: 'light',
      fullWidth: true,
      loading: false,
      radius: 'md',
      color: 'red.6',
      justify: 'space-between',
      autoContrast: true,
    })
    const root = wrapper.find('.mantine-Button-root')

    for (const leaked of [
      'fullwidth',
      'loading',
      'radius',
      'color',
      'justify',
      'autocontrast',
      'classnames',
      'styles',
      'vars',
      'unstyled',
      'component',
      'rootref',
      'leftsection',
      'rightsection',
    ]) {
      expect(root.attributes(leaked)).toBeUndefined()
    }

    // `variant` is intentionally surfaced as a data attribute, not a bare attribute
    expect(root.attributes('variant')).toBeUndefined()
    expect(root.attributes('data-variant')).toBe('light')
  })

  it('applies style props to the selected root', () => {
    const wrapper = withProvider({ component: 'a', href: '/docs', mt: 'md', bg: 'red.5' })
    const root = wrapper.find('.mantine-Button-root')
    const style = root.attributes('style') ?? ''

    expect(root.element.tagName).toBe('A')
    expect(style).toContain('margin-top: var(--mantine-spacing-md)')
    expect(style).toContain('background: var(--mantine-color-red-5)')
  })

  it('keeps compound components and Styles API statics available', () => {
    expect(Button.Group).toBeTruthy()
    expect(Button.GroupSection).toBeTruthy()
    expect(Button.classes.root).toBeTruthy()
    expect(typeof Button.varsResolver).toBe('function')
    expect(typeof Button.extend).toBe('function')
    expect(typeof Button.withProps).toBe('function')
  })

  it('extend() returns the theme component config unchanged', () => {
    const input = { defaultProps: { variant: 'light' as const } }
    expect(Button.extend(input)).toEqual(input)
  })

  it('applies extend() defaults through MantineProvider', () => {
    const wrapper = withProvider({}, () => 'Label', {
      components: {
        Button: Button.extend({
          defaultProps: { variant: 'light' },
          classNames: { root: 'themed-root' },
        }),
      },
    })
    const root = wrapper.find('.mantine-Button-root')

    expect(root.attributes('data-variant')).toBe('light')
    expect(root.classes()).toContain('themed-root')
  })

  it('lets a directly passed prop override an extend() default', () => {
    const wrapper = withProvider({ variant: 'outline' }, () => 'Label', {
      components: { Button: Button.extend({ defaultProps: { variant: 'light' } }) },
    })

    expect(wrapper.find('.mantine-Button-root').attributes('data-variant')).toBe('outline')
  })

  it('withProps() merges fixed props and keeps the polymorphic root', () => {
    const LinkButton = Button.withProps({ component: 'a', variant: 'subtle' })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(LinkButton, { href: '/docs' }, () => 'Docs')),
    })
    const root = wrapper.find('.mantine-Button-root')

    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/docs')
    expect(root.attributes('data-variant')).toBe('subtle')
  })

  it('withProps() gives caller props precedence over fixed props', () => {
    const LinkButton = Button.withProps({ component: 'a', variant: 'subtle' })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(LinkButton, { href: '/docs', variant: 'outline' }, () => 'Docs'),
        ),
    })

    expect(wrapper.find('.mantine-Button-root').attributes('data-variant')).toBe('outline')
  })

  it('withProps() keeps the static API on the returned component', () => {
    const LinkButton = Button.withProps({ component: 'a' })

    expect(typeof LinkButton.extend).toBe('function')
    expect((LinkButton as any).Group).toBeTruthy()
  })

  it('assigns the root DOM node to rootRef, following the selected root', async () => {
    const buttonRef = ref<HTMLButtonElement | null>(null)
    mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(Button, { rootRef: buttonRef }, () => 'Label')),
    })
    await nextTick()

    expect(buttonRef.value).toBeInstanceOf(HTMLButtonElement)
    expect(buttonRef.value?.classList.contains('mantine-Button-root')).toBe(true)

    const anchorRef = ref<HTMLAnchorElement | null>(null)
    mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Button, { component: 'a', href: '/docs', rootRef: anchorRef }, () => 'Docs'),
        ),
    })
    await nextTick()

    expect(anchorRef.value).toBeInstanceOf(HTMLAnchorElement)
  })

  it('accepts a callback rootRef, which is the template-facing form', async () => {
    const received: (Element | null)[] = []
    mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Button, { rootRef: (node: Element | null) => received.push(node) }, () => 'Label'),
        ),
    })
    await nextTick()

    expect(received.at(-1)).toBeInstanceOf(HTMLButtonElement)
  })

  it('exposes the root node as rootElement for ref-based access', async () => {
    const wrapper = withProvider({}, () => 'Label')
    await nextTick()

    const instance = wrapper.findComponent(Button as any)
    expect(instance.vm.rootElement).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders slots after factory wrapping', () => {
    const wrapper = withProvider(
      {},
      {
        default: () => 'Label',
        leftSection: () => h('span', { id: 'left' }, 'L'),
        rightSection: () => h('span', { id: 'right' }, 'R'),
      },
    )

    expect(wrapper.find('#left').text()).toBe('L')
    expect(wrapper.find('#right').text()).toBe('R')
    expect(wrapper.find('.mantine-Button-label').text()).toContain('Label')
  })

  it('keeps the slot taking precedence over the equivalent prop', () => {
    const wrapper = withProvider(
      { leftSection: () => h('span', { id: 'from-prop' }, 'P') },
      { default: () => 'Label', leftSection: () => h('span', { id: 'from-slot' }, 'S') },
    )

    expect(wrapper.find('#from-slot').exists()).toBe(true)
    expect(wrapper.find('#from-prop').exists()).toBe(false)
  })

  it('keeps disabled behaviour on a button root and drops it on an anchor root', () => {
    const button = withProvider({ disabled: true })
    expect(button.find('.mantine-Button-root').attributes('disabled')).toBeDefined()
    expect(button.find('.mantine-Button-root').attributes('data-disabled')).toBeDefined()

    const anchor = withProvider({ component: 'a', href: '/docs', loading: true })
    expect(anchor.find('.mantine-Button-root').attributes('data-loading')).toBeDefined()
  })
})
