import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Box, MantineProvider } from '../../index'

const render = (node: () => any) =>
  mount({ render: () => h(MantineProvider, { env: 'test' }, node) })

describe('@mantine-vue/core Box style props received as attrs', () => {
  it('never forwards style props to the element, including undefined ones', () => {
    const wrapper = render(() =>
      h(Box, { id: 'box', p: 'md', m: undefined, fz: 'sm', 'data-test': 'x', title: 'Title' }),
    )
    const element = wrapper.find('#box')

    expect(element.attributes()).toMatchObject({ 'data-test': 'x', title: 'Title' })
    expect(element.attributes()).not.toHaveProperty('p')
    expect(element.attributes()).not.toHaveProperty('m')
    expect(element.attributes()).not.toHaveProperty('fz')
    expect(element.attributes('style')).toContain('padding: var(--mantine-spacing-md)')
  })

  it('applies style props in canonical order, whatever order they were passed in', () => {
    // `mt` is passed first; if it were applied first, the `margin` shorthand would override it
    const wrapper = render(() => h(Box, { id: 'box', mt: 4, m: 10 }))
    const { style } = wrapper.find('#box').element as HTMLElement

    expect(style.marginTop).toBe('0.25rem')
    expect(style.marginBottom).toBe('0.625rem')
  })

  it('removes styles and the responsive rule when style props are removed', async () => {
    const styleProps = ref<Record<string, any>>({ p: { base: 'xs', md: 'xl' }, c: 'red' })
    const wrapper = render(() => h(Box, { id: 'box', ...styleProps.value }))
    expect(wrapper.findAll('style[data-mantine-inline-styles="true"]')).toHaveLength(1)

    styleProps.value = {}
    await nextTick()

    const element = wrapper.find('#box')
    expect(element.attributes('style') ?? '').toBe('')
    expect(element.classes().some((name) => name.startsWith('mantine-vue-'))).toBe(false)
    expect(wrapper.findAll('style[data-mantine-inline-styles="true"]')).toHaveLength(0)
  })

  it('keeps exposing the root element through template refs', () => {
    const boxRef = ref<any>(null)
    const rootRef = ref<Element | null>(null)
    render(() => h(Box, { ref: boxRef, rootRef, component: 'section', p: 'md' }))

    expect(boxRef.value.$el.tagName).toBe('SECTION')
    expect(boxRef.value.rootElement).toBe(boxRef.value.$el)
    expect(rootRef.value).toBe(boxRef.value.$el)
  })

  it('still treats non-style props as props', () => {
    const wrapper = render(() =>
      h(Box, {
        id: 'box',
        component: 'span',
        variant: 'filled',
        size: 'lg',
        mod: { active: true },
        hiddenFrom: 'sm',
      }),
    )
    const element = wrapper.find('#box')

    expect(element.element.tagName).toBe('SPAN')
    expect(element.attributes()).toMatchObject({
      'data-variant': 'filled',
      'data-size': 'lg',
      'data-active': 'true',
    })
    expect(element.classes()).toContain('mantine-hidden-from-sm')
    expect(element.attributes()).not.toHaveProperty('variant')
    expect(element.attributes()).not.toHaveProperty('mod')
  })
})
