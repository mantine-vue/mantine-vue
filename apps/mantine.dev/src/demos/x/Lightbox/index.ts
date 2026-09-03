import { defineComponent, h, ref } from 'vue'
import { Button, Center, Group, Image, Select, SimpleGrid, Text } from '@mantine-vue/core'
import {
  createCloseToolbarItem,
  createDownloadToolbarItem,
  createFullscreenToolbarItem,
  createThumbnailsToolbarItem,
  Lightbox,
  type LightboxProps,
  type LightboxSlideData,
  type ToolbarItem,
  type ToolbarItemsPayload,
} from '@mantine-vue/lightbox'
import type { MantineDemo } from '@/demo'

const images = [1, 2, 3, 4, 5].map(
  (index) =>
    `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-${index}.png`,
)
const slides: LightboxSlideData[] = images.map((src, index) => ({
  src,
  alt: `Landscape ${index + 1}`,
  caption: `Landscape ${index + 1}`,
}))

function galleryCode(attributes = '') {
  return `<script setup lang="ts">
import { ref } from 'vue'
import { Image, SimpleGrid } from '@mantine-vue/core'
import { Lightbox, type LightboxSlideData } from '@mantine-vue/lightbox'

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
]
const slides: LightboxSlideData[] = images.map((src, index) => ({ src, alt: \`Landscape \${index + 1}\` }))
const opened = ref(false)
const currentIndex = ref(0)
</script>

<template>
  <Lightbox v-model:opened="opened" v-model:current-index="currentIndex" :slides="slides"${attributes} />
  <SimpleGrid :cols="3">
    <Image v-for="(src, index) in images" :key="src" :src="src" radius="md" @click="currentIndex = index; opened = true" />
  </SimpleGrid>
</template>`
}

function galleryDemo(
  name: string,
  lightboxProps: Partial<LightboxProps>,
  attributes = '',
): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name,
      setup() {
        const opened = ref(false)
        const currentIndex = ref(0)
        return () => [
          h(Lightbox as any, {
            opened: opened.value,
            slides,
            currentIndex: currentIndex.value,
            ...lightboxProps,
            'onUpdate:opened': (value: boolean) => (opened.value = value),
            'onUpdate:currentIndex': (value: number) => (currentIndex.value = value),
          }),
          h(SimpleGrid, { cols: 3 }, () =>
            images.map((src, index) =>
              h(Image, {
                src,
                alt: `Open landscape ${index + 1}`,
                radius: 'md',
                style: { cursor: 'pointer' },
                onClick: () => {
                  currentIndex.value = index
                  opened.value = true
                },
              }),
            ),
          ),
        ]
      },
    }),
    code: galleryCode(attributes),
  }
}

export const usage = galleryDemo('LightboxUsageDemo', {})
export const zoom = galleryDemo('LightboxZoomDemo', { withZoom: true }, ' with-zoom')
export const thumbnails = galleryDemo(
  'LightboxThumbnailsDemo',
  { withThumbnails: true },
  ' with-thumbnails',
)
export const allFeatures = galleryDemo(
  'LightboxAllFeaturesDemo',
  { withZoom: true, withThumbnails: true, withFullscreen: true, withDownload: true },
  ' with-zoom with-thumbnails with-fullscreen with-download',
)
export const loop = galleryDemo('LightboxLoopDemo', { loop: true }, ' loop')
export const transition = galleryDemo(
  'LightboxSlideTransitionDemo',
  { withSlideTransition: true, withThumbnails: true },
  ' with-slide-transition with-thumbnails',
)
export const disableTransition = galleryDemo(
  'LightboxNoTransitionDemo',
  { transitionProps: { duration: 0 } },
  ' :transition-props="{ duration: 0 }"',
)
export const swipeClose = galleryDemo(
  'LightboxSwipeDemo',
  { closeOnSwipeDown: true },
  ' close-on-swipe-down',
)
export const closeOnClickOutside = galleryDemo(
  'LightboxOutsideDemo',
  { closeOnClickOutside: true },
  ' close-on-click-outside',
)

export const overlayTransition: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'LightboxOverlayTransitionDemo',
    setup() {
      const opened = ref(false)
      const transitionName = ref('pop')
      return () => [
        h(Lightbox, {
          opened: opened.value,
          slides,
          transitionProps: { transition: transitionName.value as any, duration: 400 },
          'onUpdate:opened': (value: boolean) => (opened.value = value),
        }),
        h(Group, { align: 'flex-end' }, () => [
          h(Select, {
            label: 'Transition',
            data: ['fade', 'pop', 'scale', 'slide-up', 'slide-down', 'rotate-left'],
            modelValue: transitionName.value,
            allowDeselect: false,
            'onUpdate:modelValue': (value: string | null) => {
              if (value) transitionName.value = value
            },
          }),
          h(Button, { onClick: () => (opened.value = true) }, () => 'Open lightbox'),
        ]),
      ]
    },
  }),
  code: `<script setup lang="ts">
import { ref } from 'vue'
import { Lightbox } from '@mantine-vue/lightbox'
const opened = ref(false)
const transition = ref('pop')
</script>
<template>
  <Lightbox v-model:opened="opened" :slides="slides" :transition-props="{ transition, duration: 400 }" />
</template>`,
}

const videoSlides: LightboxSlideData[] = [
  {
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: images[1],
    label: 'Big Buck Bunny preview',
    caption: 'Video slides pause when they become inactive',
    autoPlay: true,
  },
  slides[0],
  { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: images[3] },
]

