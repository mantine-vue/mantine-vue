import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { findTabbableDescendants } from './tabbable'
import { scopeTab, useFocusTrap } from './use-focus-trap'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('@mantine-vue/hooks/use-focus-trap', () => {
  function tab(shiftKey = false) {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true })
    return event
  }

  function createTrap(html: string) {
    const node = document.createElement('div')
    node.innerHTML = html
    document.body.appendChild(node)
    return node
  }

  it('moves focus through every tabbable element on Tab', () => {
    const node = createTrap('<button id="a"></button><a href="#" id="b"></a><input id="c" />')
    node.querySelector<HTMLElement>('#a')!.focus()

    scopeTab(node, tab())
    expect(document.activeElement?.id).toBe('b')

    scopeTab(node, tab())
    expect(document.activeElement?.id).toBe('c')

    scopeTab(node, tab())
    expect(document.activeElement?.id).toBe('a')
  })

  it('wraps backwards with Shift+Tab', () => {
    const node = createTrap('<button id="a"></button><button id="b"></button>')
    node.querySelector<HTMLElement>('#a')!.focus()

    scopeTab(node, tab(true))
    expect(document.activeElement?.id).toBe('b')
  })

  it('skips unchecked radios of a group with a checked radio', () => {
    const node = createTrap(
      '<button id="a"></button><input type="radio" name="r" id="r1" /><input type="radio" name="r" id="r2" checked /><button id="b"></button>',
    )
    node.querySelector<HTMLElement>('#a')!.focus()

    scopeTab(node, tab())
    expect(document.activeElement?.id).toBe('r2')

    scopeTab(node, tab())
    expect(document.activeElement?.id).toBe('b')
  })

  it('includes contenteditable, summary and media elements and orders positive tabindex first', () => {
    const node = createTrap(
      '<button id="a"></button><div contenteditable id="b"></div><details><summary id="c"></summary></details><video controls id="d"></video><button tabindex="2" id="e"></button>',
    )

    expect(findTabbableDescendants(node).map((item) => item.id)).toEqual(['e', 'a', 'b', 'c', 'd'])
  })

  it('leaves Tab to the nested active trap', async () => {
    const outerTrap: { set?: (node: any) => void } = {}
    const innerTrap: { set?: (node: any) => void } = {}
    const Host = defineComponent({
      setup() {
        outerTrap.set = useFocusTrap()
        innerTrap.set = useFocusTrap()
        return () =>
          h('div', { ref: outerTrap.set }, [
            h('button', { id: 'outer' }),
            h('div', { ref: innerTrap.set }, [
              h('button', { id: 'first' }),
              h('button', { id: 'last' }),
            ]),
          ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()

    document.querySelector<HTMLElement>('#last')!.focus()
    document.dispatchEvent(tab())
    expect(document.activeElement?.id).toBe('first')

    wrapper.unmount()
  })
})
