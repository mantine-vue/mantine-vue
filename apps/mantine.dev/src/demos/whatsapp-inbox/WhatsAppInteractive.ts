import { defineComponent, h, ref } from 'vue'
import { Code, Paper, Stack, Text } from '@mantine-vue/core'
import { WhatsAppInteractiveMessageEditor, WhatsAppMessageList } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInteractiveContent, WhatsAppMessageData } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { minutesAgo } from './_data'

const editorCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppInteractiveMessageEditor } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInteractiveContent } from '@mantine-vue/whatsapp-inbox'

// The draft is always a well-formed WhatsAppInteractiveContent, so there is
// nothing to translate when it is submitted.
const draft = ref<WhatsAppInteractiveContent>()
</script>

<template>
  <WhatsAppInteractiveMessageEditor
    v-model="draft"
    :interactive-types="capabilities.interactiveTypes"
    @submit="handleSubmit"
  />
</template>
`

const Editor = defineComponent({
  name: 'WhatsAppInteractiveEditorDemo',
  setup() {
    const draft = ref<WhatsAppInteractiveContent | undefined>()
    const submitted = ref<WhatsAppInteractiveContent | null>(null)

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
          h(WhatsAppInteractiveMessageEditor, {
            modelValue: draft.value,
            'onUpdate:modelValue': (value: WhatsAppInteractiveContent) => {
              draft.value = value
            },
            interactiveTypes: ['button', 'cta_url', 'list'],
            onSubmit: (value: WhatsAppInteractiveContent) => {
              submitted.value = value
            },
          }),
        ),
        submitted.value && h(Code, { block: true }, () => JSON.stringify(submitted.value, null, 2)),
      ])
  },
})

export const editor: MantineDemo = {
  type: 'code',
  component: Editor,
  code: editorCode,
  maxWidth: 560,
}

const capabilityDrivenCode = `
<template>
  <!--
    Not every provider exposes every interactive type. Leave one out of
    \`interactiveTypes\` and the editor stops offering it; leave the list empty
    and the composer hides the action entirely.
  -->
  <WhatsAppInteractiveMessageEditor :interactive-types="['button']" />
</template>
`

const CapabilityDriven = defineComponent({
  name: 'WhatsAppInteractiveCapabilityDemo',
  setup: () => () =>
    h(Stack, { gap: 'sm' }, () => [
      h(
        Text,
        { size: 'xs', c: 'dimmed' },
        () => 'Only reply buttons are supported here, so the type selector is not rendered.',
      ),
      h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () =>
        h(WhatsAppInteractiveMessageEditor, { interactiveTypes: ['button'] }),
      ),
    ]),
})

export const capabilityDriven: MantineDemo = {
  type: 'code',
  component: CapabilityDriven,
  code: capabilityDrivenCode,
  maxWidth: 560,
}

const interactiveMessages: WhatsAppMessageData[] = [
  {
    id: 'interactive-button',
    type: 'interactive',
    direction: 'outbound',
    status: 'delivered',
    timestamp: minutesAgo(30),
    interactive: {
      type: 'button',
      header: { type: 'text', text: 'Order 4821' },
      body: 'Did this solve your issue?',
      footer: 'We would love your feedback',
      buttons: [
        { id: 'yes', title: 'Yes, thanks' },
        { id: 'no', title: 'Not yet' },
      ],
    },
  },
  {
    id: 'interactive-reply',
    type: 'interactive',
    direction: 'inbound',
    timestamp: minutesAgo(28),
    interactive: { type: 'button', body: 'Did this solve your issue?', buttons: [] },
    reply: { id: 'yes', title: 'Yes, thanks' },
  },
  {
    id: 'interactive-cta',
    type: 'interactive',
    direction: 'outbound',
    status: 'read',
    timestamp: minutesAgo(20),
    interactive: {
      type: 'cta_url',
      body: 'Your invoice is ready to download.',
      action: { displayText: 'Open invoice', url: 'https://example.com/invoice/4821' },
    },
  },
  {
    id: 'interactive-list',
    type: 'interactive',
    direction: 'outbound',
    status: 'sent',
    timestamp: minutesAgo(10),
    interactive: {
      type: 'list',
      body: 'Pick a delivery slot',
      button: 'View slots',
      sections: [
        {
          title: 'Tomorrow',
          rows: [
            { id: 'am', title: 'Morning', description: '09:00 – 12:00' },
            { id: 'pm', title: 'Afternoon', description: '13:00 – 17:00' },
          ],
        },
      ],
    },
  },
]

const displayCode = `
<template>
  <!-- Interactive messages are rendered in both directions, including the option picked -->
  <WhatsAppMessageList :messages="messages" />
</template>
`

const Display = defineComponent({
  name: 'WhatsAppInteractiveDisplayDemo',
  setup: () => () =>
    h(WhatsAppMessageList, {
      messages: interactiveMessages,
      conversationId: 'interactive',
      style: { height: '420px' },
    }),
})

export const display: MantineDemo = {
  type: 'code',
  component: Display,
  code: displayCode,
  maxWidth: '100%',
  withPadding: false,
}
