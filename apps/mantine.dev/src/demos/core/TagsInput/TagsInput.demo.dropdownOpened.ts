import { defineComponent, h } from 'vue'
import { Button, TagsInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput, Button } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [dropdownOpened, { toggle }] = useDisclosure()
</script>

<template>
  <Button @click="toggle" mb="md">Toggle dropdown</Button>

  <TagsInput
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :dropdown-opened="dropdownOpened"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDropdownOpenedDemo',
  setup() {
    const [dropdownOpened, { toggle }] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { onClick: toggle, mb: 'md' }, () => 'Toggle dropdown'),
        h(TagsInput, {
          label: 'Your favorite library',
          placeholder: 'Pick value or enter anything',
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
