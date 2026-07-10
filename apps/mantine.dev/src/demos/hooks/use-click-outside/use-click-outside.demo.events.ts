import { defineComponent, h, ref } from 'vue'
import { Button, Group, Paper } from '@mantine-vue/core'
import { useClickOutside } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Paper } from '@mantine-vue/core'
import { useClickOutside } from '@mantine-vue/hooks'

const opened = ref(false)
const paperRef = ref()
useClickOutside(
  () => (opened.value = false),
  ['mouseup', 'touchend'],
  () => [paperRef.value?.$el],
)
</script>

<template>
  <div style="position: relative;">
    <Group justify="center">
      <Button @click="opened = true">Open dropdown</Button>
    </Group>

    <Paper
      v-if="opened"
      ref="paperRef"
      shadow="sm"
      style="width: 300px; height: 60px; position: absolute; top: 0; left: calc(50% - 150px); display: flex; align-items: center; justify-content: center; z-index: 1;"
    >
      <span>Click outside to close</span>
    </Paper>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseClickOutsideEventsDemo',
  setup() {
    const opened = ref(false)
    const paperRef = ref<{ $el: HTMLElement } | null>(null)
    useClickOutside(
      () => (opened.value = false),
      ['mouseup', 'touchend'],
      () => [paperRef.value?.$el],
    )

    return () =>
      h('div', { style: { position: 'relative' } }, [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h(
                Button,
                { onClick: () => (opened.value = true) },
                { default: () => 'Open dropdown' },
              ),
          },
        ),
        opened.value
          ? h(
              Paper,
              {
                ref: paperRef,
                shadow: 'sm',
                style: {
                  width: '300px',
                  height: '60px',
                  position: 'absolute',
                  top: 0,
                  left: 'calc(50% - 150px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                },
              },
              { default: () => h('span', 'Click outside to close') },
            )
          : null,
      ])
  },
})

export const events: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  dimmed: true,
}
