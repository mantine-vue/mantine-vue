import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import { useOs } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useOs } from '@mantine-vue/hooks'

const os = useOs()
</script>

<template>
  <Text ta="center">Your os is <b>{{ os }}</b></Text>
</template>
`

const Demo = defineComponent({
  name: 'UseOsUsageDemo',
  setup() {
    const os = useOs()
    return () => h(Text, { ta: 'center' }, { default: () => ['Your os is ', h('b', {}, os.value)] })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
