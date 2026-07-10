import { defineComponent, h } from 'vue'
import { Anchor, Box, Divider } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Anchor, Box, Divider } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
</script>

<template>
  <Divider my="xs" label="Label on the left" labelPosition="left" />
  <Divider my="xs" label="Label in the center" />
  <Divider my="xs" label="Label on the right" labelPosition="right" />
  <Divider my="xs" variant="dashed" labelPosition="center">
    <template #default>
      <PhMagnifyingGlass :size="12" />
      <Box ml="5px">Search results</Box>
    </template>
  </Divider>
  <Divider my="xs">
    <template #default>
      <Anchor href="https://mantine-vue" target="_blank" inherit>Link label</Anchor>
    </template>
  </Divider>
</template>
`

const Demo = defineComponent({
  name: 'DividerLabelDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Divider, { my: 'xs', label: 'Label on the left', labelPosition: 'left' }),
        h(Divider, { my: 'xs', label: 'Label in the center' }),
        h(Divider, { my: 'xs', label: 'Label on the right', labelPosition: 'right' }),
        h(
          Divider,
          { my: 'xs', variant: 'dashed', labelPosition: 'center' },
          {
            default: () => [
              h(PhMagnifyingGlass, { size: 12 }),
              h(Box, { ml: '5px' }, { default: () => 'Search results' }),
            ],
          },
        ),
        h(
          Divider,
          { my: 'xs' },
          {
            default: () =>
              h(
                Anchor,
                { href: 'https://mantine-vue', target: '_blank', inherit: true },
                {
                  default: () => 'Link label',
                },
              ),
          },
        ),
      ])
  },
})

export const label: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
