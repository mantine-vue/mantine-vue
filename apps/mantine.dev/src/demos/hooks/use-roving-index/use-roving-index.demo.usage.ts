import { defineComponent, h } from 'vue'
import { Group } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const items = ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code']

const { getItemProps } = useRovingIndex({
  total: items.length,
  orientation: 'horizontal',
  loop: true,
})
</script>

<template>
  <Group gap="xs">
    <button
      v-for="(item, index) in items"
      :key="item"
      type="button"
      class="mantine-default-btn"
      v-bind="getItemProps({ index })"
    >
      {{ item }}
    </button>
  </Group>
</template>
`

const items = ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code']

const btnStyle = {
  padding: '6px 12px',
  borderRadius: 'var(--mantine-radius-sm)',
  border: '1px solid var(--mantine-color-default-border)',
  backgroundColor: 'var(--mantine-color-default)',
  color: 'var(--mantine-color-text)',
  cursor: 'pointer',
  fontSize: 'var(--mantine-font-size-sm)',
}

const Demo = defineComponent({
  name: 'UseRovingIndexUsageDemo',
  setup() {
    const { getItemProps } = useRovingIndex({
      total: items.length,
      orientation: 'horizontal',
      loop: true,
    })

    return () =>
      h(
        Group,
        { gap: 'xs' },
        {
          default: () =>
            items.map((item, index) =>
              h('button', { type: 'button', style: btnStyle, ...getItemProps({ index }) }, item),
            ),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
