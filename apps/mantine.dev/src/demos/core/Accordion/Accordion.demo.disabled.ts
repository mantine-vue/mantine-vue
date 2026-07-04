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
<script setup lang="ts">
import { Accordion } from '@mantine-vue/core'

const data = [/* ... */]
</script>

<template>
  <Accordion defaultValue="Apples" :order="3">
    <Accordion.Item v-for="item in data" :key="item.value" :value="item.value">
      <Accordion.Control :icon="item.emoji" :disabled="item.value === 'Bananas'">
        {{ item.value }}
      </Accordion.Control>
      <Accordion.Panel>{{ item.description }}</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

const Demo = defineComponent({
  name: 'AccordionDisabledDemo',
  setup() {
    return () => {
      const items = data.map((item) =>
        h(
          Accordion.Item,
          { key: item.value, value: item.value },
          {
            default: () => [
              h(
                Accordion.Control,
                { icon: item.emoji, disabled: item.value === 'Bananas' },
                { default: () => item.value },
              ),
              h(Accordion.Panel, {}, { default: () => item.description }),
            ],
          },
        ),
      )
      return h(Accordion, { defaultValue: 'Apples', order: 3, mih: 270 }, { default: () => items })
    }
  },
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 600,
}
