import { defineComponent, h, ref } from 'vue'
import { Button, Group, Stepper } from '@mantine-vue/core'
import { Content } from './_content'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stepper, Button, Group } from '@mantine-vue/core'

const active = ref(1)
const nextStep = () => { if (active.value < 3) active.value++ }
const prevStep = () => { if (active.value > 0) active.value-- }
</script>

<template>
  <div>
    <Stepper :active="active" @step-click="active = $event" :allow-next-steps-select="false">
      <Stepper.Step label="First step" description="Create an account">
        Step 1 content: Create an account
      </Stepper.Step>
      <Stepper.Step label="Second step" description="Verify email">
        Step 2 content: Verify email
      </Stepper.Step>
      <Stepper.Step label="Final step" description="Get full access">
        Step 3 content: Get full access
      </Stepper.Step>
      <Stepper.Completed>
        Completed, click back button to get to previous step
      </Stepper.Completed>
    </Stepper>

    <Group justify="center" mt="xl">
      <Button variant="default" @click="prevStep">Back</Button>
      <Button @click="nextStep">Next step</Button>
    </Group>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'StepperAllowNextStepsSelectDemo',
  setup() {
    const active = ref(1)
    const nextStep = () => {
      if (active.value < 3) active.value++
    }
    const prevStep = () => {
      if (active.value > 0) active.value--
    }

    return () =>
      h('div', {}, [
        h(
          Stepper,
          {
            active: active.value,
            onStepClick: (s: number) => {
              active.value = s
            },
            allowNextStepsSelect: false,
          },
          {
            default: () => [
              h(
                Stepper.Step,
                { label: 'First step', description: 'Create an account' },
                {
                  default: () =>
                    h(Content, {}, { default: () => 'Step 1 content: Create an account' }),
                },
              ),
              h(
                Stepper.Step,
                { label: 'Second step', description: 'Verify email' },
                {
                  default: () => h(Content, {}, { default: () => 'Step 2 content: Verify email' }),
                },
              ),
              h(
                Stepper.Step,
                { label: 'Final step', description: 'Get full access' },
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
              h(Button, { variant: 'default', onClick: prevStep }, { default: () => 'Back' }),
              h(Button, { onClick: nextStep }, { default: () => 'Next step' }),
            ],
          },
        ),
      ])
  },
})

export const allowNextStepsSelect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
