import { computed, defineComponent, h } from 'vue'
import { Button, Paper, Text, Title, useMantineTheme } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import { Carousel } from '@mantine-vue/carousel'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'carousel-cards-demo-styles'
const CARD_CLASS = 'carousel-cards-demo-card'
const TITLE_CLASS = 'carousel-cards-demo-title'
const CATEGORY_CLASS = 'carousel-cards-demo-category'

function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .${CARD_CLASS} {
        height: 440px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        background-size: cover;
        background-position: center;
      }
      .${TITLE_CLASS} {
        font-weight: 900;
        color: var(--mantine-color-white);
        line-height: 1.2;
        font-size: 32px;
        margin-top: var(--mantine-spacing-xs);
        cursor: default;
      }
      .${CATEGORY_CLASS} {
        color: var(--mantine-color-white);
        opacity: 0.7;
        font-weight: 700;
        text-transform: uppercase;
        cursor: default;
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.card {
  height: 440px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-size: cover;
  background-position: center;
}

.title {
  font-weight: 900;
  color: var(--mantine-color-white);
  line-height: 1.2;
  font-size: 32px;
  margin-top: var(--mantine-spacing-xs);
  cursor: default;
}

.category {
  color: var(--mantine-color-white);
  opacity: 0.7;
  font-weight: 700;
  text-transform: uppercase;
  cursor: default;
}
`

const data = [
  {
    image:
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Best forests to visit in North America',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Hawaii beaches review: better than you think',
    category: 'beach',
  },
  {
    image:
      'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Mountains at night: 12 best locations to enjoy the view',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Aurora in Norway: when to visit for best experience',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Best places to visit this winter',
    category: 'tourism',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Active volcanos reviews: travel at your own risk',
    category: 'nature',
  },
]

const code = `
<script setup lang="ts">
import { computed } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { useMediaQuery } from '@mantine-vue/hooks'
import { Button, Paper, Title, useMantineTheme, Text } from '@mantine-vue/core'
import classes from './Demo.module.css'

const data = [
  {
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Best forests to visit in North America',
    category: 'nature',
  },
  // ...
];

const theme = useMantineTheme()
const mobile = useMediaQuery(computed(() => \`(max-width: \${theme.value.breakpoints.sm})\`))
</script>

<template>
  <Carousel
    :slideSize="{ base: '100%', sm: '50%' }"
    :slideGap="{ base: 'xl', sm: 2 }"
    :emblaOptions="{ align: 'start', slidesToScroll: mobile ? 1 : 2 }"
  >
    <Carousel.Slide v-for="item in data" :key="item.title">
      <Paper shadow="md" p="xl" :style="{ backgroundImage: \`url(\${item.image})\` }" :class="classes.card">
        <div>
          <Text :class="classes.category" size="xs">{{ item.category }}</Text>
          <Title :order="3" :class="classes.title">{{ item.title }}</Title>
        </div>
        <Button variant="white" color="dark">Read article</Button>
      </Paper>
    </Carousel.Slide>
  </Carousel>
</template>
`

const Card = defineComponent({
  name: 'CarouselCardsDemoCard',
  props: {
    image: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h(
        Paper,
        {
          shadow: 'md',
          p: 'xl',
          style: { backgroundImage: `url(${props.image})` },
          class: CARD_CLASS,
        },
        () => [
          h('div', null, [
            h(Text, { class: CATEGORY_CLASS, size: 'xs' }, () => props.category),
            h(Title, { order: 3, class: TITLE_CLASS }, () => props.title),
          ]),
          h(Button, { variant: 'white', color: 'dark' }, () => 'Read article'),
        ],
      )
  },
})

const Demo = defineComponent({
  name: 'CarouselCardsDemo',
  setup() {
    ensureStyles()
    const theme = useMantineTheme()
    const mobile = useMediaQuery(computed(() => `(max-width: ${theme.value.breakpoints.sm})`))

    return () =>
      h(
        Carousel,
        {
          slideSize: { base: '100%', sm: '50%' },
          slideGap: { base: 'xl', sm: 2 },
          emblaOptions: { align: 'start', slidesToScroll: mobile.value ? 1 : 2 },
        },
        () =>
          data.map((item) => h(Carousel.Slide, { key: item.title }, () => h(Card, { ...item }))),
      )
  },
})

export const cards: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
