import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter :lineSize="2" :h="200">
    <Splitter.Pane :defaultSize="50" :min="20" bg="blue" c="white" :fw="500">
      First pane
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="50" :min="20" bg="teal" c="white" :fw="500">
      Second pane
    </Splitter.Pane>
  </Splitter>
</template>
`

const Wrapper = defineComponent({
  name: 'SplitterLineSizeDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Splitter,
        { h: 200, ...(attrs as any) },
        {
          default: () => [
            h(
              Splitter.Pane,
              { defaultSize: 50, min: 20, bg: 'blue', c: 'white', fw: 500, style: paneStyle },
              { default: () => 'First pane' },
            ),
            h(
              Splitter.Pane,
              { defaultSize: 50, min: 20, bg: 'teal', c: 'white', fw: 500, style: paneStyle },
              { default: () => 'Second pane' },
            ),
          ],
        },
      )
  },
})

export const lineSize: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  maxWidth: '100%',
  controls: [
    {
      prop: 'lineSize',
      type: 'number',
      initialValue: 2,
      libraryValue: 2,
      min: 1,
      max: 10,
      step: 1,
    },
  ],
}
