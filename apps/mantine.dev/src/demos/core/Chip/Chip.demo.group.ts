import { defineComponent, h } from 'vue'
import { Chip, ChipGroup, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Chip, ChipGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <div>
    <ChipGroup>
      <Group justify="center">
        <Chip value="1">Single chip</Chip>
        <Chip value="2">Can be selected</Chip>
        <Chip value="3">At a time</Chip>
      </Group>
    </ChipGroup>

    <ChipGroup multiple>
      <Group justify="center" mt="md">
        <Chip value="1">Multiple chips</Chip>
        <Chip value="2">Can be selected</Chip>
        <Chip value="3">At a time</Chip>
      </Group>
    </ChipGroup>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ChipGroupDemo',
  setup: () => () =>
    h('div', null, [
      h(
        ChipGroup,
        {},
        {
          default: () =>
            h(
              Group,
              { justify: 'center' },
              {
                default: () => [
                  h(Chip, { value: '1' }, { default: () => 'Single chip' }),
                  h(Chip, { value: '2' }, { default: () => 'Can be selected' }),
                  h(Chip, { value: '3' }, { default: () => 'At a time' }),
                ],
              },
            ),
        },
      ),
      h(
        ChipGroup,
        { multiple: true },
        {
          default: () =>
            h(
              Group,
              { justify: 'center', mt: 'md' },
              {
                default: () => [
                  h(Chip, { value: '1' }, { default: () => 'Multiple chips' }),
                  h(Chip, { value: '2' }, { default: () => 'Can be selected' }),
                  h(Chip, { value: '3' }, { default: () => 'At a time' }),
                ],
              },
            ),
        },
      ),
    ]),
})

export const group: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
