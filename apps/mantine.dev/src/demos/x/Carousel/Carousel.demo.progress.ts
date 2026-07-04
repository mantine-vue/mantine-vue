import { defineComponent, h, ref } from 'vue'
import type { EmblaCarouselType } from 'embla-carousel'
import { Progress } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import type { EmblaCarouselType } from 'embla-carousel'
import { Carousel } from '@mantine-vue/carousel'
import { Progress } from '@mantine-vue/core'

const scrollProgress = ref(0)
let embla: EmblaCarouselType | null = null

function handleScroll() {
  if (!embla) return
  const progress = Math.max(0, Math.min(1, embla.scrollProgress()))
  scrollProgress.value = progress * 100
}

function handleEmblaApi(api: EmblaCarouselType) {
  embla = api
  embla.on('scroll', handleScroll)
  handleScroll()
}
</script>

<template>
  <div>
    <Carousel
      :emblaOptions="{ dragFree: true }"
      slideSize="50%"
      slideGap="md"
      :height="200"
      :getEmblaApi="handleEmblaApi"
      :initialSlide="2"
    >
      <!-- ...slides -->
    </Carousel>
    <Progress :value="scrollProgress" maw="320" size="sm" mt="xl" mx="auto" />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'CarouselProgressDemo',
  setup() {
    const scrollProgress = ref(0)
    let embla: EmblaCarouselType | null = null

    const handleScroll = () => {
      if (!embla) {
        return
      }
      const progress = Math.max(0, Math.min(1, embla.scrollProgress()))
      scrollProgress.value = progress * 100
    }

    const handleEmblaApi = (api: EmblaCarouselType) => {
      embla = api
      embla.on('scroll', handleScroll)
      handleScroll()
    }

    return () =>
      h('div', null, [
        h(
          Carousel,
          {
            emblaOptions: { dragFree: true },
            slideSize: '50%',
            slideGap: 'md',
            height: 200,
            getEmblaApi: handleEmblaApi,
            initialSlide: 2,
          },
          () => h(Slides, { count: 12 }),
        ),
        h(Progress, { value: scrollProgress.value, maw: 320, size: 'sm', mt: 'xl', mx: 'auto' }),
      ])
  },
})

export const progress: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
