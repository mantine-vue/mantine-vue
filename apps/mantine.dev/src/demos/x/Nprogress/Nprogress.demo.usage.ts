import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { NavigationProgress, nprogress } from '@mantine-vue/nprogress'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { nprogress, NavigationProgress } from '@mantine-vue/nprogress'
</script>

<template>
  <NavigationProgress />
  <Group justify="center">
    <Button variant="default" @click="nprogress.start()">Start</Button>
    <Button variant="default" @click="nprogress.stop()">Stop</Button>
    <Button variant="default" @click="nprogress.increment()">Increment</Button>
    <Button variant="default" @click="nprogress.decrement()">Decrement</Button>
    <Button variant="default" @click="nprogress.set(50)">Set 50%</Button>
    <Button variant="default" @click="nprogress.reset()">Reset</Button>
    <Button variant="default" @click="nprogress.complete()">Complete</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'NprogressUsageDemo',
  setup() {
    return () =>
      h('div', null, [
        h(NavigationProgress),
        h(Group, { justify: 'center' }, () => [
          h(Button, { variant: 'default', onClick: () => nprogress.start() }, () => 'Start'),
          h(Button, { variant: 'default', onClick: () => nprogress.stop() }, () => 'Stop'),
          h(
            Button,
            { variant: 'default', onClick: () => nprogress.increment() },
            () => 'Increment',
          ),
          h(
            Button,
            { variant: 'default', onClick: () => nprogress.decrement() },
            () => 'Decrement',
          ),
          h(Button, { variant: 'default', onClick: () => nprogress.set(50) }, () => 'Set 50%'),
          h(Button, { variant: 'default', onClick: () => nprogress.reset() }, () => 'Reset'),
          h(Button, { variant: 'default', onClick: () => nprogress.complete() }, () => 'Complete'),
        ]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
