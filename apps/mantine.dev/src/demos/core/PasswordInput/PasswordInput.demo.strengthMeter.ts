import { computed, defineComponent, h, ref } from 'vue'
import { PhCheck, PhX } from '@phosphor-icons/vue'
import {
  Box,
  PasswordInput,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Progress,
  Text,
} from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhX, PhCheck } from '@phosphor-icons/vue'
import { PasswordInput, Progress, Text, Popover, PopoverTarget, PopoverDropdown, Box } from '@mantine-vue/core'

interface Requirement {
  re: RegExp
  label: string
}

const requirements: Requirement[] = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
]

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1
  requirements.forEach((req) => { if (!req.re.test(password)) multiplier += 1 })
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10)
}

const popoverOpened = ref(false)
const value = ref('')
const strength = computed(() => getStrength(value.value))
const color = computed(() => strength.value === 100 ? 'teal' : strength.value > 50 ? 'yellow' : 'red')
</script>

<template>
  <Popover :opened="popoverOpened" position="bottom" width="target" :transitionProps="{ transition: 'pop' }">
    <PopoverTarget>
      <div
        @focusin="popoverOpened = true"
        @focusout="popoverOpened = false"
      >
        <PasswordInput
          withAsterisk
          label="Your password"
          placeholder="Your password"
          :value="value"
          @change="(e) => (value = e.target.value)"
        />
      </div>
    </PopoverTarget>
    <PopoverDropdown>
      <Progress :color="color" :value="strength" :size="5" mb="xs" />
      <Text
        :c="value.length > 5 ? 'teal' : 'red'"
        :style="{ display: 'flex', alignItems: 'center' }"
        :mt="7"
        size="sm"
      >
        <PhCheck v-if="value.length > 5" :size="14" />
        <PhX v-else :size="14" />
        <Box ml="10">Includes at least 6 characters</Box>
      </Text>
      <Text
        v-for="req in requirements"
        :key="req.label"
        :c="req.re.test(value) ? 'teal' : 'red'"
        :style="{ display: 'flex', alignItems: 'center' }"
        :mt="7"
        size="sm"
      >
        <PhCheck v-if="req.re.test(value)" :size="14" />
        <PhX v-else :size="14" />
        <Box ml="10">{{ req.label }}</Box>
      </Text>
    </PopoverDropdown>
  </Popover>
</template>
`

interface Requirement {
  re: RegExp
  label: string
}

const requirements: Requirement[] = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
]

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1
  requirements.forEach((req) => {
    if (!req.re.test(password)) multiplier += 1
  })
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10)
}

function PasswordRequirement(meets: boolean, label: string) {
  return h(
    Text,
    {
      c: meets ? 'teal' : 'red',
      style: { display: 'flex', alignItems: 'center' },
      mt: 7,
      size: 'sm',
    },
    {
      default: () => [
        meets ? h(PhCheck, { size: 14 }) : h(PhX, { size: 14 }),
        h(Box, { ml: 10 }, { default: () => label }),
      ],
    },
  )
}

const Demo = defineComponent({
  name: 'PasswordInputStrengthMeterDemo',
  setup() {
    const popoverOpened = ref(false)
    const value = ref('')
    const strength = computed(() => getStrength(value.value))
    const color = computed(() =>
      strength.value === 100 ? 'teal' : strength.value > 50 ? 'yellow' : 'red',
    )

    return () =>
      h(
        Popover,
        {
          opened: popoverOpened.value,
          position: 'bottom',
          width: 'target',
          transitionProps: { transition: 'pop' },
        },
        {
          default: () => [
            h(PopoverTarget, null, {
              default: () =>
                h(
                  'div',
                  {
                    onFocusin: () => {
                      popoverOpened.value = true
                    },
                    onFocusout: () => {
                      popoverOpened.value = false
                    },
                  },
                  [
                    h(PasswordInput, {
                      withAsterisk: true,
                      label: 'Your password',
                      placeholder: 'Your password',
                      value: value.value,
                      onChange: (event: Event) => {
                        value.value = (event.currentTarget as HTMLInputElement).value
                      },
                    }),
                  ],
                ),
            }),
            h(PopoverDropdown, null, {
              default: () => [
                h(Progress, { color: color.value, value: strength.value, size: 5, mb: 'xs' }),
                PasswordRequirement(value.value.length > 5, 'Includes at least 6 characters'),
                ...requirements.map((req) =>
                  PasswordRequirement(req.re.test(value.value), req.label),
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const strengthMeter: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
