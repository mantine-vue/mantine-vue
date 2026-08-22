import { defineComponent, h, ref } from 'vue'
import { Badge, Button, Group, Paper, SimpleGrid, Stack, Text } from '@mantine-vue/core'
import {
  WhatsAppContactPanel,
  WhatsAppConversationHeader,
  WhatsAppInboxProvider,
  WhatsAppMessageBubble,
  WhatsAppMessageList,
} from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInboxLabelsOverride } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { allMessageTypes, demoConversation, demoConversations, minutesAgo } from './_data'

const contactPanelCode = `
<script setup lang="ts">
import { WhatsAppContactPanel } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!--
    Built-in rows (phone, email, about, status, assignee) are merged with the
    \`contact.fields\` your backend supplies, so CRM data needs no custom markup.
  -->
  <WhatsAppContactPanel :conversation="conversation" with-close-button @close="close" />
</template>
`

const ContactPanel = defineComponent({
  name: 'WhatsAppContactPanelDemo',
  setup: () => () =>
    h(
      'div',
      { style: { height: '480px', maxWidth: '320px' } },
      h(WhatsAppContactPanel, {
        conversation: demoConversations[0],
        withCloseButton: true,
      }),
    ),
})

export const contactPanel: MantineDemo = {
  type: 'code',
  component: ContactPanel,
  code: contactPanelCode,
  maxWidth: '100%',
  withPadding: false,
}

const headerCode = `
<template>
  <WhatsAppConversationHeader
    :conversation="conversation"
    with-back
    with-contact-toggle
    :contact-panel-opened="contactPanelOpened"
    @back="closeConversation"
    @toggle-contact-panel="contactPanelOpened = $event"
  >
    <template #headerActions="{ conversation }">
      <Badge size="sm" variant="light">{{ conversation?.status }}</Badge>
    </template>
  </WhatsAppConversationHeader>
</template>
`

const Header = defineComponent({
  name: 'WhatsAppConversationHeaderDemo',
  setup() {
    const contactPanelOpened = ref(false)

    return () =>
      h(Paper, { withBorder: true, radius: 'md', style: { overflow: 'hidden' } }, () =>
        h(
          WhatsAppConversationHeader,
          {
            conversation: demoConversations[0],
            withBack: true,
            withContactToggle: true,
            contactPanelOpened: contactPanelOpened.value,
            onToggleContactPanel: (value: boolean) => {
              contactPanelOpened.value = value
            },
          },
          {
            headerActions: ({ conversation }: any) =>
              h(Badge, { size: 'sm', variant: 'light' }, () => conversation?.status),
          },
        ),
      )
  },
})

export const header: MantineDemo = {
  type: 'code',
  component: Header,
  code: headerCode,
  maxWidth: 560,
}

const labelsCode = `
<script setup lang="ts">
import { WhatsAppInboxProvider } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!--
    Every user-visible string is a label, and every date goes through a replaceable
    formatter. One provider localizes the whole inbox.
  -->
  <WhatsAppInboxProvider
    locale="fr"
    :labels="{
      composerPlaceholder: 'Écrivez un message',
      send: 'Envoyer',
      today: \`Aujourd'hui\`,
      statusRead: 'Lu',
    }"
    :formatters="{ messageTime: (value) => myTimezone.format(value) }"
  >
    <WhatsAppInbox ... />
  </WhatsAppInboxProvider>
</template>
`

const frenchLabels: WhatsAppInboxLabelsOverride = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  statusRead: 'Lu',
  statusDelivered: 'Distribué',
  statusSent: 'Envoyé',
  messageStatusLabel: (status) => `Message ${status.toLowerCase()}`,
  inboundMessageLabel: 'Message reçu',
  outboundMessageLabel: 'Message envoyé',
  emptyConversation: 'Aucun message',
}

const Labels = defineComponent({
  name: 'WhatsAppLabelsDemo',
  setup() {
    const french = ref(true)

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () => [
          h(
            Button,
            {
              size: 'xs',
              variant: french.value ? 'filled' : 'default',
              onClick: () => {
                french.value = true
              },
            },
            () => 'locale="fr"',
          ),
          h(
            Button,
            {
              size: 'xs',
              variant: french.value ? 'default' : 'filled',
              onClick: () => {
                french.value = false
              },
            },
            () => 'default (en)',
          ),
        ]),
        h(
          WhatsAppInboxProvider,
          {
            locale: french.value ? 'fr' : 'en',
            labels: french.value ? frenchLabels : undefined,
          },
          () =>
            h(WhatsAppMessageList, {
              messages: allMessageTypes.slice(0, 4),
              conversationId: french.value ? 'fr' : 'en',
              style: { height: '320px' },
            }),
        ),
      ])
  },
})

