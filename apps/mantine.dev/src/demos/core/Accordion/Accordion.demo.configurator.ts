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
  <Accordion{{props}} :order="3" defaultValue="Apples">
    <Accordion.Item v-for="item in data" :key="item.value" :value="item.value">
      <Accordion.Control :icon="item.emoji">{{ item.value }}</Accordion.Control>
      <Accordion.Panel>{{ item.description }}</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

const Wrapper = defineComponent({
  name: 'AccordionConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
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
      return h(
        Accordion,
        { order: 3, defaultValue: 'Apples', mih: 320, ...(attrs as any) },
        {
          default: () => items,
        },
      )
    }
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    {
      prop: 'variant',
      type: 'select',
      initialValue: 'default',
      libraryValue: 'default',
      data: [
        { label: 'Default', value: 'default' },
        { label: 'Contained', value: 'contained' },
        { label: 'Filled', value: 'filled' },
        { label: 'Separated', value: 'separated' },
        { label: 'Unstyled', value: 'unstyled' },
      ],
    },
    { prop: 'radius', type: 'size', libraryValue: 'md', initialValue: 'md' },
    {
      prop: 'chevronPosition',
      type: 'segmented',
      data: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      initialValue: 'right',
      libraryValue: 'right',
    },
    {
      prop: 'chevronIconSize',
      type: 'number',
      initialValue: 16,
      libraryValue: 16,
      min: 12,
      max: 25,
    },
    { prop: 'disableChevronRotation', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
