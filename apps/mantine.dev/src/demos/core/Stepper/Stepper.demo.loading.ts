import { defineComponent, h } from 'vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Stepper :active="1">
    <Stepper.Step label="Step 1" description="Create an account" />
    <Stepper.Step label="Step 2" description="Verify email" loading />
    <Stepper.Step label="Step 3" description="Get full access" />
  </Stepper>
</template>

<script setup lang="ts">
import { Stepper } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'StepperLoadingDemo',
  setup() {
    return () =>
      h(
        Stepper,
        { active: 1 },
        {
          default: () => [
            h(Stepper.Step, { label: 'Step 1', description: 'Create an account' }),
            h(Stepper.Step, { label: 'Step 2', description: 'Verify email', loading: true }),
            h(Stepper.Step, { label: 'Step 3', description: 'Get full access' }),
          ],
        },
      )
  },
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
