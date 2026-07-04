import { defineComponent, h, ref } from 'vue'
import { Button, SemiCircleProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, SemiCircleProgress } from '@mantine-vue/core'

const value = ref(30)
</script>

<template>
  <SemiCircleProgress :value="value" :transitionDuration="250" :label="\`\${value}%\`" />
  <Button @click="value = Math.floor(Math.random() * 100)" mt="xl" fullWidth>
    Set random value
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'SemiCircleProgressTransitionsDemo',
  setup() {
    const value = ref(30)

    return () =>
      h('div', [
        h(SemiCircleProgress, {
          value: value.value,
          transitionDuration: 250,
          label: `${value.value}%`,
        }),
        h(
          Button,
          {
            onClick: () => {
              value.value = Math.floor(Math.random() * 100)
            },
            mt: 'xl',
            fullWidth: true,
          },
          { default: () => 'Set random value' },
        ),
      ])
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
