import { defineComponent, h } from 'vue'
import { Splitter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { Splitter } from '@mantine-vue/core'
</script>

<template>
  <Splitter :h="350">
    <Splitter.Pane :defaultSize="30" :min="15" bg="blue" c="white" :fw="500">
      Sidebar
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="70" :min="30">
      <Splitter orientation="vertical" h="100%">
        <Splitter.Pane :defaultSize="60" :min="20" bg="teal" c="white" :fw="500">
          Editor
        </Splitter.Pane>
        <Splitter.Pane :defaultSize="40" :min="20" bg="grape" c="white" :fw="500">
          Terminal
        </Splitter.Pane>
      </Splitter>
    </Splitter.Pane>
  </Splitter>
</template>
`

const Demo = defineComponent({
  name: 'SplitterNestedDemo',
  setup() {
    return () =>
      h(
        Splitter,
        { h: 350 },
        {
          default: () => [
            h(
              Splitter.Pane,
              { defaultSize: 30, min: 15, bg: 'blue', c: 'white', fw: 500, style: paneStyle },
              { default: () => 'Sidebar' },
            ),
            h(
              Splitter.Pane,
              { defaultSize: 70, min: 30 },
              {
                default: () =>
                  h(
                    Splitter,
                    { orientation: 'vertical', h: '100%' },
                    {
                      default: () => [
                        h(
                          Splitter.Pane,
                          {
                            defaultSize: 60,
                            min: 20,
                            bg: 'teal',
                            c: 'white',
                            fw: 500,
                            style: paneStyle,
                          },
                          { default: () => 'Editor' },
                        ),
                        h(
                          Splitter.Pane,
                          {
                            defaultSize: 40,
                            min: 20,
                            bg: 'grape',
                            c: 'white',
                            fw: 500,
                            style: paneStyle,
                          },
                          { default: () => 'Terminal' },
                        ),
                      ],
                    },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const nested: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
