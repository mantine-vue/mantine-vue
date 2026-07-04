import { defineComponent, h } from 'vue'
import { CopyButton, ActionIcon, Tooltip } from '@mantine-vue/core'
import { PhCheck, PhCopy } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { CopyButton, ActionIcon, Tooltip } from '@mantine-vue/core'
import { PhCheck, PhCopy } from '@phosphor-icons/vue'
</script>

<template>
  <CopyButton value="https://mantine.dev" :timeout="2000">
    <template #default="{ copied, copy }">
      <Tooltip :label="copied ? 'Copied' : 'Copy'" withArrow position="right">
        <ActionIcon :color="copied ? 'teal' : 'gray'" variant="subtle" @click="copy">
          <PhCheck v-if="copied" :size="16" />
          <PhCopy v-else :size="16" />
        </ActionIcon>
      </Tooltip>
    </template>
  </CopyButton>
</template>
`

const Demo = defineComponent({
  name: 'CopyButtonTimeoutDemo',
  setup() {
    return () =>
      h(
        CopyButton,
        { value: 'https://mantine.dev', timeout: 2000 },
        {
          default: ({ copied, copy }: { copied: boolean; copy: () => void }) =>
            h(
              Tooltip,
              { label: copied ? 'Copied' : 'Copy', withArrow: true, position: 'right' },
              {
                default: () =>
                  h(
                    ActionIcon,
                    { color: copied ? 'teal' : 'gray', variant: 'subtle', onClick: copy },
                    {
                      default: () => (copied ? h(PhCheck, { size: 16 }) : h(PhCopy, { size: 16 })),
                    },
                  ),
              },
            ),
        },
      )
  },
})

export const timeout: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
