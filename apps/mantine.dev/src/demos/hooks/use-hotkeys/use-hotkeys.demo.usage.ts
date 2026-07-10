import { defineComponent, h, ref } from 'vue'
import { TextInput } from '@mantine-vue/core'
import { getHotkeyHandler } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from '@mantine-vue/core'
import { getHotkeyHandler } from '@mantine-vue/hooks'

const value = ref("I've just used a hotkey to send a message")
const log = ref('')

const handleSubmit = () => (log.value = \`Message sent: "\${value.value}"\`)
const handleSave = () => (log.value = \`Message saved: "\${value.value}"\`)

const handleKeydown = getHotkeyHandler([
  ['mod+Enter', handleSubmit],
  ['mod+S', handleSave],
])
</script>

<template>
  <TextInput
    placeholder="Your message"
    label="Press ⌘+Enter or Ctrl+Enter when input has focus to send message"
    :value="value"
    @input="value = ($event.target as HTMLInputElement).value"
    @keydown="handleKeydown"
  />
  <p v-if="log">{{ log }}</p>
</template>
`

const Demo = defineComponent({
  name: 'UseHotkeysUsageDemo',
  setup() {
    const value = ref("I've just used a hotkey to send a message")
    const log = ref('')

    const handleSubmit = () => (log.value = `Message sent: "${value.value}"`)
    const handleSave = () => (log.value = `Message saved: "${value.value}"`)

    const handleKeydown = getHotkeyHandler([
      ['mod+Enter', handleSubmit],
      ['mod+S', handleSave],
    ])

    return () =>
      h('div', [
        h(TextInput, {
          placeholder: 'Your message',
          label: 'Press ⌘+Enter or Ctrl+Enter when input has focus to send message',
          value: value.value,
          onInput: (event: Event) => (value.value = (event.target as HTMLInputElement).value),
          onKeydown: handleKeydown,
        }),
        log.value ? h('p', log.value) : null,
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
