import { defineComponent, h } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import { PhBiohazard, PhRadioactive } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import { PhBiohazard, PhRadioactive } from '@phosphor-icons/vue'

const CheckboxIcon = ({ indeterminate, ...others }: any) =>
  indeterminate ? h(PhRadioactive, others) : h(PhBiohazard, others)
</script>

<template>
  <div>
    <Checkbox :icon="CheckboxIcon" label="Custom icon" defaultChecked />
    <Checkbox :icon="CheckboxIcon" label="Custom icon: indeterminate" indeterminate mt="sm" />
  </div>
</template>
`

const CheckboxIcon = ({ indeterminate, ...others }: any) =>
  indeterminate ? h(PhRadioactive, others) : h(PhBiohazard, others)

const Demo = defineComponent({
  name: 'CheckboxIconDemo',
  setup: () => () =>
    h('div', null, [
      h(Checkbox, { icon: CheckboxIcon, label: 'Custom icon', defaultChecked: true }),
      h(Checkbox, {
        icon: CheckboxIcon,
        label: 'Custom icon: indeterminate',
        indeterminate: true,
        mt: 'sm',
      }),
    ]),
})

export const icon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
