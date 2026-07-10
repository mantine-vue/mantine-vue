import { defineComponent, h } from 'vue'
import { Group } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const items = ['Cut', 'Copy', 'Paste', 'Delete', 'Select All']
const disabledIndices = new Set([1, 3])

const { getItemProps } = useRovingIndex({
  total: items.length,
  orientation: 'horizontal',
  loop: true,
  isItemDisabled: (index) => disabledIndices.has(index),
})
</script>

<template>
  <Group gap="xs">
    <button
      v-for="(item, index) in items"
      :key="item"
      type="button"
      :disabled="disabledIndices.has(index)"
      v-bind="getItemProps({ index })"
      :style="{
        padding: '6px 12px',
        borderRadius: 'var(--mantine-radius-sm)',
        border: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-default)',
        cursor: disabledIndices.has(index) ? 'not-allowed' : 'pointer',
        opacity: disabledIndices.has(index) ? 0.5 : 1,
      }"
    >
      {{ item }}
    </button>
  </Group>
</template>
`

const items = ['Cut', 'Copy', 'Paste', 'Delete', 'Select All']
const disabledIndices = new Set([1, 3])

const Demo = defineComponent({
  name: 'UseRovingIndexDisabledDemo',
  setup() {
    const { getItemProps } = useRovingIndex({
      total: items.length,
      orientation: 'horizontal',
      loop: true,
      isItemDisabled: (index) => disabledIndices.has(index),
    })

    return () =>
      h(
        Group,
        { gap: 'xs' },
        {
          default: () =>
            items.map((item, index) =>
              h(
                'button',
                {
                  type: 'button',
                  disabled: disabledIndices.has(index),
                  style: {
                    padding: '6px 12px',
                    borderRadius: 'var(--mantine-radius-sm)',
                    border: '1px solid var(--mantine-color-default-border)',
                    backgroundColor: 'var(--mantine-color-default)',
                    cursor: disabledIndices.has(index) ? 'not-allowed' : 'pointer',
                    opacity: disabledIndices.has(index) ? 0.5 : 1,
                  },
                  ...getItemProps({ index }),
                },
                item,
              ),
            ),
        },
      )
  },
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