export const labels: MantineDemo = {
  type: 'code',
  component: Labels,
  code: labelsCode,
  maxWidth: '100%',
  withPadding: false,
}

const stylingCode = `
<template>
  <!--
    Bubble colours, radius and width are CSS variables, so a theme override is a
    one-liner. Everything else goes through the standard Mantine Styles API.
  -->
  <WhatsAppMessageBubble
    direction="outbound"
    status="read"
    :timestamp="message.timestamp"
    radius="sm"
    max-width="60%"
    :styles="{ bubble: { '--wa-outbound-bg': 'var(--mantine-color-violet-light)' } }"
  >
    Restyled bubble
  </WhatsAppMessageBubble>
</template>
`

const Styling = defineComponent({
  name: 'WhatsAppStylingDemo',
  setup: () => () =>
    h(SimpleGrid, { cols: { base: 1, sm: 2 }, spacing: 'md' }, () => [
      h(Stack, { gap: 4 }, () => [
        h(Text, { size: 'xs', c: 'dimmed', fw: 600 }, () => 'DEFAULT'),
        h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () => [
          h(
            WhatsAppMessageBubble,
            { direction: 'inbound', timestamp: minutesAgo(6) },
            () => 'An inbound bubble',
          ),
          h(
            WhatsAppMessageBubble,
            { direction: 'outbound', status: 'read', timestamp: minutesAgo(5) },
            () => 'An outbound bubble',
          ),
        ]),
      ]),
      h(Stack, { gap: 4 }, () => [
        h(Text, { size: 'xs', c: 'dimmed', fw: 600 }, () => 'RESTYLED'),
        h(Paper, { withBorder: true, radius: 'md', p: 'sm' }, () => [
          h(
            WhatsAppMessageBubble,
            {
              direction: 'inbound',
              timestamp: minutesAgo(6),
              radius: 'sm',
              maxWidth: '85%',
              styles: {
                bubble: { '--wa-inbound-bg': 'var(--mantine-color-gray-light)' },
              } as any,
            },
            () => 'An inbound bubble',
          ),
          h(
            WhatsAppMessageBubble,
            {
              direction: 'outbound',
              status: 'read',
              timestamp: minutesAgo(5),
              radius: 'sm',
              maxWidth: '85%',
              styles: {
                bubble: { '--wa-outbound-bg': 'var(--mantine-color-violet-light)' },
              } as any,
            },
            () => 'An outbound bubble',
          ),
        ]),
      ]),
    ]),
})

export const styling: MantineDemo = {
  type: 'code',
  component: Styling,
  code: stylingCode,
  maxWidth: '100%',
}

const compositionCode = `
<template>
  <!--
    WhatsAppInbox is a convenience, not a requirement. Every primitive works on its
    own, and WhatsAppConversation publishes its capabilities to the components below
    it so a custom layout does not have to thread them through by hand.
  -->
  <div class="my-layout">
    <WhatsAppConversationHeader :conversation="conversation" />
    <MyOwnBanner />
    <WhatsAppMessageList :messages="messages" />
    <WhatsAppComposer :conversation-id="conversation.id" :capabilities="capabilities" />
  </div>
</template>
`

const Composition = defineComponent({
  name: 'WhatsAppCompositionDemo',
  setup: () => () =>
    h(
      'div',
      {
        style: {
          overflow: 'hidden',
          height: '420px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 'var(--mantine-radius-md)',
        },
      },
      [
        h(WhatsAppConversationHeader, { conversation: demoConversation('yusuf') }),
        h(
          Group,
          {
            justify: 'space-between',
            px: 'sm',
            py: 6,
            style: { background: 'var(--mantine-color-blue-light)' },
          },
          () => [
            h(Text, { size: 'xs' }, () => 'Wholesale customer · payment terms Net 30'),
            h(Badge, { size: 'xs', variant: 'filled' }, () => 'Your own banner'),
          ],
        ),
        h(WhatsAppMessageList, { messages: allMessageTypes.slice(1, 5), conversationId: 'yusuf' }),
      ],
    ),
})

export const composition: MantineDemo = {
  type: 'code',
  component: Composition,
  code: compositionCode,
  maxWidth: '100%',
}
