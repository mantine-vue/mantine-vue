import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SimpleGrid } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const total = 9
const columns = 3

const { getItemProps, focusedIndex } = useRovingIndex({ total, columns })
</script>

<template>
  <SimpleGrid :cols="columns" :w="300" spacing="xs">
    <button
      v-for="index in total"
      :key="index"
      type="button"
      v-bind="getItemProps({ index: index - 1 })"
      :style="{
        padding: '16px',
        textAlign: 'center',
        borderRadius: 'var(--mantine-radius-sm)',
        border: '1px solid var(--mantine-color-default-border)',
        cursor: 'pointer',
        backgroundColor:
          focusedIndex === index - 1 ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-body)',
      }"
    >
      Cell {{ index }}
    </button>
  </SimpleGrid>
</template>
`

const total = 9
const columns = 3

const Demo = defineComponent({
  name: 'UseRovingIndexGridDemo',
  setup() {
    const { getItemProps, focusedIndex } = useRovingIndex({ total, columns })

    return () =>
      h(
        SimpleGrid,
        { cols: columns, w: 300, spacing: 'xs' },
        {
          default: () =>
            Array.from({ length: total }, (_, index) =>
              h(
                'button',
                {
                  type: 'button',
                  style: {
                    padding: '16px',
                    textAlign: 'center',
                    borderRadius: 'var(--mantine-radius-sm)',
                    border: '1px solid var(--mantine-color-default-border)',
                    cursor: 'pointer',
                    backgroundColor:
                      focusedIndex.value === index
                        ? 'var(--mantine-color-blue-light)'
                        : 'var(--mantine-color-body)',
                  },
                  ...getItemProps({ index }),
                },
                `Cell ${index + 1}`,
              ),
            ),
        },
      )
  },
})

export const grid: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
