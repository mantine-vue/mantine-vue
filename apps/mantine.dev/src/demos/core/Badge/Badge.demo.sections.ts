import { defineComponent, h } from 'vue'
import { Badge, Group } from '@mantine-vue/core'
import { PhAt } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Group } from '@mantine-vue/core'
import { PhAt } from '@phosphor-icons/vue'

const icon = h(PhAt, { size: 12 })
</script>

<template>
  <Group>
    <Badge :leftSection="icon">With left section</Badge>
    <Badge :rightSection="icon">With right section</Badge>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'BadgeSectionsDemo',
  setup() {
    const icon = h(PhAt, { size: 12 })
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(Badge, { leftSection: icon }, { default: () => 'With left section' }),
            h(Badge, { rightSection: icon }, { default: () => 'With right section' }),
          ],
        },
      )
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
