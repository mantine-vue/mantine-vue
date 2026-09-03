import { defineComponent, h, ref } from 'vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const Demo = defineComponent({
  name: 'StepperLabelPositionDemo',
  setup() {
    const active = ref(1)
    return () =>
      h(
        Stepper,
        {
          active: active.value,
          labelPosition: 'bottom',
          onStepClick: (value: number) => (active.value = value),
        },
        () => [
          h(Stepper.Step, { label: 'Account' }),
          h(Stepper.Step, { label: 'Verification' }),
          h(Stepper.Step, { label: 'Access' }),
        ],
      )
  },
})

export const labelPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 500,
  centered: true,
  code: `<script setup lang="ts">
import { ref } from 'vue'
import { Stepper } from '@mantine-vue/core'
const active = ref(1)
</script>
<template>
  <Stepper :active="active" label-position="bottom" @step-click="active = $event">
    <Stepper.Step label="Account" />
    <Stepper.Step label="Verification" />
    <Stepper.Step label="Access" />
  </Stepper>
</template>`,
}
