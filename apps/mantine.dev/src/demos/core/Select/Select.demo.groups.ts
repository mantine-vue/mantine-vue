import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Your favorite library"
    placeholder="Pick value"
    :data="[
      { group: 'Frontend', items: ['React', 'Angular'] },
      { group: 'Backend', items: ['Express', 'Django'] },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectGroupsDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: [
        { group: 'Frontend', items: ['React', 'Angular'] },
        { group: 'Backend', items: ['Express', 'Django'] },
      ],
    }),
})

export const groups: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
