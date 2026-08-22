import { defineComponent, h, ref } from 'vue'
import { Avatar, Button, Group, Paper, Stack, Text } from '@mantine-vue/core'
import { WhatsAppInboxDrawer, WhatsAppInboxModal } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import {
  closedWindowCapabilities,
  demoConversation,
  demoTemplates,
  openWindowCapabilities,
} from './_data'
import { useInboxDemoState } from './_shared'

const modalCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@mantine-vue/core'
import { WhatsAppInboxModal } from '@mantine-vue/whatsapp-inbox'

const opened = ref(false)
</script>

<template>
  <Button @click="opened = true">Message on WhatsApp</Button>

  <!--
    Modal mode opens straight into a known conversation – from a customer record,
    an invoice or an appointment. There is no conversation list to search through.
  -->
  <WhatsAppInboxModal
    v-model:opened="opened"
    :conversation-id="customer.whatsappConversationId"
    :conversation="conversation"
    :messages="messages"
    :capabilities="capabilities"
    :templates="templates"
    @send="handleSend"
  />
</template>
`

const CustomerCard = defineComponent({
  name: 'WhatsAppDemoCustomerCard',
  props: { label: { type: String, default: 'Message on WhatsApp' } },
  emits: ['open'],
  setup:
    (props, { emit }) =>
    () =>
      h(Paper, { withBorder: true, radius: 'md', p: 'md', style: { maxWidth: '360px' } }, () =>
        h(Group, { justify: 'space-between', wrap: 'nowrap' }, () => [
          h(Group, { gap: 'sm', wrap: 'nowrap' }, () => [
            h(Avatar, { name: 'Amina Haddad', color: 'initials', radius: 'xl' }),
            h(Stack, { gap: 0 }, () => [
              h(Text, { size: 'sm', fw: 600 }, () => 'Amina Haddad'),
              h(Text, { size: 'xs', c: 'dimmed' }, () => 'Order 4821 · BHD 128.00'),
            ]),
          ]),
          h(Button, { size: 'xs', onClick: () => emit('open') }, () => props.label),
        ]),
      ),
})

const Modal = defineComponent({
  name: 'WhatsAppInboxModalDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const opened = ref(false)

    return () => [
      h(CustomerCard, { onOpen: () => (opened.value = true) }),
      h(WhatsAppInboxModal, {
        opened: opened.value,
        'onUpdate:opened': (value: boolean) => {
          opened.value = value
        },
        conversationId: 'amina',
        conversation: demoConversation('amina', openWindowCapabilities),
        messages: state.messages.value,
        templates: demoTemplates,
        uploads: state.uploads.value,
        draft: state.draft.value,
        'onUpdate:draft': (value: string) => {
          state.draft.value = value
        },
        sending: state.sending.value,
        onSend: state.handleSend,
        onAttachmentsAdd: state.handleAttachmentsAdd,
        onAttachmentRemove: state.handleAttachmentRemove,
        onRetryMessage: state.handleRetryMessage,
      }),
    ]
  },
})

export const modal: MantineDemo = {
  type: 'code',
  component: Modal,
  code: modalCode,
  maxWidth: '100%',
}

const drawerCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppInboxDrawer } from '@mantine-vue/whatsapp-inbox'

const opened = ref(false)
</script>

<template>
  <Button @click="opened = true">Open conversation</Button>

  <WhatsAppInboxDrawer
    v-model:opened="opened"
    position="right"
    size="md"
    :conversation-id="lead.conversationId"
    :conversation="conversation"
    :messages="messages"
    :capabilities="capabilities"
    :templates="templates"
    @send="handleSend"
  />
</template>
`

const Drawer = defineComponent({
  name: 'WhatsAppInboxDrawerDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const opened = ref(false)

    return () => [
      h(CustomerCard, { label: 'Open conversation', onOpen: () => (opened.value = true) }),
      h(WhatsAppInboxDrawer, {
        opened: opened.value,
        'onUpdate:opened': (value: boolean) => {
          opened.value = value
        },
        position: 'right',
        size: 'md',
        conversationId: 'amina',
        conversation: demoConversation('amina', openWindowCapabilities),
        messages: state.messages.value,
        templates: demoTemplates,
        uploads: state.uploads.value,
        draft: state.draft.value,
        'onUpdate:draft': (value: string) => {
          state.draft.value = value
        },
        sending: state.sending.value,
        onSend: state.handleSend,
        onAttachmentsAdd: state.handleAttachmentsAdd,
        onAttachmentRemove: state.handleAttachmentRemove,
        onRetryMessage: state.handleRetryMessage,
      }),
    ]
  },
})

export const drawer: MantineDemo = {
  type: 'code',
  component: Drawer,
  code: drawerCode,
  maxWidth: '100%',
}

const restrictionsCode = `
<template>
  <!--
    Drawer mode preserves every restriction of the full-page inbox: the closed
    messaging window disables free-form messaging here exactly as it does there.
  -->
  <WhatsAppInboxDrawer
    v-model:opened="opened"
    :conversation-id="conversationId"
    :capabilities="{
      canSendTemplates: true,
      messagingWindow: { state: 'closed', reason: 'The contact last replied 3 days ago.' },
    }"
    :templates="templates"
  />
</template>
`

const Restrictions = defineComponent({
  name: 'WhatsAppInboxDrawerRestrictionsDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const opened = ref(false)

    return () => [
      h(
        Button,
        { size: 'xs', onClick: () => (opened.value = true) },
        () => 'Open drawer with a closed window',
      ),
      h(WhatsAppInboxDrawer, {
        opened: opened.value,
        'onUpdate:opened': (value: boolean) => {
          opened.value = value
        },
        conversationId: 'amina',
        conversation: demoConversation('amina', closedWindowCapabilities),
        capabilities: closedWindowCapabilities,
        messages: state.messages.value,
        templates: demoTemplates,
        onSend: state.handleSend,
      }),
    ]
  },
})

export const restrictions: MantineDemo = {
  type: 'code',
  component: Restrictions,
  code: restrictionsCode,
  maxWidth: '100%',
}
