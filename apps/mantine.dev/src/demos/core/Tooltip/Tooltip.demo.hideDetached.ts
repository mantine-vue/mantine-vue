import { defineComponent, h } from 'vue'
import { Box, Button, Group, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

export const hideDetached: MantineDemo = {
  type: 'code',
  centered: true,
  defaultExpanded: false,
  component: defineComponent({
    setup: () => () =>
      h(
        Box,
        {
          bd: '1px solid var(--mantine-color-dimmed)',
          p: 'xl',
          w: 400,
          h: 200,
          style: { overflow: 'auto' },
        },
        () =>
          h(Box, { w: 1000, h: 400 }, () =>
            h(Group, null, () => [
              h(Tooltip, { label: 'Hidden when detached', position: 'bottom', opened: true }, () =>
                h(Button, null, () => 'Hides when detached'),
              ),
              h(
                Tooltip,
                {
                  label: 'Visible when detached',
                  position: 'bottom',
                  opened: true,
                  hideDetached: false,
                },
                () => h(Button, null, () => 'Stays visible'),
              ),
            ]),
          ),
      ),
  }),
  code: `<script setup lang="ts">
import { Box, Button, Group, Tooltip } from '@mantine-vue/core'
</script>
<template>
  <Box bd="1px solid var(--mantine-color-dimmed)" p="xl" :w="400" :h="200" style="overflow: auto">
    <Box :w="1000" :h="400">
      <Group>
        <Tooltip label="Hidden when detached" position="bottom" opened><Button>Hides when detached</Button></Tooltip>
        <Tooltip label="Visible when detached" position="bottom" opened :hideDetached="false"><Button>Stays visible</Button></Tooltip>
      </Group>
    </Box>
  </Box>
</template>`,
}
