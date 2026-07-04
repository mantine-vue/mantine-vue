import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
</script>

<template>
  <Badge fullWidth>Full width badge</Badge>
</template>
`

const Demo = defineComponent({
  name: 'BadgeFullWidthDemo',
  setup() {
    return () => h(Badge, { fullWidth: true }, { default: () => 'Full width badge' })
  },
})

export const fullWidth: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
