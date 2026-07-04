import { defineComponent, h } from 'vue'
import { Accordion } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const data = [
  {
    emoji: '🍎',
    value: 'Apples',
    description:
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
  },
  {
    emoji: '🍌',
    value: 'Bananas',
    description:
      'Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.',
  },
  {
    emoji: '🥦',
    value: 'Broccoli',
    description:
      'Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.',
  },
]

const code = `
<template>
  <Accordion :order="3" unstyled>
    <!-- Accordion items -->
  </Accordion>
</template>
`

const Demo = defineComponent({
  name: 'AccordionUnstyledDemo',
  setup() {
    return () => {
      const items = data.map((item) =>
        h(
          Accordion.Item,
          { key: item.value, value: item.value },
          {
            default: () => [
              h(Accordion.Control, { icon: item.emoji }, { default: () => item.value }),
              h(Accordion.Panel, {}, { default: () => item.description }),
            ],
          },
        ),
      )
      return h(Accordion, { order: 3, unstyled: true }, { default: () => items })
    }
  },
})

export const unstyled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
