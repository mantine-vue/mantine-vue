import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import { useInViewport } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
import { useInViewport } from '@mantine-vue/hooks'

const { ref: targetRef, inViewport } = useInViewport()
</script>

<template>
  <Text ta="center">{{ inViewport ? 'Box is visible' : 'Scroll to see box' }}</Text>
  <div style="height: 64px; overflow: scroll">
    <div style="height: 128px" />
    <!-- Bind the hook's ref to a plain native element, not a Mantine
         Vue component -- components don't forward refs to their root DOM node. -->
    <div ref="targetRef" style="background: var(--mantine-color-blue-filled); height: 32px; padding: 8px">
      <Text ta="center" c="white">A box</Text>
    </div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseInViewportUsageDemo',
  setup() {
    const { ref: targetRef, inViewport } = useInViewport<HTMLDivElement>()

    return () => [
      h(Text, { ta: 'center' }, () => (inViewport.value ? 'Box is visible' : 'Scroll to see box')),
      h('div', { style: { height: '64px', overflow: 'scroll' } }, [
        h('div', { style: { height: '128px' } }),
        h(
          'div',
          {
            ref: targetRef,
            style: {
              background: 'var(--mantine-color-blue-filled)',
              height: '32px',
              padding: '8px',
            },
          },
          [h(Text, { ta: 'center', c: 'white' }, () => 'A box')],
        ),
      ]),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
