import { defineComponent, h, ref } from 'vue'
import { Kbd, Text } from '@mantine-vue/core'
import { useMutationObserverTarget } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Kbd, Text } from '@mantine-vue/core'
import { useMutationObserverTarget } from '@mantine-vue/hooks'

const lastMutation = ref('')

useMutationObserverTarget(
  (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
        if (mutation.target instanceof HTMLElement) {
          lastMutation.value = mutation.target.getAttribute('dir') || ''
        }
      }
    })
  },
  { attributes: true, attributeFilter: ['dir'] },
  () => document.documentElement,
)
</script>

<template>
  <Text>
    Press <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>L</Kbd> to change direction
  </Text>
  <Text :mt="10">Direction was changed to: {{ lastMutation || 'Not changed yet' }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMutationObserverTargetDemo',
  setup() {
    const lastMutation = ref('')

    useMutationObserverTarget(
      (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
            if (mutation.target instanceof HTMLElement) {
              lastMutation.value = mutation.target.getAttribute('dir') || ''
            }
          }
        })
      },
      { attributes: true, attributeFilter: ['dir'] },
      () => document.documentElement,
    )

    return () => [
      h(Text, null, () => [
        'Press ',
        h(Kbd, null, () => 'Ctrl'),
        ' + ',
        h(Kbd, null, () => 'Shift'),
        ' + ',
        h(Kbd, null, () => 'L'),
        ' to change direction',
      ]),
      h(
        Text,
        { mt: 10 },
        () => `Direction was changed to: ${lastMutation.value || 'Not changed yet'}`,
      ),
    ]
  },
})

export const target: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
