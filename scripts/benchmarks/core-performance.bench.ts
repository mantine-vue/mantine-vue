import { bench, describe } from 'vitest'
import { defineComponent, h, nextTick, ref, type Component } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  Box,
  Button,
  Card,
  Grid,
  GridCol,
  Image,
  MantineProvider,
  SimpleGrid,
  Text,
} from '@mantine-vue/core'

interface Product {
  id: number
  name: string
  price: string
}

function createProducts(revision: number): Product[] {
  return Array.from({ length: 100 }, (_, index) => ({
    id: index,
    name: `Product ${index} revision ${revision}`,
    price: `$${index + revision}.00`,
  }))
}

interface Scenario {
  wrapper: VueWrapper
  update: () => Promise<void>
  inlineStyles: () => number
}

function createScenario(renderProducts: (products: Product[]) => any): Scenario {
  const products = ref(createProducts(0))
  let revision = 0
  const App = defineComponent({
    setup: () => () => h(MantineProvider, { env: 'test' }, () => renderProducts(products.value)),
  })
  const wrapper = mount(App)

  return {
    wrapper,
    async update() {
      revision += 1
      products.value = createProducts(revision)
      await nextTick()
    },
    inlineStyles: () => wrapper.findAll('style[data-mantine-inline-styles="true"]').length,
  }
}

function productChildren(product: Product, element: string | Component) {
  return [
    h(element, { key: `${product.id}-image` }, () => product.name),
    h(element, { key: `${product.id}-name` }, () => product.name),
    h(element, { key: `${product.id}-price` }, () => product.price),
    h(element, { key: `${product.id}-action` }, () => 'Add'),
  ]
}

describe('100 product-like card updates (diagnostic only)', () => {
  const scenarios = new Map<string, Scenario>()

  scenarios.set(
    'Raw elements',
    createScenario((products) =>
      h(
        'div',
        products.map((product) =>
          h('article', { key: product.id }, productChildren(product, 'div')),
        ),
      ),
    ),
  )
  scenarios.set(
    'Direct Box tree',
    createScenario((products) =>
      h(Box, null, () =>
        products.map((product) => h(Box, { key: product.id }, () => productChildren(product, Box))),
      ),
    ),
  )
  scenarios.set(
    'Full Mantine card tree',
    createScenario((products) =>
      h(SimpleGrid, { cols: 4 }, () =>
        products.map((product) =>
          h(Card, { key: product.id }, () => [
            h(Image, { src: '', alt: product.name }),
            h(Text, null, () => product.name),
            h(Text, null, () => product.price),
            h(Button, null, () => 'Add'),
          ]),
        ),
      ),
    ),
  )
  scenarios.set(
    'SimpleGrid',
    createScenario((products) =>
      h(SimpleGrid, { cols: { base: 1, sm: 4 } }, () =>
        products.map((product) => h('div', { key: product.id }, product.name)),
      ),
    ),
  )
  scenarios.set(
    'Scalar Grid.Col',
    createScenario((products) =>
      h(Grid, null, () =>
        products.map((product) => h(GridCol, { key: product.id, span: 3 }, () => product.name)),
      ),
    ),
  )
  scenarios.set(
    'Responsive Grid.Col',
    createScenario((products) =>
      h(Grid, null, () =>
        products.map((product) =>
          h(GridCol, { key: product.id, span: { base: 12, sm: 3 } }, () => product.name),
        ),
      ),
    ),
  )

  for (const name of [
    'Raw elements',
    'Direct Box tree',
    'Full Mantine card tree',
    'SimpleGrid',
    'Scalar Grid.Col',
    'Responsive Grid.Col',
  ]) {
    const scenario = scenarios.get(name)!
    bench(`${name} [inline styles: ${scenario.inlineStyles()}]`, () => scenario.update())
  }
})
