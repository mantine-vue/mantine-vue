import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  ActionIcon,
  Anchor,
  Avatar,
  BackgroundImage,
  Badge,
  Button,
  Card,
  Center,
  ColorSwatch,
  Flex,
  Image,
  MantineProvider,
  NavLink,
  Overlay,
  UnstyledButton,
} from '../../index'

/** Runtime contract shared by every component migrated to `polymorphicFactory`. */

const RouterLinkStub = defineComponent({
  name: 'RouterLinkStub',
  props: { to: { type: String, required: true } },
  setup(props, { attrs, slots }) {
    return () => h('a', { ...attrs, href: props.to, 'data-router-link': 'true' }, slots.default?.())
  },
})

function render(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

/** component, selector, default root tag, required props */
const CASES: [string, any, string, string, Record<string, any>][] = [
  ['Overlay', Overlay, '.mantine-Overlay-root', 'DIV', {}],
  ['ActionIcon', ActionIcon, '.mantine-ActionIcon-root', 'BUTTON', {}],
  ['Flex', Flex, '.mantine-Flex-root', 'DIV', {}],
  ['NavLink', NavLink, '.mantine-NavLink-root', 'A', { label: 'Docs' }],
  ['Anchor', Anchor, '.mantine-Anchor-root', 'A', {}],
  ['Avatar', Avatar, '.mantine-Avatar-root', 'DIV', {}],
  ['UnstyledButton', UnstyledButton, '.mantine-UnstyledButton-root', 'BUTTON', {}],
  ['Center', Center, '.mantine-Center-root', 'DIV', {}],
  ['Badge', Badge, '.mantine-Badge-root', 'DIV', {}],
  ['BackgroundImage', BackgroundImage, '.mantine-BackgroundImage-root', 'DIV', { src: '/i.png' }],
  ['Card', Card, '.mantine-Card-root', 'DIV', {}],
  ['ColorSwatch', ColorSwatch, '.mantine-ColorSwatch-root', 'DIV', { color: 'red' }],
  ['Image', Image, '.mantine-Image-root', 'IMG', { src: '/i.png' }],
  ['Button', Button, '.mantine-Button-root', 'BUTTON', {}],
]

describe('@mantine-vue/core polymorphic components', () => {
  it.each(CASES)('%s renders its documented default root', (_name, comp, sel, tag, required) => {
    const root = render(comp, required).find(sel)

    expect(root.exists()).toBe(true)
    expect(root.element.tagName).toBe(tag)
  })

  it.each(CASES)('%s renders an anchor when component="a"', (_name, comp, sel, _tag, required) => {
    const root = render(comp, { ...required, component: 'a', href: '/docs' }).find(sel)

    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/docs')
  })

  it.each(CASES)('%s renders a custom Vue component as the root', (_n, comp, sel, _t, required) => {
    const wrapper = render(comp, { ...required, component: RouterLinkStub, to: '/docs' })

    expect(wrapper.find(sel).attributes('data-router-link')).toBe('true')
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
  })

  it.each(CASES)('%s forwards root attributes to the selected root', (_n, comp, sel, _t, req) => {
    const root = render(comp, { ...req, id: 'poly-root', 'aria-label': 'Root' }).find(sel)

    expect(root.attributes('id')).toBe('poly-root')
    expect(root.attributes('aria-label')).toBe('Root')
  })

  it.each(CASES)('%s applies style props to the selected root', (_n, comp, sel, _t, required) => {
    const style =
      render(comp, { ...required, mt: 'md' })
        .find(sel)
        .attributes('style') ?? ''

    expect(style).toContain('margin-top: var(--mantine-spacing-md)')
  })

  it.each(CASES)('%s assigns the root DOM node to rootRef', async (_n, comp, sel, _t, required) => {
    const rootRef = ref<Element | null>(null)
    render(comp, { ...required, rootRef })
    await nextTick()

    expect(rootRef.value).toBeInstanceOf(Element)
    expect(rootRef.value?.matches(sel)).toBe(true)
  })

  it.each(CASES)('%s follows the selected root for rootRef', async (_n, comp, _s, _t, required) => {
    const rootRef = ref<Element | null>(null)
    render(comp, { ...required, component: 'a', href: '/docs', rootRef })
    await nextTick()

    expect(rootRef.value).toBeInstanceOf(HTMLAnchorElement)
  })

  it.each(CASES)('%s exposes the static factory API', (_name, comp) => {
    expect(typeof comp.extend).toBe('function')
    expect(typeof comp.withProps).toBe('function')
    expect(comp.classes).toBeTruthy()
    expect(comp.classes.root).toBeTruthy()
  })

  it.each(CASES)('%s does not leak Mantine props as DOM attributes', (_n, comp, sel, _t, req) => {
    const root = render(comp, {
      ...req,
      mt: 'md',
      classNames: {},
      styles: {},
      unstyled: false,
    }).find(sel)

    for (const leaked of [
      'classnames',
      'styles',
      'vars',
      'unstyled',
      'component',
      'rootref',
      'mt',
    ]) {
      expect(root.attributes(leaked)).toBeUndefined()
    }
  })

  it('keeps compound components available after migration', () => {
    expect(ActionIcon.Group).toBeTruthy()
    expect(ActionIcon.GroupSection).toBeTruthy()
    expect(Avatar.Group).toBeTruthy()
    expect(Card.Section).toBeTruthy()
    expect(Button.Group).toBeTruthy()
    expect(Button.GroupSection).toBeTruthy()
  })

  it('exposes varsResolver exactly where the payload declares CSS variables', () => {
    for (const comp of [
      Overlay,
      ActionIcon,
      NavLink,
      Avatar,
      Badge,
      BackgroundImage,
      Card,
      ColorSwatch,
      Image,
      Anchor,
    ]) {
      expect(typeof (comp as any).varsResolver).toBe('function')
    }
    for (const comp of [Flex, UnstyledButton, Center]) {
      expect((comp as any).varsResolver).toBeUndefined()
    }
  })

  it('applies extend() defaults through MantineProvider for a migrated component', () => {
    const wrapper = mount({
      render: () =>
        h(
          MantineProvider,
          {
            env: 'test',
            theme: { components: { Badge: Badge.extend({ defaultProps: { radius: 'xs' } }) } },
          },
          () => h(Badge, null, () => 'New'),
        ),
    })

    expect(wrapper.find('.mantine-Badge-root').attributes('style')).toContain(
      '--badge-radius: var(--mantine-radius-xs)',
    )
  })

  it('withProps() merges fixed props and keeps the polymorphic root', () => {
    const LinkIcon = ActionIcon.withProps({ component: 'a', variant: 'subtle' })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(LinkIcon, { href: '/docs' }, () => '+')),
    })
    const root = wrapper.find('.mantine-ActionIcon-root')

    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/docs')
    expect(root.attributes('data-variant')).toBe('subtle')
  })

  it('Image keeps img as a default rather than a hard-coded root', () => {
    expect(render(Image, { src: '/i.png' }).find('.mantine-Image-root').element.tagName).toBe('IMG')
    expect(
      render(Image, { src: '/i.png', component: 'div' }).find('.mantine-Image-root').element
        .tagName,
    ).toBe('DIV')
  })
})
