import { defineComponent, h } from 'vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Stepper{{props}} :active="1">
    <Stepper.Step label="Step 1" description="Create an account" />
    <Stepper.Step label="Step 2" description="Verify email" />
  </Stepper>
</template>

<script setup lang="ts">
import { Stepper } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'StepperConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        Stepper,
        { active: 1, ...(attrs as any) },
        {
          default: () => [
            h(Stepper.Step, { label: 'Step 1', description: 'Create an account' }),
            h(Stepper.Step, { label: 'Step 2', description: 'Verify email' }),
          ],
        },
      )
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'radius', type: 'size', initialValue: 'xl', libraryValue: 'xl' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
  ],
}
