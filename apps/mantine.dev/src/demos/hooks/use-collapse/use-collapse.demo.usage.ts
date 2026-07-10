import { defineComponent, h } from 'vue'
import { Button, Box } from '@mantine-vue/core'
import { useCollapse, useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Box } from '@mantine-vue/core'
import { useCollapse, useDisclosure } from '@mantine-vue/hooks'

const [expanded, handlers] = useDisclosure(false)
const { getCollapseProps } = useCollapse({ expanded })
</script>

<template>
  <Button @click="handlers.toggle" mb="md">
    {{ expanded ? 'Collapse' : 'Expand' }}
  </Button>

  <div v-bind="getCollapseProps()">
    <Box bg="var(--mantine-color-blue-light)" p="xs" style="border-radius: var(--mantine-radius-md)">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </Box>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseCollapseUsageDemo',
  setup() {
    const [expanded, handlers] = useDisclosure(false)
    const { getCollapseProps } = useCollapse({ expanded })

    return () =>
      h('div', [
        h(
          Button,
          { onClick: handlers.toggle, mb: 'md' },
          { default: () => (expanded.value ? 'Collapse' : 'Expand') },
        ),
        h('div', getCollapseProps(), [
          h(
            Box,
            {
              bg: 'var(--mantine-color-blue-light)',
              p: 'xs',
              style: { borderRadius: 'var(--mantine-radius-md)' },
            },
            {
              default: () =>
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            },
          ),
        ]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
