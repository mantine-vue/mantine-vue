import { defineComponent, h } from 'vue'
import { CopyButton, Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { CopyButton, Button } from '@mantine-vue/core'
</script>

<template>
  <CopyButton value="https://mantine.dev">
    <template #default="{ copied, copy }">
      <Button :color="copied ? 'teal' : 'blue'" @click="copy">
        {{ copied ? 'Copied url' : 'Copy url' }}
      </Button>
    </template>
  </CopyButton>
</template>
`

const Demo = defineComponent({
  name: 'CopyButtonUsageDemo',
  setup() {
    return () =>
      h(
        CopyButton,
        { value: 'https://mantine.dev' },
        {
          default: ({ copied, copy }: { copied: boolean; copy: () => void }) =>
            h(
              Button,
              { color: copied ? 'teal' : 'blue', onClick: copy },
              {
                default: () => (copied ? 'Copied url' : 'Copy url'),
              },
            ),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
