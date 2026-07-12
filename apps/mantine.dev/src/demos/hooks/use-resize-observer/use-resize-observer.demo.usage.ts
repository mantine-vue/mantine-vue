import { defineComponent, h } from 'vue'
import { Group, Table } from '@mantine-vue/core'
import { useResizeObserver } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'
import classes from './use-resize-observer.demo.usage.module.css'

const cssCode = `.root {
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.demo {
  width: 400px;
  max-width: 800px;
  min-width: 160px;
  height: 200px;
  max-height: 220px;
  min-height: 80px;
  background-color: light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-8));
  resize: both;
  overflow: auto;
  color: var(--mantine-color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}`

const code = `
<script setup lang="ts">
import { Group, Table } from '@mantine-vue/core'
import { useResizeObserver } from '@mantine-vue/hooks'
import classes from './Demo.module.css'

const { ref: resizeRef, rect } = useResizeObserver()
</script>

<template>
  <div :class="classes.root">
    <Group justify="center">
      <div :ref="resizeRef" :class="classes.demo">Resize me!</div>
    </Group>

    <Table
      caption-side="top"
      :data="{
        caption: 'Resize element by dragging its right bottom corner',
        head: ['Property', 'Value'],
        body: [
          ['width', rect.width],
          ['height', rect.height],
        ],
      }"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseResizeObserverUsageDemo',
  setup() {
    const { ref: resizeRef, rect } = useResizeObserver<HTMLDivElement>()

    return () =>
      h(
        'div',
        {
          class: classes.root,
        },
        [
          h(
            Group,
            { justify: 'center' },
            {
              default: () =>
                h(
                  'div',
                  {
                    ref: resizeRef,
                    class: classes.demo,
                  },
                  'Resize me!',
                ),
            },
          ),
          h(Table, {
            captionSide: 'top',
            data: {
              caption: 'Resize element by dragging its right bottom corner',
              head: ['Property', 'Value'],
              body: [
                ['width', rect.value.width],
                ['height', rect.value.height],
              ],
            },
          }),
        ],
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
