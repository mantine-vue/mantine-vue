import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useId } from './use-id'

describe('@mantine-vue/hooks/use-id', () => {
  it('returns the static id when one is given', () => {
    expect(useId('custom').value).toBe('custom')
  })

  it('generates an id during server rendering', async () => {
    const Component = defineComponent({
      setup() {
        const id = useId()
        return () => h('div', { id: id.value })
      },
    })

    expect(await renderToString(h(Component))).toMatch(/id="mantine-vue-[A-Za-z0-9_-]+"/)
  })

  it('generates distinct ids within one render', async () => {
    const Child = defineComponent({
      setup() {
        const id = useId()
        return () => h('span', { id: id.value })
      },
    })

    const html = await renderToString(h('div', [h(Child), h(Child)]))
    const ids = Array.from(html.matchAll(/id="([^"]+)"/g), (match) => match[1])

    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})
