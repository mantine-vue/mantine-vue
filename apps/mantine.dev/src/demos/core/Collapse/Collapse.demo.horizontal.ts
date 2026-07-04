import { defineComponent, h, ref } from 'vue'
import { Box, Button, Collapse, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Collapse, Stack, Text } from '@mantine-vue/core'

const expanded = ref(false)
</script>

<template>
  <Stack :h="240" align="flex-start">
    <Button w="fit-content" @click="expanded = !expanded">
      {{ expanded ? 'Collapse' : 'Expand' }}
    </Button>

    <Collapse :expanded="expanded" orientation="horizontal">
      <Text bg="var(--mantine-color-blue-light)" p="xs" :bdrs="'md'" :w="200">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
    </Collapse>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'CollapseHorizontalDemo',
  setup() {
    const expanded = ref(false)
    return () =>
      h(Stack, { h: 240, align: 'flex-start' }, () => [
        h(
          Button,
          {
            w: 'fit-content',
            onClick: () => {
              expanded.value = !expanded.value
            },
          },
          () => (expanded.value ? 'Collapse' : 'Expand'),
        ),
        h(Collapse, { expanded: expanded.value, orientation: 'horizontal' }, () =>
          h(
            Box,
            {
              bg: 'var(--mantine-color-blue-light)',
              p: 'xs',
              bdrs: 'md',
              w: 200,
            },
            () =>
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          ),
        ),
      ])
  },
})

export const horizontal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
