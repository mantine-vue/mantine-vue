import { defineComponent, h } from 'vue'
import { useIntersection } from '@mantine-vue/hooks'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useIntersection } from '@mantine-vue/hooks'

const { ref: targetRef, entry } = useIntersection({ threshold: 1 })
</script>

<template>
  <div style="height: 300px; overflow-y: scroll; border: 1px solid var(--mantine-color-default-border); border-radius: var(--mantine-radius-md);">
    <div style="padding-top: 260px; padding-bottom: 280px;">
      <div
        ref="targetRef"
        :style="{
          padding: 'var(--mantine-spacing-xl)',
          minWidth: '50%',
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: entry?.isIntersecting ? 'var(--mantine-color-teal-7)' : 'var(--mantine-color-red-7)',
        }"
      >
        <p style="color: #fff; font-weight: 700; margin: 0;">
          {{ entry?.isIntersecting ? 'Fully visible' : 'Obscured' }}
        </p>
      </div>
    </div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseIntersectionUsageDemo',
  setup() {
    const { ref: targetRef, entry } = useIntersection<HTMLDivElement>({ threshold: 1 })

    return () =>
      h(
        'div',
        {
          style: {
            height: '300px',
            overflowY: 'scroll',
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: 'var(--mantine-radius-md)',
          },
        },
        [
          h('div', { style: { paddingTop: '260px', paddingBottom: '280px' } }, [
            h(
              'div',
              {
                ref: targetRef,
                style: {
                  padding: 'var(--mantine-spacing-xl)',
                  minWidth: '50%',
                  borderRadius: 'var(--mantine-radius-md)',
                  backgroundColor: entry.value?.isIntersecting
                    ? 'var(--mantine-color-teal-7)'
                    : 'var(--mantine-color-red-7)',
                },
              },
              [
                h(
                  Text,
                  { c: '#fff', fw: 700 },
                  { default: () => (entry.value?.isIntersecting ? 'Fully visible' : 'Obscured') },
                ),
              ],
            ),
          ]),
        ],
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
