import { defineComponent, h, ref } from 'vue'
import { Group, Rating, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Group, Rating, Stack, Text } from '@mantine-vue/core'

const value = ref(3)
</script>

<template>
  <Stack gap="md" align="center">
    <Text size="sm">Click the same star to clear the rating</Text>
    <Rating :value="value" @change="(v) => (value = v)" allow-clear />
    <Group gap="xs">
      <Text size="sm" c="dimmed">Current rating:</Text>
      <Text size="sm" fw={600}>{{ value === 0 ? 'Not rated' : value }}</Text>
    </Group>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'RatingAllowClearDemo',
  setup() {
    const value = ref(3)
    return () =>
      h(
        Stack,
        { gap: 'md', align: 'center' },
        {
          default: () => [
            h(Text, { size: 'sm' }, { default: () => 'Click the same star to clear the rating' }),
            h(Rating, {
              value: value.value,
              onChange: (v: number) => {
                value.value = v
              },
              allowClear: true,
            }),
            h(
              Group,
              { gap: 'xs' },
              {
                default: () => [
                  h(Text, { size: 'sm', c: 'dimmed' }, { default: () => 'Current rating:' }),
                  h(
                    Text,
                    { size: 'sm', fw: 600 },
                    { default: () => (value.value === 0 ? 'Not rated' : String(value.value)) },
                  ),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const allowClear: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
