import { defineComponent, h, ref } from 'vue'
import { Button, Select } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Select, Button } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [dropdownOpened, { toggle }] = useDisclosure()
</script>

<template>
  <Button @click="toggle" mb="md">Toggle dropdown</Button>

  <Select
    label="Your favorite library"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :dropdown-opened="dropdownOpened"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectDropdownOpenedDemo',
  setup() {
    const [dropdownOpened, { toggle }] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { onClick: toggle, mb: 'md' }, () => 'Toggle dropdown'),
        h(Select, {
          label: 'Your favorite library',
          placeholder: 'Pick value',
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
