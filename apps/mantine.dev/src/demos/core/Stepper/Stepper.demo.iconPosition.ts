import { defineComponent, h, ref } from 'vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stepper } from '@mantine-vue/core'

const active = ref(1)
</script>

<template>
  <Stepper :active="active" @step-click="active = $event" icon-position="right">
    <Stepper.Step label="Step 1" description="Create an account" />
    <Stepper.Step label="Step 2" description="Verify email" />
    <Stepper.Step label="Step 3" description="Get full access" />
  </Stepper>
</template>
`

const Demo = defineComponent({
  name: 'StepperIconPositionDemo',
  setup() {
    const active = ref(1)

    return () =>
      h(
        Stepper,
        {
          active: active.value,
          onStepClick: (s: number) => {
            active.value = s
          },
          iconPosition: 'right',
        },
        {
          default: () => [
            h(Stepper.Step, { label: 'Step 1', description: 'Create an account' }),
            h(Stepper.Step, { label: 'Step 2', description: 'Verify email' }),
            h(Stepper.Step, { label: 'Step 3', description: 'Get full access' }),
          ],
        },
      )
  },
})

export const iconPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
