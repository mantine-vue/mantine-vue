import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { useScrollIntoView } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useScrollIntoView } from '@mantine-vue/hooks'
import { Button, Group } from '@mantine-vue/core'

const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
  offset: 60,
})
</script>

<template>
  <Group justify="center">
    <Button @click="scrollIntoView({ alignment: 'center' })">Scroll to target</Button>
    <div
      style="width: 100%; height: 50vh; background-color: var(--mantine-color-blue-light)"
    />
    <!-- Bind the hook's ref to a plain native element, not a Mantine
         Vue component -- components don't forward refs to their root DOM node. -->
    <p ref="targetRef">Hello there</p>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseScrollIntoViewUsageDemo',
  setup() {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
      offset: 60,
    })

    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              Button,
              { onClick: () => scrollIntoView({ alignment: 'center' }) },
              { default: () => 'Scroll to target' },
            ),
            h('div', {
              style: {
                width: '100%',
                height: '50vh',
                backgroundColor: 'var(--mantine-color-blue-light)',
              },
            }),
            h('p', { ref: targetRef }, 'Hello there'),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
