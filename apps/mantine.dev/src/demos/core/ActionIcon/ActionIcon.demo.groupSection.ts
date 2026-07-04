import { defineComponent, h, ref } from 'vue'
import { ActionIcon, ActionIconGroup, ActionIconGroupSection } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const caretUpSvg = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'var(--mantine-color-teal-text)',
    },
    [h('path', { d: 'M12 8l-6 6h12z' })],
  )

const caretDownSvg = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'var(--mantine-color-red-text)',
    },
    [h('path', { d: 'M12 16l-6-6h12z' })],
  )

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ActionIcon, ActionIconGroup, ActionIconGroupSection } from '@mantine-vue/core'

const value = ref(135)
</script>

<template>
  <ActionIconGroup>
    <ActionIcon variant="default" size="lg" @click="value--" aria-label="Decrement value">
      <!-- caret down icon -->
    </ActionIcon>
    <ActionIconGroupSection variant="default" size="lg" bg="var(--mantine-color-body)" :miw="60">
      {{ value }}
    </ActionIconGroupSection>
    <ActionIcon variant="default" size="lg" @click="value++" aria-label="Increment value">
      <!-- caret up icon -->
    </ActionIcon>
  </ActionIconGroup>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconGroupSectionDemo',
  setup() {
    const value = ref(135)
    return () =>
      h(ActionIconGroup, null, {
        default: () => [
          h(
            ActionIcon,
            {
              variant: 'default',
              size: 'lg',
              onClick: () => value.value--,
              'aria-label': 'Decrement value',
            },
            { default: caretDownSvg },
          ),
          h(
            ActionIconGroupSection,
            { variant: 'default', size: 'lg', bg: 'var(--mantine-color-body)', miw: 60 },
            { default: () => String(value.value) },
          ),
          h(
            ActionIcon,
            {
              variant: 'default',
              size: 'lg',
              onClick: () => value.value++,
              'aria-label': 'Increment value',
            },
            { default: caretUpSvg },
          ),
        ],
      })
  },
})

export const groupSection: MantineDemo = { type: 'code', component: Demo, code, centered: true }
