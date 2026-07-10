import { defineComponent, h, ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { useMutationObserver } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { useMutationObserver } from '@mantine-vue/hooks'

const lastMutation = ref('')

const buttonRef = useMutationObserver<HTMLButtonElement>(
  (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-mutation') {
        if (mutation.target instanceof HTMLElement) {
          lastMutation.value = mutation.target.dataset.mutation || ''
        }
      }
    })
  },
  { attributes: true, attributeFilter: ['data-mutation'] },
)

const handleClick = (event: MouseEvent) => {
  ;(event.currentTarget as HTMLElement).dataset.mutation = Math.random().toFixed(3)
}
</script>

<template>
  <!-- Bind the hook's ref to a plain native element, not a Mantine
       Vue component -- components don't forward refs to their root DOM node. -->
  <button ref="buttonRef" type="button" @click="handleClick">
    Click to change to data-mutation attribute
  </button>
  <Text :mt="10" size="sm">
    Last detected mutation: {{ lastMutation || 'Not mutated yet' }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMutationObserverUsageDemo',
  setup() {
    const lastMutation = ref('')

    const buttonRef = useMutationObserver<HTMLButtonElement>(
      (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-mutation') {
            if (mutation.target instanceof HTMLElement) {
              lastMutation.value = mutation.target.dataset.mutation || ''
            }
          }
        })
      },
      { attributes: true, attributeFilter: ['data-mutation'] },
    )

    const handleClick = (event: MouseEvent) => {
      ;(event.currentTarget as HTMLElement).dataset.mutation = Math.random().toFixed(3)
    }

    return () => [
      h(
        'button',
        { ref: buttonRef, type: 'button', onClick: handleClick },
        'Click to change to data-mutation attribute',
      ),
      h(
        Text,
        { mt: 10, size: 'sm' },
        () => `Last detected mutation: ${lastMutation.value || 'Not mutated yet'}`,
      ),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
