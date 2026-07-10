import { defineComponent, h } from 'vue'
import { Stack } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Stack } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const items = ['General', 'Account', 'Security', 'Notifications', 'Privacy']

const { getItemProps, focusedIndex } = useRovingIndex({
  total: items.length,
  orientation: 'vertical',
  loop: true,
})
</script>

<template>
  <Stack gap={4} w={200}>
    <button
      v-for="(item, index) in items"
      :key="item"
      type="button"
      v-bind="getItemProps({ index })"
      :style="{
        textAlign: 'left',
        padding: '8px 10px',
        borderRadius: 'var(--mantine-radius-sm)',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: focusedIndex === index ? 'var(--mantine-color-blue-light)' : 'transparent',
      }"
    >
      {{ item }}
    </button>
  </Stack>
</template>
`

const items = ['General', 'Account', 'Security', 'Notifications', 'Privacy']

const Demo = defineComponent({
  name: 'UseRovingIndexVerticalDemo',
  setup() {
    const { getItemProps, focusedIndex } = useRovingIndex({
      total: items.length,
      orientation: 'vertical',
      loop: true,
    })

    return () =>
      h(
        Stack,
        { gap: 4, w: 200 },
        {
          default: () =>
            items.map((item, index) =>
              h(
                'button',
                {
                  type: 'button',
                  style: {
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: 'var(--mantine-radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor:
                      focusedIndex.value === index
                        ? 'var(--mantine-color-blue-light)'
                        : 'transparent',
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

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
