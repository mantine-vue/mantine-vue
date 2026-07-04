import { defineComponent, h, ref } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Tooltip, Button } from '@mantine-vue/core'

const opened = ref(true)
</script>

<template>
  <Tooltip label="Ctrl + J" :opened="opened">
    <Button @click="opened = !opened">
      Toggle color scheme
    </Button>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'TooltipControlledDemo',
  setup() {
    const opened = ref(false)
    return () =>
      h(
        Tooltip,
        { label: 'Ctrl + J', opened: opened.value },
        {
          default: () =>
            h(
              Button,
              {
                onClick: () => {
                  opened.value = !opened.value
                },
              },
              () => 'Toggle color scheme',
            ),
        },
      )
  },
})

export const controlled: MantineDemo = {
  type: 'code',
  centered: true,
  code,
  component: Demo,
}
