import { defineComponent, h } from 'vue'
import { PhXCircle } from '@phosphor-icons/vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Stepper :active="2">
    <Stepper.Step label="Step 1" description="Create an account" />
    <Stepper.Step
      label="Step 2"
      description="Verify email"
      color="red"
      :completed-icon="() => h(PhXCircle, { size: 20 })"
    />
    <Stepper.Step label="Step 3" description="Get full access" />
  </Stepper>
</template>

<script setup lang="ts">
import { Stepper } from '@mantine-vue/core'
import { PhXCircle } from '@phosphor-icons/vue'
</script>
`

const Demo = defineComponent({
  name: 'StepperStepColorDemo',
  setup() {
    return () =>
      h(
        Stepper,
        { active: 2 },
        {
          default: () => [
            h(Stepper.Step, { label: 'Step 1', description: 'Create an account' }),
            h(Stepper.Step, {
              label: 'Step 2',
              description: 'Verify email',
              color: 'red',
              completedIcon: () => h(PhXCircle, { size: 20 }),
            }),
            h(Stepper.Step, { label: 'Step 3', description: 'Get full access' }),
          ],
        },
      )
  },
})

export const stepColor: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
