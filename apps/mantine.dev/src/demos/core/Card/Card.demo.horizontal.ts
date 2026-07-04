import { defineComponent, h } from 'vue'
import { Box, Card, Group, RingProgress, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Card, Group, RingProgress, Text } from '@mantine-vue/core'

const completed = 1887
const total = 2334
const stats = [
  { value: 447, label: 'Remaining' },
  { value: 76, label: 'In progress' },
]
</script>

<template>
  <Card padding="sm" withBorder orientation="horizontal">
    <Card.Section inheritPadding px="xs" withBorder>
      <RingProgress
        roundCaps
        :thickness="6"
        :size="150"
        :sections="[{ value: (completed / total) * 100, color: 'blue' }]"
        :label="h('div', {}, [
          h(Text, { ta: 'center', fz: 'lg' }, { default: () => ((completed / total) * 100).toFixed(0) + '%' }),
          h(Text, { ta: 'center', fz: 'xs', c: 'dimmed' }, { default: () => 'Completed' }),
        ])"
      />
    </Card.Section>

    <Card.Section inheritPadding px="md">
      <Text fz="xl">Project tasks</Text>
      <Box mt="xs">
        <Text>1887</Text>
        <Text fz="xs" c="dimmed">Completed</Text>
      </Box>
      <Group mt="sm">
        <div v-for="stat in stats" :key="stat.label">
          <Text>{{ stat.value }}</Text>
          <Text size="xs" c="dimmed">{{ stat.label }}</Text>
        </div>
      </Group>
    </Card.Section>
  </Card>
</template>
`

const completed = 1887
const total = 2334
const stats = [
  { value: 447, label: 'Remaining' },
  { value: 76, label: 'In progress' },
]

const Demo = defineComponent({
  name: 'CardHorizontalDemo',
  setup() {
    return () => {
      const statItems = stats.map((stat) =>
        h('div', { key: stat.label }, [
          h(Text, {}, { default: () => String(stat.value) }),
          h(Text, { size: 'xs', c: 'dimmed' }, { default: () => stat.label }),
        ]),
      )

      return h(
        Card,
        { padding: 'sm', withBorder: true, orientation: 'horizontal' },
        {
          default: () => [
            h(
              Card.Section,
              { inheritPadding: true, px: 'xs', withBorder: true },
              {
                default: () =>
                  h(RingProgress, {
                    roundCaps: true,
                    thickness: 6,
                    size: 150,
                    sections: [{ value: (completed / total) * 100, color: 'blue' }],
                    label: h('div', {}, [
                      h(
                        Text,
                        { ta: 'center', fz: 'lg' },
                        { default: () => `${((completed / total) * 100).toFixed(0)}%` },
                      ),
                      h(
                        Text,
                        { ta: 'center', fz: 'xs', c: 'dimmed' },
                        { default: () => 'Completed' },
                      ),
                    ]),
                  }),
              },
            ),
            h(
              Card.Section,
              { inheritPadding: true, px: 'md' },
              {
                default: () => [
                  h(Text, { fz: 'xl' }, { default: () => 'Project tasks' }),
                  h(
                    Box,
                    { mt: 'xs' },
                    {
                      default: () => [
                        h(Text, {}, { default: () => '1887' }),
                        h(Text, { fz: 'xs', c: 'dimmed' }, { default: () => 'Completed' }),
                      ],
                    },
                  ),
                  h(Group, { mt: 'sm' }, { default: () => statItems }),
                ],
              },
            ),
          ],
        },
      )
    }
  },
})

export const horizontal: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 400,
  centered: true,
  dimmed: true,
  defaultExpanded: false,
  code,
}
