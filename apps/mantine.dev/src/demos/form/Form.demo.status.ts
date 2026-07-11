import { computed, defineComponent, h } from 'vue'
import { Button, Checkbox, Code, Group, Stack, Text, TextInput } from '@mantine-vue/core'
import { useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed } from 'vue'
import { Button, Checkbox, Code, Group, Text, TextInput } from '@mantine-vue/core'
import { useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: {
    name: '',
    terms: false,
  },
})

const status = computed(() => ({
  dirty: form.isDirty(),
  nameDirty: form.isDirty('name'),
  termsTouched: form.isTouched('terms'),
}))
</script>

<template>
  <TextInput label="Name" v-bind="form.getInputProps('name')" />
  <Checkbox
    mt="md"
    label="I accept terms"
    v-bind="form.getInputProps('terms', { type: 'checkbox' })"
  />

  <Text size="sm" mt="md">Status: <Code>{{ JSON.stringify(status) }}</Code></Text>

  <Group mt="md">
    <Button variant="default" @click="form.reset">Reset</Button>
    <Button variant="default" @click="form.setDirty({ name: true })">Mark name dirty</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'FormStatusDemo',
  setup() {
    const form = useForm({
      initialValues: {
        name: '',
        terms: false,
      },
    })

    const status = computed(() => ({
      dirty: form.isDirty(),
      nameDirty: form.isDirty('name'),
      termsTouched: form.isTouched('terms'),
    }))

    return () =>
      h(Stack, { gap: 'md' }, () => [
        h(TextInput, { label: 'Name', ...form.getInputProps('name') }),
        h(Checkbox, {
          label: 'I accept terms',
          ...form.getInputProps('terms', { type: 'checkbox' }),
        }),
        h(Text, { size: 'sm' }, () => ['Status: ', h(Code, () => JSON.stringify(status.value))]),
        h(Group, () => [
          h(Button, { variant: 'default', onClick: form.reset }, () => 'Reset'),
          h(
            Button,
            { variant: 'default', onClick: () => form.setDirty({ name: true }) },
            () => 'Mark name dirty',
          ),
        ]),
      ])
  },
})

export const status: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 520,
}
