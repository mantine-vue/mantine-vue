import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover, Stack, Text } from '@mantine-vue/core'

const value = ref<string | null>(null)
const submitted = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()
  const formData = new FormData(event.target as HTMLFormElement)
  submitted.value = formData.get('framework') as string
}
</script>

<template>
  <form @submit="handleSubmit">
    <Stack>
      <ComboboxPopover
        :data="['React', 'Angular', 'Vue', 'Svelte']"
        :value="value"
        name="framework"
        @change="value = $event"
      >
        <ComboboxPopover.Target>
          <Button variant="default" :miw="200" type="button">
            {{ value || 'Select framework' }}
          </Button>
        </ComboboxPopover.Target>
      </ComboboxPopover>

      <Button type="submit">Submit</Button>
      <Text v-if="submitted" size="sm">Submitted value: <b>{{ submitted }}</b></Text>
    </Stack>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverFormSubmissionDemo',
  setup() {
    const value = ref<string | null>(null)
    const submitted = ref('')

    const handleSubmit = (event: Event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      submitted.value = formData.get('framework') as string
    }

    return () =>
      h('form', { onSubmit: handleSubmit }, [
        h(Stack, null, () => [
          h(
            ComboboxPopover,
            {
              data: ['React', 'Angular', 'Vue', 'Svelte'],
              value: value.value,
              name: 'framework',
              onChange: (val: string | null) => {
                value.value = val
              },
            },
            () =>
              h(ComboboxPopover.Target, null, () =>
                h(
                  Button,
                  { variant: 'default', miw: 200, type: 'button' },
                  () => value.value || 'Select framework',
                ),
              ),
          ),
          h(Button, { type: 'submit' }, () => 'Submit'),
          submitted.value
            ? h(Text, { size: 'sm' }, () => ['Submitted value: ', h('b', null, submitted.value)])
            : null,
        ]),
      ])
  },
})

export const formSubmission: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
