import { defineComponent, h, ref } from 'vue'
import { Code, Stack, TextInput } from '@mantine-vue/core'
import { useSet } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Code, Stack, TextInput } from '@mantine-vue/core'
import { useSet } from '@mantine-vue/hooks'

const input = ref('')
const scopes = useSet<string>(['@mantine', '@mantine-tests', '@mantinex'])

const isDuplicate = computed(() => scopes.has(input.value.trim().toLowerCase()))

const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === 'Enter' && !isDuplicate.value) {
    scopes.add(input.value.trim().toLowerCase())
    input.value = ''
  }
}
</script>

<template>
  <TextInput
    label="Add new scope"
    placeholder="Enter scope"
    description="Duplicate scopes are not allowed"
    :model-value="input"
    :error="isDuplicate && 'Scope already exists'"
    @input="(event) => (input = (event.target as HTMLInputElement).value)"
    @keydown="handleKeydown"
  />

  <Stack :gap="5" align="flex-start" mt="md">
    <Code v-for="scope in scopes" :key="scope">{{ scope }}</Code>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'UseSetUsageDemo',
  setup() {
    const input = ref('')
    const scopes = useSet<string>(['@mantine', '@mantine-tests', '@mantinex'])

    const isDuplicate = () => scopes.has(input.value.trim().toLowerCase())

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === 'Enter' && !isDuplicate()) {
        scopes.add(input.value.trim().toLowerCase())
        input.value = ''
      }
    }

    return () => [
      h(TextInput, {
        label: 'Add new scope',
        placeholder: 'Enter scope',
        description: 'Duplicate scopes are not allowed',
        value: input.value,
        error: isDuplicate() ? 'Scope already exists' : undefined,
        onInput: (event: Event) => (input.value = (event.target as HTMLInputElement).value),
        onKeydown: handleKeydown,
      }),
      h(Stack, { gap: 5, align: 'flex-start', mt: 'md' }, () =>
        Array.from(scopes).map((scope) => h(Code, { key: scope }, () => scope)),
      ),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
