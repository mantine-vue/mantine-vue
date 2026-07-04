import { defineComponent, h } from 'vue'
import { Button, Fieldset, Group, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Fieldset, Group, TextInput } from '@mantine-vue/core'
</script>

<template>
  <Fieldset legend="Personal information" disabled>
    <TextInput label="Your name" placeholder="Your name" />
    <TextInput label="Email" placeholder="Email" mt="md" />
    <Group justify="flex-end" mt="md">
      <Button>Submit</Button>
    </Group>
  </Fieldset>
</template>
`

const Demo = defineComponent({
  name: 'FieldsetDisabledDemo',
  setup: () => () =>
    h(
      Fieldset,
      { legend: 'Personal information', disabled: true },
      {
        default: () => [
          h(TextInput, { label: 'Your name', placeholder: 'Your name' }),
          h(TextInput, { label: 'Email', placeholder: 'Email', mt: 'md' }),
          h(
            Group,
            { justify: 'flex-end', mt: 'md' },
            {
              default: () => [h(Button, {}, { default: () => 'Submit' })],
            },
          ),
        ],
      },
    ),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 500,
  centered: true,
  code,
}
