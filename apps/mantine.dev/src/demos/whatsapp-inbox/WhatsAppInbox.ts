import { defineComponent, h, ref } from 'vue'
import { Badge, Button, Code, Group, Stack, Text } from '@mantine-vue/core'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppInboxFilters } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { demoConversation, demoTemplates, openWindowCapabilities } from './_data'
import { INBOX_DEMO_HEIGHT, useInboxDemoState } from './_shared'

function baseInboxProps(state: ReturnType<typeof useInboxDemoState>) {
  return {
    conversations: state.visibleConversations.value,
    conversation: state.selectedConversationId.value
      ? demoConversation(state.selectedConversationId.value, openWindowCapabilities)
      : undefined,
    selectedConversationId: state.selectedConversationId.value,
    'onUpdate:selectedConversationId': (value: string | null) => {
      state.selectedConversationId.value = value
    },
    filters: state.filters.value,
    'onUpdate:filters': (value: WhatsAppInboxFilters) => {
      state.filters.value = value
    },
    filtersConfig: {
      statuses: [
        { value: 'open', label: 'Open' },
        { value: 'pending', label: 'Pending' },
        { value: 'resolved', label: 'Resolved' },
      ],
    },
    messages: state.messages.value,
    drafts: state.drafts.value,
    'onUpdate:drafts': (value: Record<string, string>) => {
      state.drafts.value = value
    },
    uploads: state.uploads.value,
    templates: demoTemplates,
    sending: state.sending.value,
    style: { height: `${INBOX_DEMO_HEIGHT}px` },
    onSend: state.handleSend,
    onSelectConversation: state.handleSelectConversation,
    onRetryMessage: state.handleRetryMessage,
    onAttachmentsAdd: state.handleAttachmentsAdd,
    onAttachmentRemove: state.handleAttachmentRemove,
  }
}

const usageCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import type {
  WhatsAppConversationSummary,
  WhatsAppInboxFilters,
  WhatsAppMessageData,
  WhatsAppOutgoingMessage,
} from '@mantine-vue/whatsapp-inbox'

const conversations = ref<WhatsAppConversationSummary[]>([/* from your API */])
const messages = ref<WhatsAppMessageData[]>([])
const selectedConversationId = ref<string | null>(null)
const filters = ref<WhatsAppInboxFilters>({})

// The extension never sends anything itself – it hands you a typed payload.
function handleSend(payload: WhatsAppOutgoingMessage) {
  api.send(payload)
}
</script>

<template>
  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    v-model:filters="filters"
    :conversations="conversations"
    :messages="messages"
    :capabilities="capabilities"
    :templates="templates"
    style="height: 560px"
    @send="handleSend"
  >
    <!-- A slot replaces the built-in emoji picker. -->
    <template #emojiPicker="{ insert, close }">
      <MyEmojiPicker @select="(emoji) => { insert(emoji); close() }" />
    </template>
  </WhatsAppInbox>
</template>
`

const Usage = defineComponent({
  name: 'WhatsAppInboxUsageDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })

    return () => h(WhatsAppInbox, baseInboxProps(state))
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: usageCode,
  maxWidth: '100%',
}

const controlledCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'

// The selection is owned by your application: the inbox never moves it on its own.
const selectedConversationId = ref<string | null>('amina')
</script>

<template>
  <Group mb="sm">
    <Button size="xs" @click="selectedConversationId = 'amina'">Open Amina</Button>
    <Button size="xs" @click="selectedConversationId = 'yusuf'">Open Yusuf</Button>
    <Button size="xs" variant="default" @click="selectedConversationId = null">
      Clear selection
    </Button>
  </Group>

  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    :conversations="conversations"
    :messages="messages"
    style="height: 560px"
  />
</template>
`

