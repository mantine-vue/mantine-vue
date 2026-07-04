import { defineComponent, h } from 'vue'
import { Box, Group, Button, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, Button, Box, Text } from '@mantine-vue/core'
</script>

<template>
  <Box style="overflow: hidden">
    <Box :maw="500" p="md" mx="auto" bg="var(--mantine-color-blue-light)">
      <Text size="sm" :mb="5">
        preventGrowOverflow: true – each child width is always limited to 33% of parent width
        (since there are 3 children)
      </Text>

      <Group grow wrap="nowrap">
        <Button variant="default">First button</Button>
        <Button variant="default">Second button with large content</Button>
        <Button variant="default">Third button</Button>
      </Group>

      <Text size="sm" :mb="5" mt="md">
        preventGrowOverflow: false – children will grow based on their content, they can take more
        than 33% of parent width
      </Text>

      <Group grow :preventGrowOverflow="false" wrap="nowrap">
        <Button variant="default">First button</Button>
        <Button variant="default">Second button with large content</Button>
        <Button variant="default">Third button</Button>
      </Group>
    </Box>
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'GroupPreventGrowOverflowDemo',
  setup() {
    return () =>
      h(Box, { style: { overflow: 'hidden' } }, () => [
        h(Box, { maw: 500, p: 'md', mx: 'auto', bg: 'var(--mantine-color-blue-light)' }, () => [
          h(
            Text,
            { size: 'sm', mb: 5 },
            {
              default: () =>
                'preventGrowOverflow: true – each child width is always limited to 33% of parent width (since there are 3 children)',
            },
          ),
          h(Group, { grow: true, wrap: 'nowrap' }, () => [
            h(Button, { variant: 'default' }, { default: () => 'First button' }),
            h(
              Button,
              { variant: 'default' },
              { default: () => 'Second button with large content' },
            ),
            h(Button, { variant: 'default' }, { default: () => 'Third button' }),
          ]),
          h(
            Text,
            { size: 'sm', mb: 5, mt: 'md' },
            {
              default: () =>
                'preventGrowOverflow: false – children will grow based on their content, they can take more than 33% of parent width',
            },
          ),
          h(Group, { grow: true, preventGrowOverflow: false, wrap: 'nowrap' }, () => [
            h(Button, { variant: 'default' }, { default: () => 'First button' }),
            h(
              Button,
              { variant: 'default' },
              { default: () => 'Second button with large content' },
            ),
            h(Button, { variant: 'default' }, { default: () => 'Third button' }),
          ]),
        ]),
      ])
  },
})

export const preventGrowOverflow: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
