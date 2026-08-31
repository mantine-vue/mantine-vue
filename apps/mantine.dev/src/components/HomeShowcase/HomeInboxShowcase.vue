<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge } from '@mantine-vue/core'
import { WhatsAppInbox } from '@mantine-vue/whatsapp-inbox'
import {
  demoConversation,
  demoTemplates,
  openWindowCapabilities,
} from '@/demos/whatsapp-inbox/_data'
import { useInboxDemoState } from '@/demos/whatsapp-inbox/_shared'

const {
  visibleConversations,
  filters,
  drafts,
  messages,
  selectedConversationId,
  uploads,
  sending,
  handleSend,
  handleRetryMessage,
  handleAttachmentsAdd,
  handleAttachmentRemove,
  handleSelectConversation,
} = useInboxDemoState({ conversationId: 'amina' })

const contactPanelOpened = ref(true)
const activeConversation = computed(() =>
  selectedConversationId.value
    ? demoConversation(selectedConversationId.value, openWindowCapabilities)
    : undefined,
)

const filtersConfig = {
  statuses: [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
  ],
}
</script>

<template>
  <div class="inboxFrame">
    <WhatsAppInbox
      v-model:selected-conversation-id="selectedConversationId"
      v-model:filters="filters"
      v-model:drafts="drafts"
      v-model:contact-panel-opened="contactPanelOpened"
      class="landingInbox"
      layout="auto"
      :narrow-breakpoint="900"
      :sidebar-width="270"
      :contact-panel-width="245"
      :conversations="visibleConversations"
      :conversation="activeConversation"
      :filters-config="filtersConfig"
      :messages="messages"
      :uploads="uploads"
      :templates="demoTemplates"
      :sending="sending"
      with-contact-panel
      order="activity"
      @send="handleSend"
      @select-conversation="handleSelectConversation"
      @retry-message="handleRetryMessage"
      @attachments-add="handleAttachmentsAdd"
      @attachment-remove="handleAttachmentRemove"
    >
      <template #headerActions="{ conversation }">
        <Badge v-if="conversation?.status" size="sm" variant="light" radius="sm">
          {{ conversation.status }}
        </Badge>
      </template>
    </WhatsAppInbox>
  </div>
</template>

<style scoped>
.inboxFrame {
  height: 700px;
  overflow: hidden;
  border-radius: var(--mantine-radius-lg);
  box-shadow: 0 24px 70px alpha(var(--mantine-color-black), 0.08);
}

.landingInbox {
  height: 100%;
  border-radius: inherit;
}

@media (max-width: 680px) {
  .inboxFrame {
    height: 560px;
  }
}
:deep(.mantine-WhatsAppMessageList-messageListRoot) {
  background-color: var(--chat-background);

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%23b8b2aa' stroke-width='1.2' opacity='0.22'%3E%3Ccircle cx='25' cy='25' r='8'/%3E%3Cpath d='M21 25h8M25 21v8'/%3E%3Cpath d='M75 18c7 0 12 4 12 9s-5 9-12 9l-6 5 2-7c-5-2-8-5-8-8 0-5 5-8 12-8z'/%3E%3Cpath d='M120 20l8 8-8 8-8-8z'/%3E%3Ccircle cx='140' cy='65' r='5'/%3E%3Cpath d='M18 78q10-12 20 0t20 0'/%3E%3Cpath d='M75 75l7-7 7 7-7 7z'/%3E%3Cpath d='M110 92c8-10 18-10 26 0-8 10-18 10-26 0z'/%3E%3Ccircle cx='123' cy='92' r='3'/%3E%3Cpath d='M25 120l10-6 10 6-10 6z'/%3E%3Cpath d='M70 125c0-7 5-12 12-12s12 5 12 12'/%3E%3Cpath d='M120 130l7-12 7 12z'/%3E%3Cpath d='M145 145h-14M138 138v14'/%3E%3C/g%3E%3C/svg%3E") !important;

  background-repeat: repeat !important;
  background-size: 160px 160px !important;
}

:global([data-mantine-color-scheme='light']) {
  --chat-background: #efeae2;
}

:global([data-mantine-color-scheme='dark']) {
  --chat-background: #0b141a;
}
</style>