const Controlled = defineComponent({
  name: 'WhatsAppInboxControlledDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })

    const open = (id: string | null) => () => {
      state.selectedConversationId.value = id
    }

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () => [
          h(Button, { size: 'xs', onClick: open('amina') }, () => 'Open Amina'),
          h(Button, { size: 'xs', onClick: open('yusuf') }, () => 'Open Yusuf'),
          h(
            Button,
            { size: 'xs', variant: 'default', onClick: open(null) },
            () => 'Clear selection',
          ),
          h(Code, null, () => `selectedConversationId: ${state.selectedConversationId.value}`),
        ]),
        h(WhatsAppInbox, baseInboxProps(state)),
      ])
  },
})

export const controlled: MantineDemo = {
  type: 'code',
  component: Controlled,
  code: controlledCode,
  maxWidth: '100%',
}

const draftsCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'

// One unsent draft per conversation, restored when the user comes back.
const drafts = ref<Record<string, string>>({})
</script>

<template>
  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    v-model:drafts="drafts"
    draft-behavior="preserve"
    :conversations="conversations"
    :messages="messages"
    style="height: 560px"
  />
</template>
`

const Drafts = defineComponent({
  name: 'WhatsAppInboxDraftsDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const behavior = ref<'preserve' | 'reset'>('preserve')

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          (['preserve', 'reset'] as const).map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                variant: behavior.value === value ? 'filled' : 'default',
                onClick: () => {
                  behavior.value = value
                },
              },
              () => `draftBehavior: ${value}`,
            ),
          ),
        ),
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          () =>
            'Type a message, switch to another conversation, then come back. With preserve the draft is still there; with reset it is gone.',
        ),
        h(WhatsAppInbox, { ...baseInboxProps(state), draftBehavior: behavior.value }),
        h(Code, { block: true }, () => JSON.stringify(state.drafts.value, null, 2)),
      ])
  },
})

export const drafts: MantineDemo = {
  type: 'code',
  component: Drafts,
  code: draftsCode,
  maxWidth: '100%',
}

const newConversationCode = `
<script setup lang="ts">
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppNewConversationPayload } from '@mantine-vue/whatsapp-inbox'

// The extension validates the number and hands it over. Creating or looking up the
// conversation is your call, because only your backend knows the opt-in rules.
async function handleNewConversation({ normalizedPhoneNumber, name }: WhatsAppNewConversationPayload) {
  const conversation = await api.startConversation({ phoneNumber: normalizedPhoneNumber, name })

  conversations.value = [conversation, ...conversations.value]
  selectedConversationId.value = conversation.id
  newConversationOpened.value = false
}
</script>

<template>
  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    v-model:new-conversation-opened="newConversationOpened"
    with-new-conversation
    :new-conversation-creating="creating"
    :new-conversation-error="createError"
    :conversations="conversations"
    :messages="messages"
    style="height: 560px"
    @new-conversation="handleNewConversation"
  />
</template>
`

const NewConversation = defineComponent({
  name: 'WhatsAppInboxNewConversationDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: null })

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          () =>
            'Use the + control in the list header to message a number that is not in the list yet.',
        ),
        h(WhatsAppInbox, {
          ...baseInboxProps(state),
          withNewConversation: true,
          newConversationOpened: state.newConversationOpened.value,
          'onUpdate:newConversationOpened': (value: boolean) => {
            state.newConversationOpened.value = value
          },
          onNewConversation: state.handleNewConversation,
        }),
      ])
  },
})

export const newConversation: MantineDemo = {
  type: 'code',
  component: NewConversation,
  code: newConversationCode,
  maxWidth: '100%',
}

const contactPanelCode = `
<template>
  <WhatsAppInbox
    v-model:selected-conversation-id="selectedConversationId"
    v-model:contact-panel-opened="contactPanelOpened"
    with-contact-panel
    :conversations="conversations"
    :conversation="conversation"
    :messages="messages"
    style="height: 560px"
  />
