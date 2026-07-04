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

function makeItems() {
  return data.map((item) =>
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
}

const customCode = `
<template>
  <Accordion :order="3" :transitionDuration="1000">
    {/* ...content */}
  </Accordion>
</template>
`

const disableCode = `
<template>
  <Accordion :order="3" :transitionDuration="0">
    {/* ...content */}
  </Accordion>
</template>
`

const CustomDemo = defineComponent({
  name: 'AccordionCustomTransitionsDemo',
  setup() {
    return () =>
      h(Accordion, { order: 3, transitionDuration: 1000 }, { default: () => makeItems() })
  },
})

const DisableDemo = defineComponent({
  name: 'AccordionDisableTransitionsDemo',
  setup() {
    return () => h(Accordion, { order: 3, transitionDuration: 0 }, { default: () => makeItems() })
  },
})

export const customTransitions: MantineDemo = {
  type: 'code',
  component: CustomDemo,
  code: customCode,
  maxWidth: 380,
  centered: true,
}

export const disableTransitions: MantineDemo = {
  type: 'code',
  component: DisableDemo,
  code: disableCode,
  maxWidth: 380,
  centered: true,
}
