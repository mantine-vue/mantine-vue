import { defineComponent, h, ref } from 'vue'
import { Text, Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text, Textarea } from '@mantine-vue/core'

const maxLength = 500
const value = ref('')
</script>

<template>
  <Textarea
    label="Your message"
    placeholder="Type your message..."
    autosize
    :min-rows="4"
    :value="value"
    @change="(event) => (value = event.currentTarget.value.slice(0, maxLength))"
    :bottom-section="h(Text, { size: 'xs', c: 'dimmed' }, () => \`\${value.length}/\${maxLength} characters\`)"
  />
</template>
`

const Demo = defineComponent({
  name: 'TextareaBottomSectionDemo',
  setup() {
    const maxLength = 500
    const value = ref('')
    return () =>
      h(Textarea, {
        label: 'Your message',
        placeholder: 'Type your message...',
        autosize: true,
        minRows: 4,
        value: value.value,
        onChange: (event: Event) => {
          value.value = (event.currentTarget as HTMLTextAreaElement).value.slice(0, maxLength)
        },
        bottomSection: h(
          Text,
          { size: 'xs', c: 'dimmed' },
          {
            default: () => `${value.value.length}/${maxLength} characters`,
          },
        ),
      })
  },
})

export const bottomSection: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  maxWidth: 340,
  centered: true,
}
