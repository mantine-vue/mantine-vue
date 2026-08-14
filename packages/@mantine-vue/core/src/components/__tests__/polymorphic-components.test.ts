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
  CloseButton,
  ColorSwatch,
  Flex,
  Highlight,
  Image,
  MantineProvider,
  NavLink,
  Overlay,
  Paper,
  Text,
  UnstyledButton,
} from '../../index'

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

interface PolymorphicCase {
  name: string
  component: any
  selector: string
  tag: string
  required: Record<string, any>
}

const CASES: PolymorphicCase[] = [
  {
    name: 'Overlay',
    component: Overlay,
    selector: '.mantine-Overlay-root',
    tag: 'DIV',
    required: {},
  },
  {
    name: 'ActionIcon',
    component: ActionIcon,
    selector: '.mantine-ActionIcon-root',
    tag: 'BUTTON',
    required: {},
  },
  { name: 'Flex', component: Flex, selector: '.mantine-Flex-root', tag: 'DIV', required: {} },
  {
    name: 'NavLink',
    component: NavLink,
    selector: '.mantine-NavLink-root',
    tag: 'A',
    required: { label: 'Docs' },
  },
  { name: 'Anchor', component: Anchor, selector: '.mantine-Anchor-root', tag: 'A', required: {} },
  { name: 'Avatar', component: Avatar, selector: '.mantine-Avatar-root', tag: 'DIV', required: {} },
  {
    name: 'UnstyledButton',
    component: UnstyledButton,
    selector: '.mantine-UnstyledButton-root',
    tag: 'BUTTON',
    required: {},
  },
  { name: 'Center', component: Center, selector: '.mantine-Center-root', tag: 'DIV', required: {} },
  { name: 'Badge', component: Badge, selector: '.mantine-Badge-root', tag: 'DIV', required: {} },
  {
    name: 'BackgroundImage',
    component: BackgroundImage,
    selector: '.mantine-BackgroundImage-root',
    tag: 'DIV',
    required: { src: '/i.png' },
  },
  { name: 'Card', component: Card, selector: '.mantine-Card-root', tag: 'DIV', required: {} },
  {
    name: 'ColorSwatch',
    component: ColorSwatch,
    selector: '.mantine-ColorSwatch-root',
    tag: 'DIV',
    required: { color: 'red' },
  },
  {
    name: 'Image',
    component: Image,
    selector: '.mantine-Image-root',
    tag: 'IMG',
    required: { src: '/i.png' },
  },
  {
    name: 'Button',
    component: Button,
    selector: '.mantine-Button-root',
    tag: 'BUTTON',
    required: {},
  },
  { name: 'Text', component: Text, selector: '.mantine-Text-root', tag: 'P', required: {} },
  { name: 'Paper', component: Paper, selector: '.mantine-Paper-root', tag: 'DIV', required: {} },
  {
    name: 'CloseButton',
    component: CloseButton,
    selector: '.mantine-CloseButton-root',
    tag: 'BUTTON',
    required: {},
  },
  {
    // Renders `Text`, so the root is a <p>, but keeps its own static selector.
    name: 'Highlight',
    component: Highlight,
    selector: '.mantine-Highlight-root',
    tag: 'P',
    required: { highlight: 'ig' },
  },
]

describe('@mantine-vue/core polymorphic components', () => {
  it.each(CASES)(
    '$name renders its documented default root',
    ({ component, selector, tag, required }: PolymorphicCase) => {
      const root = render(component, required).find(selector)

      expect(root.exists()).toBe(true)
      expect(root.element.tagName).toBe(tag)
    },
  )

  it.each(CASES)(
    '$name renders an anchor when component="a"',
    ({ component, selector, required }: PolymorphicCase) => {
      const root = render(component, { ...required, component: 'a', href: '/docs' }).find(selector)

      expect(root.element.tagName).toBe('A')
      expect(root.attributes('href')).toBe('/docs')
    },
  )

  it.each(CASES)(
    '$name renders a custom Vue component as the root',
    ({ component, selector, required }: PolymorphicCase) => {
      const wrapper = render(component, { ...required, component: RouterLinkStub, to: '/docs' })

      expect(wrapper.find(selector).attributes('data-router-link')).toBe('true')
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
    },
  )

  it.each(CASES)(
    '$name forwards root attributes to the selected root',
    ({ component, selector, required }: PolymorphicCase) => {
      const root = render(component, { ...required, id: 'poly-root', 'aria-label': 'Root' }).find(
        selector,
      )

      expect(root.attributes('id')).toBe('poly-root')
      expect(root.attributes('aria-label')).toBe('Root')
    },
  )

  it.each(CASES)(
    '$name applies style props to the selected root',
    ({ component, selector, required }: PolymorphicCase) => {
      const style =
        render(component, { ...required, mt: 'md' })
          .find(selector)
          .attributes('style') ?? ''

      expect(style).toContain('margin-top: var(--mantine-spacing-md)')
    },
  )

  it.each(CASES)(
    '$name assigns the root DOM node to rootRef',
    async ({ component, selector, required }: PolymorphicCase) => {
      const rootRef = ref<Element | null>(null)
      render(component, { ...required, rootRef })
      await nextTick()

      expect(rootRef.value).toBeInstanceOf(Element)
      expect(rootRef.value?.matches(selector)).toBe(true)
    },
  )

  it.each(CASES)(
    '$name follows the selected root for rootRef',
    async ({ component, required }: PolymorphicCase) => {
      const rootRef = ref<Element | null>(null)
      render(component, { ...required, component: 'a', href: '/docs', rootRef })
      await nextTick()

      expect(rootRef.value).toBeInstanceOf(HTMLAnchorElement)
    },
  )

  it.each(CASES)('$name exposes the static factory API', ({ component }: PolymorphicCase) => {
    expect(typeof component.extend).toBe('function')
    expect(typeof component.withProps).toBe('function')
    expect(component.classes).toBeTruthy()
    expect(component.classes.root).toBeTruthy()
  })

  it.each(CASES)(
    '$name does not leak Mantine props as DOM attributes',
    ({ component, selector, required }: PolymorphicCase) => {
      const root = render(component, {
        ...required,
        mt: 'md',
        classNames: {},
        styles: {},
        unstyled: false,
      }).find(selector)

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
    },
  )

  it('keeps compound components available after migration', () => {
    expect(ActionIcon.Group).toBeTruthy()
    expect(ActionIcon.GroupSection).toBeTruthy()
    expect(Avatar.Group).toBeTruthy()
    expect(Card.Section).toBeTruthy()
    expect(Button.Group).toBeTruthy()
    expect(Button.GroupSection).toBeTruthy()
  })

  it('exposes varsResolver exactly where the payload declares CSS variables', () => {
    const withVars = [
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
      Text,
      Paper,
    ]

    for (const component of withVars) {
      expect(typeof (component as any).varsResolver).toBe('function')
    }
    for (const component of [Flex, UnstyledButton, Center]) {
      expect((component as any).varsResolver).toBeUndefined()
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
