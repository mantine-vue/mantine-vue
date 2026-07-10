import { defineComponent, h, ref } from 'vue'
import { Button } from '@mantine-vue/core'
import { randomId, useDocumentTitle } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentTitle, randomId } from '@mantine-vue/hooks'
import { Button } from '@mantine-vue/core'

const title = ref('')
useDocumentTitle(title)
</script>

<template>
  <Button @click="title = randomId()">Set document title to random id</Button>
</template>
`

const Demo = defineComponent({
  name: 'UseDocumentTitleUsageDemo',
  setup() {
    const title = ref('')
    useDocumentTitle(title)

    return () =>
      h(
        Button,
        { onClick: () => (title.value = randomId()) },
        {
          default: () => 'Set document title to random id',
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
}
