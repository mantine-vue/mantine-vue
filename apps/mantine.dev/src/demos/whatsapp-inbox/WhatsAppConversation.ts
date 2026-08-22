import { defineComponent, h, ref } from 'vue'
import { Badge, Button, Group, Paper, Stack, Text } from '@mantine-vue/core'
import {
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppMessageList,
  WhatsAppMessageStatus,
} from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppDeliveryStatus, WhatsAppMessageData } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import {
  allMessageTypes,
  demoConversation,
  demoTemplates,
  minutesAgo,
  openWindowCapabilities,
} from './_data'
import { CONVERSATION_DEMO_HEIGHT, useInboxDemoState } from './_shared'

const usageCode = `
<script setup lang="ts">
import { WhatsAppConversation } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <WhatsAppConversation
    :conversation="conversation"
    :messages="messages"
    :capabilities="capabilities"
    :templates="templates"
    style="height: 460px"
    @send="handleSend"
    @load-older-messages="loadOlder"
    @retry-message="resend"
  />
</template>
`

const Usage = defineComponent({
  name: 'WhatsAppConversationUsageDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })

    return () =>
      h(WhatsAppConversation, {
        conversation: demoConversation('amina', openWindowCapabilities),
        messages: state.messages.value,
        templates: demoTemplates,
        draft: state.draft.value,
        'onUpdate:draft': (value: string) => {
          state.draft.value = value
        },
        uploads: state.uploads.value,
        sending: state.sending.value,
        style: { height: `${CONVERSATION_DEMO_HEIGHT}px` },
        onSend: state.handleSend,
        onRetryMessage: state.handleRetryMessage,
        onAttachmentsAdd: state.handleAttachmentsAdd,
        onAttachmentRemove: state.handleAttachmentRemove,
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: usageCode,
  maxWidth: '100%',
  withPadding: false,
}

const messageTypesCode = `
<script setup lang="ts">
import { WhatsAppMessageList } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppMessageData } from '@mantine-vue/whatsapp-inbox'

// WhatsAppMessageData is a discriminated union on \`type\`: narrowing a message gives
// access to exactly the payload that type carries.
const messages: WhatsAppMessageData[] = [
  { id: '1', type: 'text', direction: 'inbound', timestamp: iso, text: 'A plain text message' },
  {
    id: '2',
    type: 'image',
    direction: 'outbound',
    status: 'read',
    timestamp: iso,
    caption: 'An image with a caption',
    attachment: { mediaType: 'image', url: '/photo.png', width: 480, height: 270 },
  },
  {
    id: '3',
    type: 'location',
    direction: 'inbound',
    timestamp: iso,
    location: { latitude: 26.2285, longitude: 50.586, name: 'Manama Branch' },
  },
  // …template, interactive, contacts, audio, document, system, unsupported
]
</script>

<template>
  <WhatsAppMessageList :messages="messages" style="height: 520px" />
</template>
`

const MessageTypes = defineComponent({
  name: 'WhatsAppMessageTypesDemo',
  setup: () => () =>
    h(WhatsAppMessageList, {
      messages: allMessageTypes,
      conversationId: 'types',
      style: { height: '560px' },
    }),
})

export const messageTypes: MantineDemo = {
  type: 'code',
  component: MessageTypes,
  code: messageTypesCode,
  maxWidth: '100%',
  withPadding: false,
}

const deliveryStatesCode = `
<script setup lang="ts">
import { WhatsAppMessageStatus } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!-- Each state has its own glyph plus screen-reader text, never colour alone -->
  <WhatsAppMessageStatus status="pending" with-label />
  <WhatsAppMessageStatus status="sent" with-label />
  <WhatsAppMessageStatus status="delivered" with-label />
  <WhatsAppMessageStatus status="read" with-label />
  <WhatsAppMessageStatus status="failed" with-label />
</template>
`

const STATUSES: WhatsAppDeliveryStatus[] = ['pending', 'sent', 'delivered', 'read', 'failed']

const DeliveryStates = defineComponent({
  name: 'WhatsAppDeliveryStatesDemo',
  setup: () => () =>
    h(Stack, { gap: 'md' }, () => [
      h(Group, { gap: 'lg' }, () =>
        STATUSES.map((status) =>
          h(WhatsAppMessageStatus, { key: status, status, withLabel: true, size: '1.2rem' }),
        ),
      ),
      h(Paper, { withBorder: true, p: 'sm', radius: 'md' }, () =>
        h(Stack, { gap: 4 }, () =>
          STATUSES.map((status) =>
            h(WhatsAppMessage, {
              key: status,
              message: {
                id: status,
                type: 'text',
                direction: 'outbound',
                status,
                timestamp: minutesAgo(5),
                text: `An outbound message that is ${status}`,
                error:
                  status === 'failed'
                    ? { code: '131047', message: 'Re-engagement message' }
                    : undefined,
              } satisfies WhatsAppMessageData,
            }),
          ),
        ),
      ),
    ]),
})

export const deliveryStates: MantineDemo = {
  type: 'code',
  component: DeliveryStates,
  code: deliveryStatesCode,
  maxWidth: '100%',
}

const customRenderingCode = `
<script setup lang="ts">
import { h } from 'vue'
import { WhatsAppConversation } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppMessageData } from '@mantine-vue/whatsapp-inbox'

// Returning undefined falls back to the built-in renderer, so you can override
// one custom type and leave the rest of the history alone.
function renderMessage(message: WhatsAppMessageData) {
  return message.meta?.kind === 'order' ? h(OrderCard, { message }) : undefined
}
</script>

<template>
  <WhatsAppConversation :messages="messages" :render-message="renderMessage">
    <!-- Slots take precedence over the render props -->
    <template #messageFooter="{ message }">
      <Text size="10px" c="dimmed">{{ message.id }}</Text>
    </template>
  </WhatsAppConversation>
</template>
`

const customMessages: WhatsAppMessageData[] = [
  {
    id: 'custom-1',
    type: 'text',
    direction: 'inbound',
    timestamp: minutesAgo(12),
    text: 'This one uses the built-in renderer.',
  },
  {
    id: 'custom-2',
    type: 'text',
    direction: 'outbound',
    status: 'read',
    timestamp: minutesAgo(10),
    text: 'Order 4821 · BHD 128.00',
    meta: { kind: 'order' },
  },
]

const CustomRendering = defineComponent({
  name: 'WhatsAppCustomRenderingDemo',
  setup() {
    const renderMessage = (message: WhatsAppMessageData) =>
      message.meta?.kind === 'order'
        ? h(
            Paper,
            {
              withBorder: true,
              radius: 'md',
              p: 'sm',
              style: { alignSelf: 'flex-end', maxWidth: '75%' },
            },
            () => [
              h(Badge, { size: 'xs', variant: 'light', mb: 4 }, () => 'Order'),
              h(Text, { size: 'sm', fw: 600 }, () => (message as { text: string }).text),
            ],
          )
        : undefined

    return () =>
      h(
        WhatsAppMessageList,
        {
          messages: customMessages,
          conversationId: 'custom',
          renderMessage,
          style: { height: '320px' },
        },
        {
          messageFooter: ({ message }: { message: WhatsAppMessageData }) =>
            h(Text, { size: '10px', c: 'dimmed' }, () => `id: ${message.id}`),
        },
      )
  },
})

export const customRendering: MantineDemo = {
  type: 'code',
  component: CustomRendering,
  code: customRenderingCode,
  maxWidth: '100%',
  withPadding: false,
}

const statesCode = `
<template>
  <!-- Every async state of the history is a prop -->
  <WhatsAppMessageList :messages="[]" loading />
  <WhatsAppMessageList :messages="[]" error="Messages could not be loaded" @retry-load="refetch" />
  <WhatsAppMessageList :messages="[]" />
  <WhatsAppMessageList
    :messages="messages"
    :pagination="{ hasMore: true, cursor: 'before-1' }"
    @load-older="loadOlder"
  />
</template>
`

const States = defineComponent({
  name: 'WhatsAppMessageListStatesDemo',
  setup() {
    const variant = ref<'loading' | 'error' | 'empty' | 'loadOlder'>('loading')
    const options = ['loading', 'error', 'empty', 'loadOlder'] as const

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          options.map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                variant: variant.value === value ? 'filled' : 'default',
                onClick: () => {
                  variant.value = value
                },
              },
              () => value,
            ),
          ),
        ),
        h(WhatsAppMessageList, {
          messages: variant.value === 'loadOlder' ? allMessageTypes.slice(0, 3) : [],
          conversationId: 'states',
          loading: variant.value === 'loading',
          error: variant.value === 'error' ? 'Messages could not be loaded' : null,
          pagination:
            variant.value === 'loadOlder' ? { hasMore: true, cursor: 'before-1' } : undefined,
          style: { height: '320px' },
        }),
      ])
  },
})

export const states: MantineDemo = {
  type: 'code',
  component: States,
  code: statesCode,
  maxWidth: '100%',
  withPadding: false,
}
