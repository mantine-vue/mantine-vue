import { defineComponent, h } from 'vue'
import { AspectRatio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AspectRatio } from '@mantine-vue/core'
</script>

<template>
  <AspectRatio :ratio="16 / 9">
    <iframe
      src="https://www.youtube.com/embed/mzJ4vCjSt28"
      title="YouTube video player"
      :style="{ border: 0 }"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </AspectRatio>
</template>
`

const Demo = defineComponent({
  name: 'AspectRatioVideoDemo',
  setup() {
    return () =>
      h(
        AspectRatio,
        { ratio: 16 / 9 },
        {
          default: () =>
            h('iframe', {
              src: 'https://www.youtube.com/embed/mzJ4vCjSt28',
              title: 'YouTube video player',
              style: { border: 0 },
              allow:
                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
              allowfullscreen: true,
            }),
        },
      )
  },
})

export const video: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
