import { defineComponent, h, ref } from 'vue'
import { Button, Progress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Progress } from '@mantine-vue/core'

const value = ref(50)
</script>

<template>
  <Progress :value="value" size="lg" :transitionDuration="200" />
  <Button @click="value = Math.random() * 100" mt="md">
    Set random value
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'ProgressTransitionDemo',
  setup() {
    const value = ref(50)
    return () =>
      h('div', [
        h(Progress, { value: value.value, size: 'lg', transitionDuration: 200 }),
        h(
          Button,
          {
            onClick: () => {
              value.value = Math.random() * 100
            },
            mt: 'md',
          },
          { default: () => 'Set random value' },
        ),
      ])
  },
})

export const transition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
