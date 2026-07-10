import { defineComponent, h, ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { usePageLeave } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { usePageLeave } from '@mantine-vue/hooks'

const leftsCount = ref(0)
usePageLeave(() => leftsCount.value++)
</script>

<template>
  <Text ta="center">Mouse left the page {{ leftsCount }} times</Text>
</template>
`

const Demo = defineComponent({
  name: 'UsePageLeaveUsageDemo',
  setup() {
    const leftsCount = ref(0)
    usePageLeave(() => leftsCount.value++)

    return () =>
      h(Text, { ta: 'center' }, { default: () => `Mouse left the page ${leftsCount.value} times` })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
