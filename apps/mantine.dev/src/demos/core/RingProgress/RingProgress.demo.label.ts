import { defineComponent, h } from 'vue'
import { ActionIcon, Center, Group, RingProgress, Text } from '@mantine-vue/core'
import { PhCheck } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon, Center, Group, RingProgress, Text } from '@mantine-vue/core'
import { PhCheck } from '@phosphor-icons/vue'
</script>

<template>
  <Group justify="center">
    <RingProgress
      :sections="[{ value: 40, color: 'blue' }]"
      :label="h(Text, { c: 'blue', fw: 700, ta: 'center', size: 'xl' }, { default: () => '40%' })"
    />

    <RingProgress
      :sections="[{ value: 100, color: 'teal' }]"
      :label="h(Center, {}, {
        default: () => h(ActionIcon, { color: 'teal', variant: 'light', radius: 'xl', size: 'xl' }, {
          default: () => h(PhCheck, { size: 22 })
        })
      })"
    />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'RingProgressLabelDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(RingProgress, {
              sections: [{ value: 40, color: 'blue' }],
              label: h(
                Text,
                { c: 'blue', fw: 700, ta: 'center', size: 'xl' },
                { default: () => '40%' },
              ),
            }),
            h(RingProgress, {
              sections: [{ value: 100, color: 'teal' }],
              label: h(
                Center,
                {},
                {
                  default: () =>
                    h(
                      ActionIcon,
                      { color: 'teal', variant: 'light', radius: 'xl', size: 'xl' },
                      {
                        default: () => h(PhCheck, { size: 22 }),
                      },
                    ),
                },
              ),
            }),
          ],
        },
      )
  },
})

export const label: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
