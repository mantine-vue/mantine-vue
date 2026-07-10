import { defineComponent, h } from 'vue'
import { Box, Button, Group } from '@mantine-vue/core'
import { useScroller } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Button, Group } from '@mantine-vue/core'
import { useScroller } from '@mantine-vue/hooks'

const scroller = useScroller()
const items = Array.from({ length: 20 })
</script>

<template>
  <Box>
    <Group mb="md">
      <Button @click="scroller.scrollStart" :disabled="!scroller.canScrollStart.value" variant="default" size="xs">
        ← Scroll left
      </Button>
      <Button @click="scroller.scrollEnd" :disabled="!scroller.canScrollEnd.value" variant="default" size="xs">
        Scroll right →
      </Button>
    </Group>

    <div
      :ref="scroller.ref"
      v-on="scroller.dragHandlers"
      :style="{ overflow: 'auto', cursor: scroller.isDragging.value ? 'grabbing' : 'grab' }"
    >
      <Group wrap="nowrap" gap="md">
        <Box
          v-for="(_, index) in items"
          :key="index"
          :style="{
            minWidth: '100px',
            height: '80px',
            backgroundColor: 'var(--mantine-color-blue-filled)',
            borderRadius: 'var(--mantine-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 500,
          }"
        >
          {{ index + 1 }}
        </Box>
      </Group>
    </div>
  </Box>
</template>
`

const itemStyle = {
  minWidth: '100px',
  height: '80px',
  backgroundColor: 'var(--mantine-color-blue-filled)',
  borderRadius: 'var(--mantine-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 500,
}

const Demo = defineComponent({
  name: 'UseScrollerUsageDemo',
  setup() {
    const scroller = useScroller()

    return () =>
      h(Box, () => [
        h(Group, { mb: 'md' }, () => [
          h(
            Button,
            {
              onClick: scroller.scrollStart,
              disabled: !scroller.canScrollStart.value,
              variant: 'default',
              size: 'xs',
            },
            { default: () => '← Scroll left' },
          ),
          h(
            Button,
            {
              onClick: scroller.scrollEnd,
              disabled: !scroller.canScrollEnd.value,
              variant: 'default',
              size: 'xs',
            },
            { default: () => 'Scroll right →' },
          ),
        ]),
        h(
          'div',
          {
            ref: scroller.ref,
            ...scroller.dragHandlers,
            style: { overflow: 'auto', cursor: scroller.isDragging.value ? 'grabbing' : 'grab' },
          },
          [
            h(Group, { wrap: 'nowrap', gap: 'md' }, () =>
              Array.from({ length: 20 }).map((_, index) =>
                h(Box, { key: index, style: itemStyle }, () => index + 1),
              ),
            ),
          ],
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
