import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
const colors = ['blue', 'teal', 'grape', 'orange'] as const
const labels = ['Panel A', 'Panel B', 'Panel C', 'Panel D']

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter redistribute="nearest" :h="200">
    <Splitter.Pane :defaultSize="25" :min="10" bg="blue" c="white" :fw="500">Panel A</Splitter.Pane>
    <Splitter.Pane :defaultSize="25" :min="10" bg="teal" c="white" :fw="500">Panel B</Splitter.Pane>
    <Splitter.Pane :defaultSize="25" :min="10" bg="grape" c="white" :fw="500">Panel C</Splitter.Pane>
    <Splitter.Pane :defaultSize="25" :min="10" bg="orange" c="white" :fw="500">Panel D</Splitter.Pane>
  </Splitter>
</template>
`

const Demo = defineComponent({
  name: 'SplitterRedistributeDemo',
  setup() {
    return () =>
      h(
        Splitter,
        { redistribute: 'nearest', h: 200 },
        {
          default: () =>
            labels.map((label, i) =>
              h(
                Splitter.Pane,
                {
                  key: label,
                  defaultSize: 25,
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

export const redistribute: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
