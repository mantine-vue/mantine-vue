import { defineComponent, h } from 'vue'
import { Accordion } from '@mantine-vue/core'
import { PhPlus } from '@phosphor-icons/vue'
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
import { PhPlus } from '@phosphor-icons/vue'
import classes from './Demo.module.css'

const data = [/* ... */]
</script>

<!-- Demo.module.css:
.chevron {
  &[data-rotate] {
    transform: rotate(45deg);
  }
}
.icon {
  width: 16px;
  height: 16px;
}
-->

<template>
  <Accordion
    defaultValue="Apples"
    :classNames="{ chevron: classes.chevron }"
    :chevron="h(PhPlus, { class: classes.icon })"
    :order="3"
  >
    <Accordion.Item v-for="item in data" :key="item.value" :value="item.value">
      <Accordion.Control :icon="item.emoji">{{ item.value }}</Accordion.Control>
      <Accordion.Panel>{{ item.description }}</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

// Inject styles for the chevron demo
const STYLE_ID = 'accordion-chevron-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `.accordion-chevron-demo[data-rotate]{transform:rotate(45deg)}.accordion-chevron-demo-icon{width:16px;height:16px}`
    document.head.appendChild(style)
  }
}

const Demo = defineComponent({
  name: 'AccordionChevronDemo',
  setup() {
    ensureStyles()
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
        {
          defaultValue: 'Apples',
          order: 3,
          mih: 270,
          classNames: { chevron: 'accordion-chevron-demo' },
          chevron: h(PhPlus, { class: 'accordion-chevron-demo-icon' }),
        },
        { default: () => items },
      )
    }
  },
})

export const chevron: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 600,
}
