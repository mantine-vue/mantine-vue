import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
const colors = ['blue', 'teal', 'grape'] as const
const labels = ['First', 'Second', 'Third']

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter :h="200">
    <Splitter.Pane :defaultSize="25" :min="10" bg="blue" c="white" :fw="500">First</Splitter.Pane>
    <Splitter.Pane :defaultSize="50" :min="10" bg="teal" c="white" :fw="500">Second</Splitter.Pane>
    <Splitter.Pane :defaultSize="25" :min="10" bg="grape" c="white" :fw="500">Third</Splitter.Pane>
  </Splitter>
</template>
`

const Demo = defineComponent({
  name: 'SplitterMultipleDemo',
  setup() {
    return () =>
      h(
        Splitter,
        { h: 200 },
        {
          default: () =>
            labels.map((label, i) =>
              h(
                Splitter.Pane,
                {
                  key: label,
                  defaultSize: i === 1 ? 50 : 25,
                  min: 10,
                  bg: colors[i],
                  c: 'white',
                  fw: 500,
                  style: paneStyle,
                },
                { default: () => label },
              ),
            ),
        },
      )
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
