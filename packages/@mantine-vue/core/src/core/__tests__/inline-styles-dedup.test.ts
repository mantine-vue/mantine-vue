import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, KeepAlive, nextTick, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { Box, Flex, InlineStyles, MantineProvider } from '../../index'

const INLINE_STYLES = 'style[data-mantine-inline-styles="true"]'
const responsiveBox = (key: number | string) =>
  h(Box, { key, p: { base: 6, sm: 8 }, class: 'card' }, () => `Card ${key}`)

function mountList(ids: { value: number[] }, providerProps: Record<string, any> = {}) {
  return mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test', ...providerProps }, () => ids.value.map(responsiveBox)),
    },
    { attachTo: document.body },
  )
}

describe('@mantine-vue/core shared inline styles', () => {
  it('renders one style element for many components with the same responsive props', () => {
    const wrapper = mountList(ref(Array.from({ length: 50 }, (_, i) => i)))
    const cards = wrapper.findAll('.card')
    const styles = wrapper.findAll(INLINE_STYLES)

    expect(cards).toHaveLength(50)
    expect(styles).toHaveLength(1)

    const className = cards[0].classes().find((name) => name.startsWith('mantine-vue-'))!
    expect(cards.every((card) => card.classes().includes(className))).toBe(true)
    expect(styles[0].element.textContent).toContain(`.${className}{padding: 0.375rem;}`)
    expect(styles[0].element.textContent).toContain('@media (min-width: 48em)')
    wrapper.unmount()
  })

  it('keeps one style element per distinct rule', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => [
          h(Box, { p: { base: 'xs', md: 'xl' } }),
          h(Box, { p: { base: 'xs', md: 'xl' } }),
          h(Box, { m: { base: 'xs', md: 'xl' } }),
        ]),
    })

    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(2)
  })

  it('moves the rule to another component when its owner unmounts', async () => {
    const ids = ref([1, 2, 3])
    const wrapper = mountList(ids)
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    ids.value = [2, 3]
    await nextTick()
    expect(wrapper.findAll('.card')).toHaveLength(2)
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    ids.value = [3]
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    ids.value = []
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(0)

    ids.value = [4, 5]
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)
    wrapper.unmount()
  })

  it('survives replacing the whole list in one update', async () => {
    const ids = ref(Array.from({ length: 20 }, (_, i) => i))
    const wrapper = mountList(ids)

    ids.value = Array.from({ length: 20 }, (_, i) => i + 100)
    await nextTick()

    expect(wrapper.findAll('.card')).toHaveLength(20)
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)
    wrapper.unmount()
  })

  it('follows style prop changes of the owner', async () => {
    const padding = ref<any>({ base: 6, sm: 8 })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => [
          h(Box, { p: padding.value, id: 'first' }),
          h(Box, { p: { base: 6, sm: 8 }, id: 'second' }),
        ]),
    })
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    padding.value = { base: 10, sm: 12 }
    await nextTick()

    const styles = wrapper.findAll(INLINE_STYLES).map((style) => style.element.textContent)
    expect(styles).toHaveLength(2)
    expect(styles.join('\n')).toContain('padding: 0.375rem;')
    expect(styles.join('\n')).toContain('padding: 0.625rem;')
  })

  it('does not leave the rule inside a deactivated KeepAlive subtree', async () => {
    const show = ref(true)
    const Cached = defineComponent({ name: 'Cached', render: () => responsiveBox('cached') })
    const wrapper = mount(
      {
        render: () =>
          h(MantineProvider, { env: 'test' }, () => [
            h(KeepAlive, null, [show.value ? h(Cached) : null]),
            responsiveBox('visible'),
          ]),
      },
      { attachTo: document.body },
    )
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    show.value = false
    await nextTick()
    expect(wrapper.findAll('.card')).toHaveLength(1)
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    show.value = true
    await nextTick()
    expect(wrapper.findAll('.card')).toHaveLength(2)
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)
    wrapper.unmount()
  })

  it('renders one style element per instance when deduplicateInlineStyles is false', () => {
    const wrapper = mountList(ref([1, 2, 3]), { deduplicateInlineStyles: false })
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(3)
    wrapper.unmount()
  })

  it('reacts to deduplicateInlineStyles changes on MantineProvider', async () => {
    const deduplicate = ref(true)
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test', deduplicateInlineStyles: deduplicate.value }, () => [
          ...[1, 2, 3].map(responsiveBox),
          ...[1, 2, 3].map((key) => h(Flex, { key: `flex-${key}`, gap: { base: 'xs', md: 'xl' } })),
        ]),
    })

    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(2)

    deduplicate.value = false
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(6)

    deduplicate.value = true
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(2)
  })

  it('reacts to deduplicate changes on InlineStyles', async () => {
    const deduplicate = ref(true)
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          [1, 2, 3].map((key) =>
            h(InlineStyles, {
              key,
              selector: '.inline-toggle',
              styles: { color: 'red' },
              deduplicate: deduplicate.value,
            }),
          ),
        ),
    })

    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)

    deduplicate.value = false
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(3)

    deduplicate.value = true
    await nextTick()
    expect(wrapper.findAll(INLINE_STYLES)).toHaveLength(1)
  })

  it('renders the shared rule once on the server and hydrates without mismatches', async () => {
    const App = () => h(MantineProvider, null, () => [1, 2, 3].map(responsiveBox))
    const html = await renderToString(createSSRApp({ render: App }))
    expect(html.match(/<style data-mantine-inline-styles/g)).toHaveLength(1)

    // Every render starts from an empty registry
    expect(await renderToString(createSSRApp({ render: App }))).toBe(html)

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    const app = createSSRApp({ render: App })
    app.mount(container)
    const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n')
    warn.mockRestore()
    error.mockRestore()

    expect(messages).not.toMatch(/hydration/i)
    expect(container.querySelectorAll(INLINE_STYLES)).toHaveLength(1)
    app.unmount()
    container.remove()
  })
})
