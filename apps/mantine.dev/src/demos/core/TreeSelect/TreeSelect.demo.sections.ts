import { defineComponent, h } from 'vue'
import { PhSquaresFour } from '@phosphor-icons/vue'
import { TreeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const code = `
<script setup lang="ts">
import { PhSquaresFour } from '@phosphor-icons/vue'
import { TreeSelect } from '@mantine-vue/core'
import { data } from './data'
</script>

<template>
  <TreeSelect
    :data="data"
    left-section-pointer-events="none"
    :left-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite item"
    placeholder="Your favorite item"
  />
  <TreeSelect
    mt="md"
    :data="data"
    right-section-pointer-events="none"
    :right-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite item"
    placeholder="Your favorite item"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectSectionsDemo',
  setup: () => () => {
    const icon = h(PhSquaresFour, { size: 16 })
    return h('div', null, [
      h(TreeSelect, {
        data,
        leftSectionPointerEvents: 'none',
        leftSection: icon,
        label: 'Your favorite item',
        placeholder: 'Your favorite item',
      }),
      h(TreeSelect, {
        mt: 'md',
        data,
        rightSectionPointerEvents: 'none',
        rightSection: icon,
        label: 'Your favorite item',
        placeholder: 'Your favorite item',
      }),
    ])
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
