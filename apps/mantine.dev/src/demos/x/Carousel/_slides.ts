import { defineComponent, h, type PropType } from 'vue'
import { Box } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'

const Slide = defineComponent({
  name: 'CarouselDemoSlide',
  setup(_, { slots }) {
    return () =>
      h(
        Box,
        {
          style: {
            backgroundColor: 'var(--mantine-color-blue-filled)',
            color: 'var(--mantine-color-white)',
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
          },
        },
        () => slots.default?.(),
      )
  },
})

export const Slides = defineComponent({
  name: 'CarouselDemoSlides',
  props: {
    count: { type: Number as PropType<number>, required: true },
  },
  setup(props) {
    return () =>
      Array(props.count)
        .fill(0)
        .map((_, index) => h(Carousel.Slide, { key: index }, () => h(Slide, null, () => index + 1)))
  },
})
