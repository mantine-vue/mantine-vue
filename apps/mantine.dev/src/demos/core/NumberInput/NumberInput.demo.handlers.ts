import { defineComponent, h, ref } from 'vue'
import { Button, Group, NumberInput } from '@mantine-vue/core'
import type { NumberInputHandlers } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput, Group, Button } from '@mantine-vue/core'
import type { NumberInputHandlers } from '@mantine-vue/core'

const handlersRef = ref<NumberInputHandlers | null>(null)
</script>

<template>
  <NumberInput
    label="Click buttons to change value"
    placeholder="Click the buttons"
    :handlersRef="handlersRef"
    :step="2"
    :min="10"
    :max="20"
    :defaultValue="15"
  />

  <Group mt="md" justify="center">
    <Button @click="handlersRef?.decrement()" variant="default">
      Decrement by 2
    </Button>
    <Button @click="handlersRef?.increment()" variant="default">
      Increment by 2
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'NumberInputHandlersDemo',
  setup() {
    const handlersRef = ref<NumberInputHandlers | null>(null)
    return () =>
      h('div', null, [
        h(NumberInput, {
          label: 'Click buttons to change value',
          placeholder: 'Click the buttons',
          handlersRef,
          step: 2,
          min: 10,
          max: 20,
          defaultValue: 15,
        }),
        h(
          Group,
          { mt: 'md', justify: 'center' },
          {
            default: () => [
              h(
                Button,
                {
                  onClick: () => handlersRef.value?.decrement(),
                  variant: 'default',
                },
                { default: () => 'Decrement by 2' },
              ),
              h(
                Button,
                {
                  onClick: () => handlersRef.value?.increment(),
                  variant: 'default',
                },
                { default: () => 'Increment by 2' },
              ),
            ],
          },
        ),
      ])
  },
})

export const handlers: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