</template>
`

const ContactPanel = defineComponent({
  name: 'WhatsAppInboxContactPanelDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const contactPanelOpened = ref(true)

    return () =>
      h(WhatsAppInbox, {
        ...baseInboxProps(state),
        withContactPanel: true,
        contactPanelOpened: contactPanelOpened.value,
        'onUpdate:contactPanelOpened': (value: boolean) => {
          contactPanelOpened.value = value
        },
        sidebarWidth: 260,
        contactPanelWidth: 260,
      })
  },
})

export const contactPanel: MantineDemo = {
  type: 'code',
  component: ContactPanel,
  code: contactPanelCode,
  maxWidth: '100%',
}

const narrowCode = `
<template>
  <!--
    layout="auto" measures the component, not the viewport, so an inbox inside a narrow
    column collapses on its own. Force it with layout="single" to preview the mobile layout.
  -->
  <WhatsAppInbox
    layout="single"
    :conversations="conversations"
    :messages="messages"
    style="height: 560px"
  />
</template>
`

const Narrow = defineComponent({
  name: 'WhatsAppInboxNarrowDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: null })

    return () =>
      h(
        'div',
        { style: { maxWidth: '420px', marginInline: 'auto' } },
        h(WhatsAppInbox, { ...baseInboxProps(state), layout: 'single' }),
      )
  },
})

export const narrow: MantineDemo = {
  type: 'code',
  component: Narrow,
  code: narrowCode,
  maxWidth: '100%',
}

const slotsCode = `
<template>
  <WhatsAppInbox :conversations="conversations" :messages="messages">
    <!-- Replace a whole conversation row -->
    <template #conversationItem="{ conversation, selected }">
      <UnstyledButton :data-selected="selected" @click="select(conversation)">
        {{ conversation.contact.name }}
      </UnstyledButton>
    </template>

    <!-- Add your own controls to the conversation header -->
    <template #headerActions="{ conversation }">
      <Badge size="sm" variant="light">{{ conversation?.status }}</Badge>
    </template>
  </WhatsAppInbox>
</template>
`

const Slots = defineComponent({
  name: 'WhatsAppInboxSlotsDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })

    return () =>
      h(WhatsAppInbox, baseInboxProps(state), {
        listHeader: () => h(Text, { size: 'xs', c: 'dimmed', fw: 600 }, () => 'CUSTOM LIST HEADER'),
        headerActions: ({ conversation }: any) =>
          conversation?.status
            ? h(Badge, { size: 'sm', variant: 'light' }, () => conversation.status)
            : null,
        messageFooter: ({ message }: any) =>
          message.direction === 'outbound'
            ? h(Text, { size: '10px', c: 'dimmed' }, () => `id: ${message.id}`)
            : null,
      })
  },
})

export const slots: MantineDemo = {
  type: 'code',
  component: Slots,
  code: slotsCode,
  maxWidth: '100%',
}

const statesCode = `
<template>
  <!-- Loading, error and empty states are props, not internal guesses -->
  <WhatsAppInbox conversations-loading style="height: 400px" />

  <WhatsAppInbox
    :conversations="[]"
    conversations-error="Could not reach the messaging service"
    style="height: 400px"
    @retry-load-conversations="refetch"
  />

  <WhatsAppInbox :conversations="[]" style="height: 400px" />
</template>
`

const States = defineComponent({
  name: 'WhatsAppInboxStatesDemo',
  setup() {
    const variant = ref<'loading' | 'error' | 'empty'>('loading')

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(Group, { gap: 'xs' }, () =>
          (['loading', 'error', 'empty'] as const).map((value) =>
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
        h(WhatsAppInbox, {
          conversations: [],
          conversationsLoading: variant.value === 'loading',
          conversationsError: variant.value === 'error' ? 'Could not reach the service' : null,
          style: { height: '380px' },
        }),
      ])
  },
})

export const states: MantineDemo = {
  type: 'code',
  component: States,
  code: statesCode,
  maxWidth: '100%',
}
