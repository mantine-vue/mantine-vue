import { defineComponent, h, ref } from 'vue'
import { Button, Group, Splitter, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const paneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Splitter, Text } from '@mantine-vue/core'

const sizes = ref([50, 50])
</script>

<template>
  <Splitter :sizes="sizes" @sizeChange="sizes = $event" :h="200">
    <Splitter.Pane :defaultSize="50" :min="20" bg="blue" c="white" :fw="500">
      Panel A ({{ Math.round(sizes[0]) }}%)
    </Splitter.Pane>
    <Splitter.Pane :defaultSize="50" :min="20" bg="teal" c="white" :fw="500">
      Panel B ({{ Math.round(sizes[1]) }}%)
    </Splitter.Pane>
  </Splitter>
  <Text size="sm" mt="sm">
    Current sizes: [{{ sizes.map(s => Math.round(s)).join(', ') }}]
  </Text>
  <Group mt="xs">
    <Button size="xs" @click="sizes = [30, 70]">30 / 70</Button>
    <Button size="xs" @click="sizes = [50, 50]">50 / 50</Button>
    <Button size="xs" @click="sizes = [70, 30]">70 / 30</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'SplitterControlledDemo',
  setup() {
    const sizes = ref([50, 50])
    return () =>
      h('div', [
        h(
          Splitter,
          {
            sizes: sizes.value,
            onSizeChange: (s: number[]) => {
              sizes.value = s
            },
            h: 200,
          },
          {
            default: () => [
              h(
                Splitter.Pane,
                { defaultSize: 50, min: 20, bg: 'blue', c: 'white', fw: 500, style: paneStyle },
                { default: () => `Panel A (${Math.round(sizes.value[0])}%)` },
              ),
              h(
                Splitter.Pane,
                { defaultSize: 50, min: 20, bg: 'teal', c: 'white', fw: 500, style: paneStyle },
                { default: () => `Panel B (${Math.round(sizes.value[1])}%)` },
              ),
            ],
          },
        ),
        h(
          Text,
          { size: 'sm', mt: 'sm' },
          { default: () => `Current sizes: [${sizes.value.map((s) => Math.round(s)).join(', ')}]` },
        ),
        h(
          Group,
          { mt: 'xs' },
          {
            default: () => [
              h(
                Button,
                {
                  size: 'xs',
                  onClick: () => {
                    sizes.value = [30, 70]
                  },
                },
                { default: () => '30 / 70' },
              ),
              h(
                Button,
                {
                  size: 'xs',
                  onClick: () => {
                    sizes.value = [50, 50]
                  },
                },
                { default: () => '50 / 50' },
              ),
              h(
                Button,
                {
                  size: 'xs',
                  onClick: () => {
                    sizes.value = [70, 30]
                  },
                },
                { default: () => '70 / 30' },
              ),
            ],
          },
        ),
      ])
  },
})

export const controlled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: '100%',
}
