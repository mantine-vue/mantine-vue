import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useColorScheme } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
import { useColorScheme } from '@mantine-vue/hooks'

const colorScheme = useColorScheme()
</script>

<template>
  <Badge :color="colorScheme === 'dark' ? 'blue' : 'teal'" variant="filled">
    Your system color scheme is {{ colorScheme }}
  </Badge>
</template>
`

const Demo = defineComponent({
  name: 'UseColorSchemeUsageDemo',
  setup() {
    const colorScheme = useColorScheme()

    return () =>
      h(
        Badge,
        { color: colorScheme.value === 'dark' ? 'blue' : 'teal', variant: 'filled' },
        { default: () => `Your system color scheme is ${colorScheme.value}` },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
}
