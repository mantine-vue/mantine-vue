import { defineComponent, h } from 'vue'
import { Badge, OverflowList } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const data = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Indian Fig',
  'Jackfruit',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
]

const code = `
<script setup lang="ts">
import { Badge, OverflowList } from '@mantine-vue/core'

const data = ['Apple', 'Banana', /* ... */]
</script>

<template>
  <div style="resize: horizontal; overflow: auto; max-width: 500px">
    <OverflowList
      :data="data"
      :gap="4"
      :maxRows="2"
      :renderOverflow="(items) => h(Badge, {}, { default: () => \`+\${items.length} more\` })"
      :renderItem="(item, index) => h(Badge, { key: index }, { default: () => item })"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'OverflowListMaxRowsDemo',
  setup() {
    return () =>
      h('div', { style: { resize: 'horizontal', overflow: 'auto', maxWidth: '500px' } }, [
        h(OverflowList, {
          data,
          gap: 4,
          maxRows: 2,
          renderOverflow: (items: any[]) =>
            h(Badge, {}, { default: () => `+${items.length} more` }),
          renderItem: (item: string, index: number) =>
            h(Badge, { key: index }, { default: () => item }),
        }),
      ])
  },
})

export const maxRows: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
