import { defineComponent, h } from 'vue'
import { PhCaretDown, PhHash } from '@phosphor-icons/vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhHash, PhCaretDown } from '@phosphor-icons/vue'
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect
    :data="['React', 'Angular']"
    leftSectionPointerEvents="none"
    label="Left section"
  >
    <template #leftSection>
      <PhHash :size="16" />
    </template>
  </NativeSelect>

  <NativeSelect
    :data="['React', 'Angular']"
    label="Right section"
    mt="md"
  >
    <template #rightSection>
      <PhCaretDown :size="16" />
    </template>
  </NativeSelect>
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectSectionsDemo',
  setup: () => () =>
    h('div', null, [
      h(NativeSelect, {
        data: ['React', 'Angular'],
        leftSection: h(PhHash, { size: 16 }),
        leftSectionPointerEvents: 'none',
        label: 'Left section',
      }),
      h(NativeSelect, {
        data: ['React', 'Angular'],
        rightSection: h(PhCaretDown, { size: 16 }),
        label: 'Right section',
        mt: 'md',
      }),
    ]),
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
