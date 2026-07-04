import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { Input } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { Input } from '@mantine-vue/core'
</script>

<template>
  <div>
    <Input component="button" pointer>
      Button input
    </Input>

    <Input
      component="select"
      :rightSection="h(PhCaretDown, { size: 14 })"
      pointer
      mt="md"
    >
      <option value="1">1</option>
      <option value="2">2</option>
    </Input>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputComponentDemo',
  setup: () => () =>
    h('div', null, [
      h(Input, { component: 'button', pointer: true }, { default: () => 'Button input' }),
      h(
        Input,
        {
          component: 'select',
          rightSection: h(PhCaretDown, { size: 14 }),
          pointer: true,
          mt: 'md',
        },
        {
          default: () => [h('option', { value: '1' }, '1'), h('option', { value: '2' }, '2')],
        },
      ),
    ]),
})

export const component: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
