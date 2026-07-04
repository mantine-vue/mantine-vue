import { defineComponent, h } from 'vue'
import { Button, MultiSelect } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect, Button } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [dropdownOpened, { toggle }] = useDisclosure()
</script>

<template>
  <Button mb="md" @click="toggle">Toggle dropdown</Button>
  <MultiSelect
    label="Your favorite library"
    placeholder="Pick values"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :dropdown-opened="dropdownOpened"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectDropdownOpenedDemo',
  setup() {
    const [dropdownOpened, { toggle }] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { mb: 'md', onClick: toggle }, () => 'Toggle dropdown'),
        h(MultiSelect, {
          label: 'Your favorite library',
          placeholder: 'Pick values',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          dropdownOpened: dropdownOpened.value,
        }),
      ])
  },
})

export const dropdownOpened: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
