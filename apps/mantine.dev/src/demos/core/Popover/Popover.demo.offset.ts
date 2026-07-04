import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import { FLOATING_POSITION_DATA } from '@/demos/shared/variants-data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Button, Text } from '@mantine-vue/core'
</script>

<template>
  <Popover
    :width="200"
    :opened="true"
    {{props}}
  >
    <Popover.Target>
      <Button>Popover target</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="xs">
        Change position and offset to configure dropdown offset relative to target
      </Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Wrapper = defineComponent({
  name: 'PopoverOffsetDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Popover,
        { width: 200, opened: true, ...(attrs as any) },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, null, () => 'Popover target'),
            }),
            h(Popover.Dropdown, null, {
              default: () =>
                h(
                  Text,
                  { size: 'xs' },
                  () =>
                    'Change position and offset to configure dropdown offset relative to target',
                ),
            }),
          ],
        },
      )
  },
})

export const offset: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'select',
      prop: 'position',
      initialValue: 'bottom',
      data: FLOATING_POSITION_DATA,
      libraryValue: null as any,
    },
    {
      type: 'number',
      prop: 'offset',
      initialValue: 0,
      libraryValue: null as any,
      min: -50,
      max: 50,
    },
  ],
}
