import { defineComponent, h } from 'vue'
import { InputBase } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { InputBase } from '@mantine-vue/core'
</script>

<template>
  <div>
    <InputBase label="Your phone" component="input" placeholder="Your phone" />
    <InputBase label="Custom native select" component="select" mt="md">
      <option value="react">React</option>
      <option value="angular">Angular</option>
      <option value="svelte">Svelte</option>
    </InputBase>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputBaseDemo',
  setup: () => () =>
    h('div', null, [
      h(InputBase, { label: 'Your phone', component: 'input', placeholder: 'Your phone' }),
      h(
        InputBase,
        { label: 'Custom native select', component: 'select', mt: 'md' },
        {
          default: () => [
            h('option', { value: 'react' }, 'React'),
            h('option', { value: 'angular' }, 'Angular'),
            h('option', { value: 'svelte' }, 'Svelte'),
          ],
        },
      ),
    ]),
})

export const inputBase: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
