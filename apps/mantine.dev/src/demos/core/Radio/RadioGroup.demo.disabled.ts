import { defineComponent, h } from 'vue'
import { Group, Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, Group } from '@mantine-vue/core'
</script>

<template>
  <Radio.Group
    disabled
    name="favoriteFramework"
    label="Select your favorite framework/library"
    description="This is anonymous"
  >
    <Group mt="xs">
      <Radio label="React" value="react" />
      <Radio label="Angular" value="nu" />
      <Radio label="Svelte" value="sv" />
    </Group>
  </Radio.Group>
</template>
`

const Demo = defineComponent({
  name: 'RadioGroupDisabledDemo',
  setup: () => () =>
    h(
      Radio.Group,
      {
        disabled: true,
        name: 'favoriteFramework',
        label: 'Select your favorite framework/library',
        description: 'This is anonymous',
      },
      {
        default: () =>
          h(
            Group,
            { mt: 'xs' },
            {
              default: () => [
                h(Radio, { label: 'React', value: 'react' }),
                h(Radio, { label: 'Angular', value: 'nu' }),
                h(Radio, { label: 'Svelte', value: 'sv' }),
              ],
            },
          ),
      },
    ),
})

export const groupDisabled: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
