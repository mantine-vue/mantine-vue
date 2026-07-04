import { defineComponent, h, ref } from 'vue'
import { Button, Group, Stepper } from '@mantine-vue/core'
import { Content } from './_content'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stepper, Button, Group } from '@mantine-vue/core'

const active = ref(1)
const highestStepVisited = ref(active.value)

const handleStepChange = (nextStep: number) => {
  if (nextStep > 3 || nextStep < 0) return
  active.value = nextStep
  highestStepVisited.value = Math.max(highestStepVisited.value, nextStep)
}

const shouldAllowSelectStep = (step: number) =>
  highestStepVisited.value >= step && active.value !== step
</script>

<template>
  <div>
    <Stepper :active="active" @step-click="active = $event">
      <Stepper.Step
        label="First step"
        description="Create an account"
        :allow-step-select="shouldAllowSelectStep(0)"
      >
        Step 1 content: Create an account
      </Stepper.Step>
      <Stepper.Step
        label="Second step"
        description="Verify email"
        :allow-step-select="shouldAllowSelectStep(1)"
      >
        Step 2 content: Verify email
      </Stepper.Step>
      <Stepper.Step
        label="Final step"
        description="Get full access"
        :allow-step-select="shouldAllowSelectStep(2)"
      >
        Step 3 content: Get full access
      </Stepper.Step>
      <Stepper.Completed>
        Completed, click back button to get to previous step
      </Stepper.Completed>
    </Stepper>

    <Group justify="center" mt="xl">
      <Button variant="default" @click="handleStepChange(active - 1)">Back</Button>
      <Button @click="handleStepChange(active + 1)">Next step</Button>
    </Group>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'StepperAllowStepSelectDemo',
  setup() {
    const active = ref(1)
    const highestStepVisited = ref(active.value)

    const handleStepChange = (nextStep: number) => {
      if (nextStep > 3 || nextStep < 0) return
      active.value = nextStep
      highestStepVisited.value = Math.max(highestStepVisited.value, nextStep)
    }

    const shouldAllowSelectStep = (step: number) =>
      highestStepVisited.value >= step && active.value !== step

    return () =>
      h('div', {}, [
        h(
          Stepper,
          {
            active: active.value,
            onStepClick: (s: number) => {
              active.value = s
            },
          },
          {
            default: () => [
              h(
                Stepper.Step,
                {
                  label: 'First step',
                  description: 'Create an account',
                  allowStepSelect: shouldAllowSelectStep(0),
                },
                {
                  default: () =>
                    h(Content, {}, { default: () => 'Step 1 content: Create an account' }),
                },
              ),
              h(
                Stepper.Step,
                {
                  label: 'Second step',
                  description: 'Verify email',
                  allowStepSelect: shouldAllowSelectStep(1),
                },
                {
                  default: () => h(Content, {}, { default: () => 'Step 2 content: Verify email' }),
                },
              ),
              h(
                Stepper.Step,
                {
                  label: 'Final step',
                  description: 'Get full access',
                  allowStepSelect: shouldAllowSelectStep(2),
                },
                {
                  default: () =>
                    h(Content, {}, { default: () => 'Step 3 content: Get full access' }),
                },
              ),
              h(
                Stepper.Completed,
                {},
                {
                  default: () =>
                    h(
                      Content,
                      {},
                      { default: () => 'Completed, click back button to get to previous step' },
                    ),
                },
              ),
            ],
          },
        ),
        h(
          Group,
          { justify: 'center', mt: 'xl' },
          {
            default: () => [
              h(
                Button,
                { variant: 'default', onClick: () => handleStepChange(active.value - 1) },
                { default: () => 'Back' },
              ),
              h(
                Button,
                { onClick: () => handleStepChange(active.value + 1) },
                { default: () => 'Next step' },
              ),
            ],
          },
        ),
      ])
  },
})

export const allowStepSelect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
