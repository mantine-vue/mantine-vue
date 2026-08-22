import { defineComponent, h, ref } from 'vue'
import { Button, Group, Paper, Stack, Text } from '@mantine-vue/core'
import { WhatsAppComposer, WhatsAppMessagingWindowNotice } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppMessagingWindow } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { closedWindowCapabilities, demoTemplates, openWindowCapabilities } from './_data'

const closedWindowCode = `
<script setup lang="ts">
import { WhatsAppComposer } from '@mantine-vue/whatsapp-inbox'

// The backend is authoritative. The frontend never computes whether WhatsApp's
// 24 hour window is open – it renders the state the backend reports.
const capabilities = {
  canSendFreeForm: true,
  canSendTemplates: true,
  messagingWindow: {
    state: 'closed',
    reasonCode: 'customer_service_window_expired',
    reason: 'Amina last replied more than 24 hours ago, so only templates can be sent.',
  },
}
</script>

<template>
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="capabilities"
    :templates="templates"
  />
</template>
`

const ClosedWindow = defineComponent({
  name: 'WhatsAppClosedWindowDemo',
  setup() {
    const state = ref<'open' | 'closed' | 'unknown'>('closed')
    const options = ['open', 'closed', 'unknown'] as const

    const capabilities = () => {
      if (state.value === 'closed') {
        return closedWindowCapabilities
      }

      if (state.value === 'unknown') {
        return { canSendTemplates: true, messagingWindow: { state: 'unknown' as const } }
      }

      return openWindowCapabilities
    }

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          options.map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                variant: state.value === value ? 'filled' : 'default',
                onClick: () => {
                  state.value = value
                },
              },
              () => `messagingWindow.state: ${value}`,
            ),
          ),
        ),
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            conversationId: 'conversation-1',
            capabilities: capabilities(),
            templates: demoTemplates,
          }),
        ),
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          () =>
            'unknown leaves the composer usable: the extension never blocks the user on information the backend did not send.',
        ),
      ])
  },
})

export const closedWindow: MantineDemo = {
  type: 'code',
  component: ClosedWindow,
  code: closedWindowCode,
  maxWidth: '100%',
}

const noticeCode = `
<script setup lang="ts">
import { WhatsAppMessagingWindowNotice } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!--
    The notice renders nothing unless \`state\` is \`closed\`, so it can be mounted
    unconditionally. \`reason\` comes from the backend, which is the only side that
    can explain the policy accurately.
  -->
  <WhatsAppMessagingWindowNotice
    :messaging-window="{ state: 'closed', reason: 'The contact last replied 3 days ago.' }"
    @template-action="openTemplates"
  />
</template>
`

const Notice = defineComponent({
  name: 'WhatsAppMessagingWindowNoticeDemo',
  setup() {
    const windows: WhatsAppMessagingWindow[] = [
      { state: 'closed' },
      { state: 'closed', reason: 'The contact last replied 3 days ago.' },
      { state: 'closed', reasonCode: 'no_opt_in', reason: 'This contact has not opted in yet.' },
    ]

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        ...windows.map((messagingWindow, index) =>
          h(WhatsAppMessagingWindowNotice, {
            key: index,
            messagingWindow,
            templatesAvailable: index !== 2,
          }),
        ),
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          () => 'The last one hides the template action because templates are not available.',
        ),
      ])
  },
})

export const notice: MantineDemo = {
  type: 'code',
  component: Notice,
  code: noticeCode,
  maxWidth: '100%',
}
