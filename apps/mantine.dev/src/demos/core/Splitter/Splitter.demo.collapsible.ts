import { defineComponent, h, ref } from 'vue'
import { Button, Group, Splitter } from '@mantine-vue/core'
import type { UseSplitterReturnValue } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Splitter } from '@mantine-vue/core'
import type { UseSplitterReturnValue } from '@mantine-vue/core'

const splitterRef = ref<UseSplitterReturnValue | null>(null)
</script>

<template>
  <Splitter :splitterRef="splitterRef" :h="200">
    <Splitter.Pane :defaultSize="30" :min="20" collapsible bg="blue" c="white" :fw="500">
      Collapsible sidebar
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="70" :min="30" bg="teal" c="white" :fw="500">
      Main content
    </Splitter.Pane>
  </Splitter>
  <Group mt="md">
    <Button size="xs" @click="splitterRef?.toggleCollapse(0)">
      Toggle sidebar
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'SplitterCollapsibleDemo',
  setup() {
    const splitterRef = ref<UseSplitterReturnValue | null>(null)
    return () =>
      h('div', [
        h(
          Splitter,
          { splitterRef, h: 200 },
          {
            default: () => [
              h(
                Splitter.Pane,
                {
                  defaultSize: 30,
                  min: 20,
                  collapsible: true,
                  bg: 'blue',
                  c: 'white',
                  fw: 500,
                  style: paneStyle,
                },
                { default: () => 'Collapsible sidebar' },
              ),
              h(
                Splitter.Pane,
                { defaultSize: 70, min: 30, bg: 'teal', c: 'white', fw: 500, style: paneStyle },
                { default: () => 'Main content' },
              ),
            ],
          },
        ),
        h(
          Group,
          { mt: 'md' },
          {
            default: () =>
              h(
                Button,
                { size: 'xs', onClick: () => splitterRef.value?.toggleCollapse(0) },
                { default: () => 'Toggle sidebar' },
              ),
          },
        ),
      ])
  },
})

export const collapsible: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
