import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import { em } from '@mantine-vue/utils'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import { em } from '@mantine-vue/utils'

const matches = useMediaQuery(\`(min-width: \${em(900)})\`)
</script>

<template>
  <Badge :color="matches ? 'teal' : 'red'" variant="filled">
    Breakpoint {{ matches ? 'matches' : 'does not match' }}
  </Badge>
</template>
`

const Demo = defineComponent({
  name: 'UseMediaQueryUsageDemo',
  setup() {
    const matches = useMediaQuery(`(min-width: ${em(900)})`)

    return () =>
      h(
        Badge,
        { color: matches.value ? 'teal' : 'red', variant: 'filled' },
        () => `Breakpoint ${matches.value ? 'matches' : 'does not match'}`,
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
