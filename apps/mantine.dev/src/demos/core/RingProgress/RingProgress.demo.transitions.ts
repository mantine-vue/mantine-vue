import { defineComponent, h, ref } from 'vue'
import { Button, RingProgress, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, RingProgress, Stack, Text } from '@mantine-vue/core'

const value = ref(30)
</script>

<template>
  <Stack align="center">
    <RingProgress
      :sections="[{ value, color: 'blue' }]"
      :transitionDuration="250"
      :label="h(Text, { ta: 'center' }, { default: () => \`\${value}%\` })"
    />
    <Button @click="value = Math.floor(Math.random() * 100)">Set random value</Button>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'RingProgressTransitionsDemo',
  setup() {
    const value = ref(30)

    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(RingProgress, {
              sections: [{ value: value.value, color: 'blue' }],
              transitionDuration: 250,
              label: h(Text, { ta: 'center' }, { default: () => `${value.value}%` }),
            }),
            h(
              Button,
              {
                onClick: () => {
                  value.value = Math.floor(Math.random() * 100)
                },
              },
              { default: () => 'Set random value' },
            ),
          ],
        },
      )
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
