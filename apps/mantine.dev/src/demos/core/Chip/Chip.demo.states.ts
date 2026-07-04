import { defineComponent, h } from 'vue'
import { Chip, ChipGroup, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Chip, ChipGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <div>
    <ChipGroup multiple :value="['checked', 'checked-disabled']">
      <Group justify="center">
        <Chip value="default" variant="outline">Outline default</Chip>
        <Chip value="checked" variant="outline">Outline checked</Chip>
        <Chip value="checked-disabled" disabled variant="outline">Outline checked disabled</Chip>
      </Group>
    </ChipGroup>

    <ChipGroup multiple :value="['checked', 'checked-disabled']">
      <Group justify="center" mt="md">
        <Chip value="default" variant="light">Light default</Chip>
        <Chip value="checked" variant="light">Light checked</Chip>
        <Chip value="checked-disabled" disabled variant="light">Light checked disabled</Chip>
      </Group>
    </ChipGroup>

    <ChipGroup multiple :value="['checked', 'checked-disabled']">
      <Group justify="center" mt="md">
        <Chip value="default" variant="filled">Filled default</Chip>
        <Chip value="checked" variant="filled">Filled checked</Chip>
        <Chip value="checked-disabled" disabled variant="filled">Filled checked disabled</Chip>
      </Group>
    </ChipGroup>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ChipStatesDemo',
  setup: () => () =>
    h('div', null, [
      h(
        ChipGroup,
        { multiple: true, value: ['checked', 'checked-disabled'] },
        {
          default: () =>
            h(
              Group,
              { justify: 'center' },
              {
                default: () => [
                  h(
                    Chip,
                    { value: 'default', variant: 'outline' },
                    { default: () => 'Outline default' },
                  ),
                  h(
                    Chip,
                    { value: 'checked', variant: 'outline' },
                    { default: () => 'Outline checked' },
                  ),
                  h(
                    Chip,
                    { value: 'checked-disabled', disabled: true, variant: 'outline' },
                    { default: () => 'Outline checked disabled' },
                  ),
                ],
              },
            ),
        },
      ),
      h(
        ChipGroup,
        { multiple: true, value: ['checked', 'checked-disabled'] },
        {
          default: () =>
            h(
              Group,
              { justify: 'center', mt: 'md' },
              {
                default: () => [
                  h(
                    Chip,
                    { value: 'default', variant: 'light' },
                    { default: () => 'Light default' },
                  ),
                  h(
                    Chip,
                    { value: 'checked', variant: 'light' },
                    { default: () => 'Light checked' },
                  ),
                  h(
                    Chip,
                    { value: 'checked-disabled', disabled: true, variant: 'light' },
                    { default: () => 'Light checked disabled' },
                  ),
                ],
              },
            ),
        },
      ),
      h(
        ChipGroup,
        { multiple: true, value: ['checked', 'checked-disabled'] },
        {
          default: () =>
            h(
              Group,
              { justify: 'center', mt: 'md' },
              {
                default: () => [
                  h(
                    Chip,
                    { value: 'default', variant: 'filled' },
                    { default: () => 'Filled default' },
                  ),
                  h(
                    Chip,
                    { value: 'checked', variant: 'filled' },
                    { default: () => 'Filled checked' },
                  ),
                  h(
                    Chip,
                    { value: 'checked-disabled', disabled: true, variant: 'filled' },
                    { default: () => 'Filled checked disabled' },
                  ),
                ],
              },
            ),
        },
      ),
    ]),
})

export const states: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
