import { defineComponent, h } from 'vue'
import { Button, TreeSelect } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const code = `
<script setup lang="ts">
import { TreeSelect, Button } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { data } from './data'

const [dropdownOpened, { toggle }] = useDisclosure()
</script>

<template>
  <Button @click="toggle" mb="md">Toggle dropdown</Button>

  <TreeSelect
    label="Your favorite item"
    placeholder="Pick value"
    :data="data"
    :dropdown-opened="dropdownOpened"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectDropdownOpenedDemo',
  setup() {
    const [dropdownOpened, { toggle }] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { onClick: toggle, mb: 'md' }, () => 'Toggle dropdown'),
        h(TreeSelect, {
          label: 'Your favorite item',
          placeholder: 'Pick value',
          data,
          dropdownOpened: dropdownOpened.value,
        }),
      ])
  },
})

export const dropdownOpened: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
