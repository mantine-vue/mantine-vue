import { defineComponent, h, ref } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Popover, Text, Button } from '@mantine-vue/core'

const opened = ref(false)
</script>

<template>
  <Popover :width="200" position="bottom" with-arrow shadow="md" :opened="opened">
    <Popover.Target>
      <Button @mouseenter="opened = true" @mouseleave="opened = false">
        Hover to see popover
      </Button>
    </Popover.Target>
    <Popover.Dropdown :style="{ pointerEvents: 'none' }">
      <Text size="sm">This popover is shown when user hovers the target element</Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverHoverDemo',
  setup() {
    const opened = ref(false)
    return () =>
      h(
        Popover,
        { width: 200, position: 'bottom', withArrow: true, shadow: 'md', opened: opened.value },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () =>
                h(
                  Button,
                  {
                    onMouseenter: () => (opened.value = true),
                    onMouseleave: () => (opened.value = false),
                  },
                  () => 'Hover to see popover',
                ),
            }),
            h(
              Popover.Dropdown,
              { style: { pointerEvents: 'none' } },
              {
                default: () =>
                  h(
                    Text,
                    { size: 'sm' },
                    () => 'This popover is shown when user hovers the target element',
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const hover: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
