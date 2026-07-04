import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button } from '@mantine-vue/core'
</script>

<template>
  <Tooltip
    multiline
    :w="220"
    with-arrow
    :transition-props="{ duration: 200 }"
    label="Use this button to save this information in your profile, after that you will be able to access it any time and share it via email."
  >
    <Button>Multiline tooltip</Button>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'TooltipMultilineDemo',
  setup() {
    return () =>
      h(
        Tooltip,
        {
          multiline: true,
          w: 220,
          withArrow: true,
          transitionProps: { duration: 200 },
          label:
            'Use this button to save this information in your profile, after that you will be able to access it any time and share it via email.',
        },
        {
          default: () => h(Button, null, () => 'Multiline tooltip'),
        },
      )
  },
})

export const multiline: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
