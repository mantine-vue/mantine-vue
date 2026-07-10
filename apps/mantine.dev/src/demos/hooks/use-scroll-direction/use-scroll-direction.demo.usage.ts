import { defineComponent, h } from 'vue'
import { Badge, Text } from '@mantine-vue/core'
import { useScrollDirection } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Text } from '@mantine-vue/core'
import { useScrollDirection } from '@mantine-vue/hooks'

const direction = useScrollDirection()
</script>

<template>
  <Badge :color="direction === 'up' ? 'teal' : direction === 'down' ? 'red' : 'gray'">
    <template v-if="direction === 'up'">↑ Scrolling UP</template>
    <template v-else-if="direction === 'down'">↓ Scrolling DOWN</template>
    <template v-else>Scroll to detect direction</template>
  </Badge>
  <Text mt="xs">Scroll the page to see the scroll direction</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseScrollDirectionUsageDemo',
  setup() {
    const direction = useScrollDirection()

    return () => [
      h(
        Badge,
        {
          color: direction.value === 'up' ? 'teal' : direction.value === 'down' ? 'red' : 'gray',
        },
        () => {
          if (direction.value === 'up') return '↑ Scrolling UP'
          if (direction.value === 'down') return '↓ Scrolling DOWN'
          return 'Scroll to detect direction'
        },
      ),
      h(Text, { mt: 'xs' }, () => 'Scroll the page to see the scroll direction'),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
