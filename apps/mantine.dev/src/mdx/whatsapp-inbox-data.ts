import type { Frontmatter } from '@/types'

const PACKAGE = '@mantine-vue/whatsapp-inbox'

export const WHATSAPP_INBOX_MDX_DATA: Record<string, Frontmatter> = {
  WhatsAppGettingStarted: {
    title: 'Getting started',
    package: PACKAGE,
    slug: '/whatsapp-inbox/getting-started',
    description:
      'Install the backend-agnostic WhatsApp-style inbox and learn how it integrates with your application',
    docs: 'whatsapp-inbox/getting-started.mdx',
    searchTags:
      'whatsapp, inbox, messaging, chat, conversations, installation, getting started, backend agnostic',
  },
  WhatsAppInbox: {
    title: 'WhatsAppInbox',
    package: PACKAGE,
    slug: '/whatsapp-inbox/inbox',
    props: ['WhatsAppInbox'],
    styles: ['WhatsAppInbox'],
    description:
      'Full-page WhatsApp-style inbox: conversation list, conversation and contact panel',
    source: '@mantine-vue/whatsapp-inbox/src/components/WhatsAppInbox/WhatsAppInbox.ts',
    docs: 'whatsapp-inbox/inbox.mdx',
    searchTags:
      'whatsapp inbox, full page inbox, conversation layout, responsive inbox, three panes',
  },
  WhatsAppConversationList: {
    title: 'Conversation list',
    package: PACKAGE,
    slug: '/whatsapp-inbox/conversation-list',
    props: ['WhatsAppConversationList', 'WhatsAppConversationListItem'],
    styles: ['WhatsAppConversationList', 'WhatsAppConversationListItem'],
    description:
      'Browse conversations with search, filters, unread indicators and pagination hooks',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppConversationList/WhatsAppConversationList.ts',
    docs: 'whatsapp-inbox/conversation-list.mdx',
    searchTags:
      'conversation list, unread, filters, search conversations, infinite scroll, pagination, assignment',
  },
  WhatsAppConversation: {
    title: 'Conversation',
    package: PACKAGE,
    slug: '/whatsapp-inbox/conversation',
    props: ['WhatsAppConversation', 'WhatsAppConversationHeader'],
    styles: ['WhatsAppConversation', 'WhatsAppConversationHeader'],
    description: 'Conversation view combining the header, message history and composer',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppConversation/WhatsAppConversation.ts',
    docs: 'whatsapp-inbox/conversation.mdx',
    searchTags: 'conversation view, chat view, header, message history, composer',
  },
  WhatsAppMessages: {
    title: 'Messages',
    package: PACKAGE,
    slug: '/whatsapp-inbox/messages',
    props: [
      'WhatsAppMessageList',
      'WhatsAppMessage',
      'WhatsAppMessageBubble',
      'WhatsAppMessageStatus',
    ],
    styles: [
      'WhatsAppMessageList',
      'WhatsAppMessage',
      'WhatsAppMessageBubble',
      'WhatsAppMessageStatus',
    ],
    description: 'Render every message type, delivery state and failure, with custom renderers',
    source: '@mantine-vue/whatsapp-inbox/src/components/WhatsAppMessageList/WhatsAppMessageList.ts',
    docs: 'whatsapp-inbox/messages.mdx',
    searchTags:
      'message list, message bubble, delivery status, read receipts, ticks, custom message renderer, message types',
  },
  WhatsAppComposer: {
    title: 'Composer',
    package: PACKAGE,
    slug: '/whatsapp-inbox/composer',
    props: ['WhatsAppComposer', 'WhatsAppEmojiPicker'],
    styles: ['WhatsAppComposer', 'WhatsAppEmojiPicker'],
    description:
      'Capability-driven message composer with a built-in emoji picker, validation and attachments',
    source: '@mantine-vue/whatsapp-inbox/src/components/WhatsAppComposer/WhatsAppComposer.ts',
    docs: 'whatsapp-inbox/composer.mdx',
    searchTags:
      'composer, message input, send message, capabilities, validation, emoji picker, reply',
  },
  WhatsAppMessagingWindow: {
    title: 'Messaging window',
    package: PACKAGE,
    slug: '/whatsapp-inbox/messaging-window',
    props: ['WhatsAppMessagingWindowNotice'],
    styles: ['WhatsAppMessagingWindowNotice'],
    description:
      'How the 24-hour WhatsApp customer service window is surfaced, with the backend as the authority',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppMessagingWindowNotice/WhatsAppMessagingWindowNotice.ts',
    docs: 'whatsapp-inbox/messaging-window.mdx',
    searchTags:
      '24-hour window, customer service window, session window, free-form messaging, closed window, template only',
  },
  WhatsAppTemplates: {
    title: 'Templates',
    package: PACKAGE,
    slug: '/whatsapp-inbox/templates',
    props: ['WhatsAppTemplateSelector', 'WhatsAppTemplatePreview'],
    styles: ['WhatsAppTemplateSelector', 'WhatsAppTemplatePreview'],
    description: 'Search, preview, fill and submit approved WhatsApp message templates',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppTemplateSelector/WhatsAppTemplateSelector.ts',
    docs: 'whatsapp-inbox/templates.mdx',
    searchTags:
      'whatsapp templates, message templates, template parameters, template preview, approved templates, hsm',
  },
  WhatsAppInteractiveMessages: {
    title: 'Interactive messages',
    package: PACKAGE,
    slug: '/whatsapp-inbox/interactive-messages',
    props: ['WhatsAppInteractiveMessageEditor'],
    styles: ['WhatsAppInteractiveMessageEditor'],
    description: 'Compose and display reply buttons, call-to-action buttons and list messages',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppInteractiveMessageEditor/WhatsAppInteractiveMessageEditor.ts',
    docs: 'whatsapp-inbox/interactive-messages.mdx',
    searchTags: 'interactive messages, reply buttons, cta url, list message, quick replies',
  },
  WhatsAppMedia: {
    title: 'Media and uploads',
    package: PACKAGE,
    slug: '/whatsapp-inbox/media',
    props: ['WhatsAppMediaAttachment', 'WhatsAppAttachmentPreview'],
    styles: ['WhatsAppMediaAttachment', 'WhatsAppAttachmentPreview'],
    description: 'File selection, validation, upload state and media rendering',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppMediaAttachment/WhatsAppMediaAttachment.ts',
    docs: 'whatsapp-inbox/media.mdx',
    searchTags:
      'media, attachments, file upload, upload progress, image, video, audio, document, file validation',
  },
  WhatsAppModalDrawer: {
    title: 'Modal and drawer',
    package: PACKAGE,
    slug: '/whatsapp-inbox/modal-and-drawer',
    props: ['WhatsAppInboxModal', 'WhatsAppInboxDrawer'],
    styles: ['WhatsAppInboxModal', 'WhatsAppInboxDrawer'],
    description: 'Open a single conversation from anywhere in your application',
    source: '@mantine-vue/whatsapp-inbox/src/components/WhatsAppInboxModal/WhatsAppInboxModal.ts',
    docs: 'whatsapp-inbox/modal-and-drawer.mdx',
    searchTags: 'whatsapp modal, whatsapp drawer, side panel, quick reply, embedded conversation',
  },
  WhatsAppIntegration: {
    title: 'Backend integration',
    package: PACKAGE,
    slug: '/whatsapp-inbox/integration',
    description:
      'Map your backend onto the domain model and wire it up with TanStack Query, WebSockets or anything else',
    docs: 'whatsapp-inbox/integration.mdx',
    searchTags:
      'tanstack query, vue query, websocket, realtime, backend integration, optimistic update, adapter, mapping',
  },
  WhatsAppCustomization: {
    title: 'Customization',
    package: PACKAGE,
    slug: '/whatsapp-inbox/customization',
    props: ['WhatsAppInboxProvider', 'WhatsAppContactPanel'],
    styles: ['WhatsAppContactPanel'],
    description: 'Labels, formatters, slots, the Styles API and building your own layout',
    source:
      '@mantine-vue/whatsapp-inbox/src/components/WhatsAppInboxProvider/WhatsAppInboxProvider.ts',
    docs: 'whatsapp-inbox/customization.mdx',
    searchTags:
      'labels, i18n, localization, formatters, slots, styles api, contact panel, custom layout, theming',
  },
  WhatsAppTypes: {
    title: 'TypeScript model',
    package: PACKAGE,
    slug: '/whatsapp-inbox/types',
    description: 'The backend-neutral domain model every component is built on',
    docs: 'whatsapp-inbox/types.mdx',
    searchTags:
      'types, typescript, domain model, discriminated union, message type, capabilities, outgoing payload',
  },
}