function buttonLightboxDemo(
  name: string,
  demoSlides: LightboxSlideData[],
  props: Partial<LightboxProps>,
  label: string,
  code: string,
): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name,
      setup() {
        const opened = ref(false)
        return () => [
          h(Lightbox as any, {
            opened: opened.value,
            slides: demoSlides,
            ...props,
            'onUpdate:opened': (value: boolean) => (opened.value = value),
          }),
          h(Button, { onClick: () => (opened.value = true) }, () => label),
        ]
      },
    }),
    code,
  }
}

export const video = buttonLightboxDemo(
  'LightboxVideoDemo',
  videoSlides,
  { withThumbnails: true },
  'Open lightbox with videos',
  `<script setup lang="ts">
import { ref } from 'vue'
import { Lightbox, type LightboxSlideData } from '@mantine-vue/lightbox'
const opened = ref(false)
const slides: LightboxSlideData[] = [
  { type: 'video', src: '/video.mp4', poster: '/poster.png', label: 'Product demo', autoPlay: true },
  { src: '/image.png', alt: 'Product' },
]
</script>
<template><Lightbox v-model:opened="opened" :slides="slides" with-thumbnails /></template>`,
)

const customSlides: LightboxSlideData[] = [
  slides[0],
  {
    type: 'custom',
    render: ({ active }) =>
      h(Center, { h: '100%' }, () =>
        h(Text, { c: 'white', size: 'xl', fw: 700 }, () =>
          active ? 'This slide is active' : 'This slide is inactive',
        ),
      ),
    renderThumb: () => h(Center, { h: '100%', bg: 'blue.6' }, () => 'Custom'),
    caption: 'Custom slide rendered with a Vue render function',
  },
  {
    type: 'custom',
    render: () =>
      h('iframe', {
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'YouTube video',
        allowfullscreen: true,
        style: { width: '80vw', height: '45vw', maxHeight: '70vh', border: 0 },
      }),
    renderThumb: () => h(Center, { h: '100%', bg: 'red.6' }, () => 'YT'),
  },
]

export const custom = buttonLightboxDemo(
  'LightboxCustomDemo',
  customSlides,
  { withThumbnails: true },
  'Open lightbox with custom slides',
  `<script setup lang="ts">
import { h, ref } from 'vue'
import { Center, Text } from '@mantine-vue/core'
import { Lightbox, type LightboxSlideData } from '@mantine-vue/lightbox'
const opened = ref(false)
const slides: LightboxSlideData[] = [{
  type: 'custom',
  render: ({ active }) => h(Center, { h: '100%' }, () => h(Text, { c: 'white' }, () => active ? 'Active' : 'Inactive')),
  renderThumb: () => h('span', 'Custom'),
}]
</script>
<template><Lightbox v-model:opened="opened" :slides="slides" with-thumbnails /></template>`,
)

const toolbarItems = (payload: ToolbarItemsPayload): ToolbarItem[] => [
  createThumbnailsToolbarItem(payload.toggleThumbnails, payload.thumbnailsVisible, payload.labels),
  createFullscreenToolbarItem(payload.toggleFullscreen, payload.isFullscreen, payload.labels),
  createDownloadToolbarItem(images[payload.currentIndex], payload.labels),
  {
    key: 'next',
    icon: h('span', { 'aria-hidden': true }, '→'),
    label: 'Next image',
    position: 'right',
    onClick: payload.next,
  },
  createCloseToolbarItem(payload.close, payload.labels),
]

export const toolbar = buttonLightboxDemo(
  'LightboxToolbarDemo',
  slides,
  { withThumbnails: true, toolbarItems },
  'Open lightbox with custom toolbar',
  `<script setup lang="ts">
import { Lightbox, createCloseToolbarItem, createThumbnailsToolbarItem, type ToolbarItemsPayload } from '@mantine-vue/lightbox'
const toolbarItems = (payload: ToolbarItemsPayload) => [
  createThumbnailsToolbarItem(payload.toggleThumbnails, payload.thumbnailsVisible, payload.labels),
  { key: 'next', icon: '→', label: 'Next image', onClick: payload.next },
  createCloseToolbarItem(payload.close, payload.labels),
]
</script>
<template><Lightbox v-model:opened="opened" :slides="slides" :toolbar-items="toolbarItems" with-thumbnails /></template>`,
)

export const store: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'LightboxStoreDemo',
    setup: () => () => [
      h(Lightbox.Provider, { withThumbnails: true }),
      h(Group, {}, () => [
        h(Button, { onClick: () => Lightbox.open({ slides }) }, () => 'Open lightbox'),
        h(
          Button,
          { variant: 'default', onClick: () => Lightbox.open({ slides, startIndex: 2 }) },
          () => 'Open at slide 3',
        ),
      ]),
    ],
  }),
  code: `<script setup lang="ts">
import { Lightbox } from '@mantine-vue/lightbox'
</script>
<template>
  <Lightbox.Provider with-thumbnails />
  <Button @click="Lightbox.open({ slides, startIndex: 2 })">Open at slide 3</Button>
</template>`,
}

export const LightboxDemos = {
  usage,
  zoom,
  thumbnails,
  allFeatures,
  loop,
  transition,
  overlayTransition,
  disableTransition,
  swipeClose,
  closeOnClickOutside,
  store,
  video,
  custom,
  toolbar,
}
