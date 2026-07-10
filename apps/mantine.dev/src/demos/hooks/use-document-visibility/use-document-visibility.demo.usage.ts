import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import { useDocumentTitle, useDocumentVisibility } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed } from 'vue'
import { Text } from '@mantine-vue/core'
import { useDocumentTitle, useDocumentVisibility } from '@mantine-vue/hooks'

const documentState = useDocumentVisibility()
useDocumentTitle(computed(() => \`Document is \${documentState.value}\`))
</script>

<template>
  <Text>Switch to another tab to see document title change</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseDocumentVisibilityUsageDemo',
  setup() {
    const documentState = useDocumentVisibility()
    useDocumentTitle(() => `Document is ${documentState.value}`)

    return () =>
      h(Text, {}, { default: () => 'Switch to another tab to see document title change' })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
