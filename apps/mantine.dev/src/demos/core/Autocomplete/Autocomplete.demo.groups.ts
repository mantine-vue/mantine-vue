import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    :data="[
      { group: 'Frontend', items: ['React', 'Angular'] },
      { group: 'Backend', items: ['Express', 'Django'] },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteGroupsDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
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
