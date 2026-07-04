import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter orientation="vertical" :h="300">
    <Splitter.Pane :defaultSize="60" :min="20" bg="blue" c="white" :fw="500">
      Top pane
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="40" :min="20" bg="teal" c="white" :fw="500">
      Bottom pane
    </Splitter.Pane>
  </Splitter>
</template>
`

const Demo = defineComponent({
  name: 'SplitterVerticalDemo',
  setup() {
    return () =>
      h(
        Splitter,
        { orientation: 'vertical', h: 300 },
        {
          default: () => [
            h(
              Splitter.Pane,
              { defaultSize: 60, min: 20, bg: 'blue', c: 'white', fw: 500, style: paneStyle },
              { default: () => 'Top pane' },
            ),
            h(
              Splitter.Pane,
              { defaultSize: 40, min: 20, bg: 'teal', c: 'white', fw: 500, style: paneStyle },
              { default: () => 'Bottom pane' },
            ),
          ],
        },
      )
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
