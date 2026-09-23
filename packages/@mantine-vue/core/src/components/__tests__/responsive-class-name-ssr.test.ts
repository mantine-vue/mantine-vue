import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { Flex, Grid, GridCol, MantineProvider, SimpleGrid } from '../../index'

function App() {
  return h(MantineProvider, null, () => [
    h(SimpleGrid, { cols: { base: 1, sm: 2 }, spacing: 'md' }, () => [
      h('div', 'A'),
      h('div', 'B'),
    ]),
    h(Grid, { gap: { base: 'sm', md: 'lg' } }, () =>
      h(GridCol, { span: { base: 12, md: 6 } }, () => 'Column'),
    ),
    h(Flex, { direction: { base: 'column', sm: 'row' } }, () => 'Flex'),
  ])
}

function responsiveClassNames(html: string) {
  return html.match(/mantine-vue-[A-Za-z0-9_-]+/g) ?? []
}

describe('@mantine-vue/core responsive class names under SSR', () => {
  it('renders the same class names on every server render', async () => {
    const first = await renderToString(createSSRApp({ render: App }))
    const second = await renderToString(createSSRApp({ render: App }))

    expect(responsiveClassNames(first).length).toBeGreaterThanOrEqual(4)
    expect(responsiveClassNames(second)).toEqual(responsiveClassNames(first))
  })

  it('renders the same class names on the client as on the server', async () => {
    const server = await renderToString(createSSRApp({ render: App }))
    const client = mount({ render: App })

    expect(responsiveClassNames(client.html())).toEqual(responsiveClassNames(server))
  })

  it('uses the class name as the selector of the responsive styles', async () => {
    const html = await renderToString(createSSRApp({ render: App }))
    const [className] = responsiveClassNames(html)

    expect(html).toContain(`.${className}`)
  })
})
