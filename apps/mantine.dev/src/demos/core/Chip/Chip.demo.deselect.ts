import { defineComponent, h, ref } from 'vue'
import { Chip, ChipGroup, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Chip, ChipGroup, Group } from '@mantine-vue/core'

const value = ref<string | null>('first')

const handleChipClick = (chipValue: string) => {
  if (chipValue === value.value) {
    value.value = null
  }
}
</script>

<template>
  <ChipGroup :multiple="false" :value="value" @change="value = $event">
    <Group>
      <Chip value="first" @click.capture="handleChipClick('first')">First</Chip>
      <Chip value="second" @click.capture="handleChipClick('second')">Second</Chip>
      <Chip value="third" @click.capture="handleChipClick('third')">Third</Chip>
    </Group>
  </ChipGroup>
</template>
`

const Demo = defineComponent({
  name: 'ChipDeselectDemo',
  setup() {
    const value = ref<string | null>('first')

    const handleChipClick = (chipValue: string) => {
      if (chipValue === value.value) {
        value.value = null
      }
    }

    return () =>
      h(
        ChipGroup,
        {
          multiple: false,
          value: value.value,
          onChange: (v: string | string[]) => {
            value.value = v as string
          },
        },
        {
          default: () =>
            h(
              Group,
              {},
              {
                default: () => [
                  h(
                    Chip,
                    { value: 'first', onClickCapture: () => handleChipClick('first') },
                    { default: () => 'First' },
                  ),
                  h(
                    Chip,
                    { value: 'second', onClickCapture: () => handleChipClick('second') },
                    { default: () => 'Second' },
                  ),
                  h(
                    Chip,
                    { value: 'third', onClickCapture: () => handleChipClick('third') },
                    { default: () => 'Third' },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const deselect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
