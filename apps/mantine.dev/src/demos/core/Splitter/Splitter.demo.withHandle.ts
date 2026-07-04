import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter :withHandle="false" :h="200">
    <Splitter.Pane :defaultSize="50" :min="20" bg="blue" c="white" :fw="500">
      First pane
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="50" :min="20" bg="teal" c="white" :fw="500">
      Second pane
    </Splitter.Pane>
  </Splitter>
</template>
`

const Demo = defineComponent({
  name: 'SplitterWithHandleDemo',
  setup() {
    return () =>
      h(
        Splitter,
        { withHandle: false, h: 200 },
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

export const withHandle: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
