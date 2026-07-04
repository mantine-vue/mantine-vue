import { defineComponent, h, ref } from 'vue'
import { PhUserCheck, PhEnvelopeOpen, PhShieldCheck } from '@phosphor-icons/vue'
import { Stepper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stepper } from '@mantine-vue/core'
import { PhUserCheck, PhEnvelopeOpen, PhShieldCheck } from '@phosphor-icons/vue'

const active = ref(0)
</script>

<template>
  <Stepper :active="active" @step-click="active = $event">
    <Stepper.Step :icon="() => h(PhUserCheck, { size: 18 })" />
    <Stepper.Step :icon="() => h(PhEnvelopeOpen, { size: 18 })" />
    <Stepper.Step :icon="() => h(PhShieldCheck, { size: 18 })" />
  </Stepper>
</template>
`

const Demo = defineComponent({
  name: 'StepperIconsOnlyDemo',
  setup() {
    const active = ref(0)

    return () =>
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
            h(Stepper.Step, { icon: () => h(PhUserCheck, { size: 18 }) }),
            h(Stepper.Step, { icon: () => h(PhEnvelopeOpen, { size: 18 }) }),
            h(Stepper.Step, { icon: () => h(PhShieldCheck, { size: 18 }) }),
          ],
        },
      )
  },
})

export const iconsOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
