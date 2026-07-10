import { defineComponent, h, ref } from 'vue'
import { Button, Group, Stack, Text } from '@mantine-vue/core'
import { useDebouncedCallback } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Stack, Text } from '@mantine-vue/core'
import { useDebouncedCallback } from '@mantine-vue/hooks'

const outerValue = ref('')
const visible = ref(true)
</script>

<template>
  <Stack>
    <Text :fw="700">Output value: {{ outerValue || '(none)' }}</Text>

    <Group>
      <Button @click="visible = !visible">
        {{ visible ? 'Hide component' : 'Show component' }}
      </Button>
    </Group>

    <InputWithDebounce v-if="visible" @change="(value) => (outerValue = value)" />

    <Text size="sm" c="dimmed">
      1. Type text and wait 2 seconds for the value to be transmitted.
      2. Type text and immediately click the 'Hide component' button.
         The value will be transmitted immediately due to the flushOnUnmount option.
    </Text>
  </Stack>
</template>
`

const InputWithDebounce = defineComponent({
  name: 'InputWithDebounce',
  props: {
    onChange: { type: Function as unknown as () => (value: string) => void, required: true },
  },
  setup(props) {
    const innerValue = ref('')
    const debouncedCallback = useDebouncedCallback(
      (newInnerValue: string) => {
        props.onChange(newInnerValue)
      },
      { delay: 2000, flushOnUnmount: true },
    )

    const handleChange = (newInnerValue: string) => {
      innerValue.value = newInnerValue
      debouncedCallback(newInnerValue)
    }

    return () =>
      h('input', {
        'aria-label': 'Enter text',
        placeholder: 'Enter text...',
        value: innerValue.value,
        onInput: (event: Event) => handleChange((event.target as HTMLInputElement).value),
        style: { padding: '8px', width: '100%' },
      })
  },
})

const Demo = defineComponent({
  name: 'UseDebouncedCallbackUnmountDemo',
  setup() {
    const outerValue = ref('')
    const visible = ref(true)

    return () =>
      h(
        Stack,
        {},
        {
          default: () => [
            h(
              Text,
              { fw: 700 },
              { default: () => `Output value: ${outerValue.value || '(none)'}` },
            ),
            h(
              Group,
              {},
              {
                default: () =>
                  h(
                    Button,
                    { onClick: () => (visible.value = !visible.value) },
                    {
                      default: () => (visible.value ? 'Hide component' : 'Show component'),
                    },
                  ),
              },
            ),
            visible.value
              ? h(InputWithDebounce, { onChange: (value: string) => (outerValue.value = value) })
              : null,
            h(
              Text,
              { size: 'sm', c: 'dimmed' },
              {
                default: () =>
                  "1. Type text and wait 2 seconds for the value to be transmitted. 2. Type text and immediately click the 'Hide component' button. The value will be transmitted immediately due to the flushOnUnmount option.",
              },
            ),
          ],
        },
      )
  },
})

export const unmount: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
