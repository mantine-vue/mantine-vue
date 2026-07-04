import { defineComponent, h } from 'vue'
import { Group, Progress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, Progress } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Progress :value="80" orientation="vertical" :h="200" />
    <Progress :value="60" color="orange" size="xl" orientation="vertical" :h="200" animated />

    <Progress.Root size="xl" autoContrast orientation="vertical" :h="200">
      <Progress.Section :value="40" color="lime.4">
        <Progress.Label>Documents</Progress.Label>
      </Progress.Section>
      <Progress.Section :value="20" color="yellow.4">
        <Progress.Label>Apps</Progress.Label>
      </Progress.Section>
      <Progress.Section :value="20" color="cyan.7">
        <Progress.Label>Other</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ProgressVerticalDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(Progress, { value: 80, orientation: 'vertical', h: 200 }),
            h(Progress, {
              value: 60,
              color: 'orange',
              size: 'xl',
              orientation: 'vertical',
              h: 200,
              animated: true,
            }),
            h(
              Progress.Root,
              { size: 'xl', autoContrast: true, orientation: 'vertical', h: 200 },
              {
                default: () => [
                  h(
                    Progress.Section,
                    { value: 40, color: 'lime.4' },
                    {
                      default: () => h(Progress.Label, {}, { default: () => 'Documents' }),
                    },
                  ),
                  h(
                    Progress.Section,
                    { value: 20, color: 'yellow.4' },
                    {
                      default: () => h(Progress.Label, {}, { default: () => 'Apps' }),
                    },
                  ),
                  h(
                    Progress.Section,
                    { value: 20, color: 'cyan.7' },
                    {
                      default: () => h(Progress.Label, {}, { default: () => 'Other' }),
                    },
                  ),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
