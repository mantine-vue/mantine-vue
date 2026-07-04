import { defineComponent, h, ref } from 'vue'
import { PhUserCheck, PhEnvelopeOpen, PhShieldCheck, PhCheckCircle } from '@phosphor-icons/vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stepper } from '@mantine-vue/core'
import { PhUserCheck, PhEnvelopeOpen, PhShieldCheck, PhCheckCircle } from '@phosphor-icons/vue'

const active = ref(1)
</script>

<template>
  <Stepper
    :active="active"
    @step-click="active = $event"
    :completed-icon="() => h(PhCheckCircle, { size: 18 })"
  >
    <Stepper.Step
      :icon="() => h(PhUserCheck, { size: 18 })"
      label="Step 1"
      description="Create an account"
    />
    <Stepper.Step
      :icon="() => h(PhEnvelopeOpen, { size: 18 })"
      label="Step 2"
      description="Verify email"
    />
    <Stepper.Step
      :icon="() => h(PhShieldCheck, { size: 18 })"
      label="Step 3"
      description="Get full access"
    />
  </Stepper>
</template>
`

const Demo = defineComponent({
  name: 'StepperIconsDemo',
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
          completedIcon: () => h(PhCheckCircle, { size: 18 }),
        },
        {
          default: () => [
            h(Stepper.Step, {
              icon: () => h(PhUserCheck, { size: 18 }),
              label: 'Step 1',
              description: 'Create an account',
            }),
            h(Stepper.Step, {
              icon: () => h(PhEnvelopeOpen, { size: 18 }),
              label: 'Step 2',
              description: 'Verify email',
            }),
            h(Stepper.Step, {
              icon: () => h(PhShieldCheck, { size: 18 }),
              label: 'Step 3',
              description: 'Get full access',
            }),
          ],
        },
      )
  },
})

export const icons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
