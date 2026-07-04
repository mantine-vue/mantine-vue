import { defineComponent, h } from 'vue'
import { Group, ThemeIcon } from '@mantine-vue/core'
import { PhFingerprint } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ThemeIcon, Group } from '@mantine-vue/core'
import { PhFingerprint } from '@phosphor-icons/vue'
</script>

<template>
  <Group>
    <ThemeIcon size="lg" color="lime.4">
      <PhFingerprint :size="20" />
    </ThemeIcon>
    <ThemeIcon size="lg" color="lime.4" autoContrast>
      <PhFingerprint :size="20" />
    </ThemeIcon>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ThemeIconAutoContrastDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(
              ThemeIcon,
              { size: 'lg', color: 'lime.4' },
              {
                default: () => h(PhFingerprint, { size: 20 }),
              },
            ),
            h(
              ThemeIcon,
              { size: 'lg', color: 'lime.4', autoContrast: true },
              {
                default: () => h(PhFingerprint, { size: 20 }),
              },
            ),
          ],
        },
      )
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
