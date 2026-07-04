import { defineComponent, h } from 'vue'
import { Highlight } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight } from '@mantine-vue/core'
</script>

<template>
  <Highlight
    ta="center"
    :highlight="['highlighted', 'default']"
    :highlightStyles="{
      backgroundImage: 'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
      fontWeight: 700,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }"
  >
    You can change styles of highlighted part if you do not like default styles
  </Highlight>
</template>
`

const Demo = defineComponent({
  name: 'HighlightStylesDemo',
  setup() {
    return () =>
      h(
        Highlight,
        {
          ta: 'center',
          highlight: ['highlighted', 'default'],
          highlightStyles: {
            backgroundImage:
              'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
            fontWeight: 700,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
        },
        {
          default: () =>
            'You can change styles of highlighted part if you do not like default styles',
        },
      )
  },
})

export const styles: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
