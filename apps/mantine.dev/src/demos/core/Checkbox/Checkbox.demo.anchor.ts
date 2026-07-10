import { defineComponent, h } from 'vue'
import { Anchor, Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Anchor, Checkbox } from '@mantine-vue/core'
</script>

<template>
  <Checkbox>
    <template #label>
      I accept
      <Anchor href="https://mantine-vue" target="_blank" inherit> terms and conditions </Anchor>
    </template>
  </Checkbox>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxAnchorDemo',
  setup: () => () =>
    h(Checkbox, {
      label: h('span', null, [
        'I accept ',
        h(
          Anchor,
          { href: 'https://mantine-vue', target: '_blank', inherit: true },
          {
            default: () => 'terms and conditions',
          },
        ),
      ]),
    }),
})

export const anchor: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
