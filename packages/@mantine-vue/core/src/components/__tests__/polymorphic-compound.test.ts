import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { AppShell, AppShellSection, Card, CardSection, MantineProvider } from '../../index'

// These components require parent context, so each is mounted inside its parent.

function inParent(
  parent: any,
  parentProps: Record<string, any>,
  child: any,
  childProps: Record<string, any> = {},
) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(parent, parentProps, () => h(child, childProps, () => 'content')),
      ),
  })
}

const CASES = [
  {
    name: 'CardSection',
    parent: Card,
    parentProps: {},
    child: CardSection,
    selector: '.mantine-Card-section',
  },
  {
    name: 'AppShellSection',
    parent: AppShell,
    parentProps: {},
    child: AppShellSection,
    selector: '.mantine-AppShell-section',
  },
]

describe('@mantine-vue/core polymorphic compound components', () => {
  it.each(CASES)('$name renders its documented default root inside its parent', (c: any) => {
    const root = inParent(c.parent, c.parentProps, c.child).find(c.selector)

    expect(root.exists()).toBe(true)
    expect(root.element.tagName).toBe('DIV')
  })

  it.each(CASES)('$name honours an overridden root', (c: any) => {
    const root = inParent(c.parent, c.parentProps, c.child, {
      component: 'a',
      href: '/docs',
    }).find(c.selector)

    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/docs')
  })

  it.each(CASES)('$name assigns the root DOM node to rootRef', async (c: any) => {
    const rootRef = ref<Element | null>(null)
    inParent(c.parent, c.parentProps, c.child, { rootRef })
    await nextTick()

    expect(rootRef.value).toBeInstanceOf(Element)
    expect(rootRef.value?.matches(c.selector)).toBe(true)
  })

  it.each(CASES)('$name exposes the static factory API', (c: any) => {
    expect(typeof c.child.extend).toBe('function')
    expect(c.child.classes).toBeTruthy()
  })

  it('extend() on a compound component accepts defaultProps', () => {
    expect(CardSection.extend({ defaultProps: { withBorder: true } })).toEqual({
      defaultProps: { withBorder: true },
    })
  })
})
