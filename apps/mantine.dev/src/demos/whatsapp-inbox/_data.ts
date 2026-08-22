import type {
  WhatsAppConversationData,
  WhatsAppConversationSummary,
  WhatsAppMessageData,
  WhatsAppTemplate,
} from '@mantine-vue/whatsapp-inbox'

/** Demos are anchored to a fixed day so the relative timestamps stay stable in screenshots. */
const DAY = 86_400_000
const now = Date.now()

export function minutesAgo(minutes: number) {
  return new Date(now - minutes * 60_000).toISOString()
}

export function daysAgo(days: number) {
  return new Date(now - days * DAY).toISOString()
}

export const demoConversations: WhatsAppConversationSummary[] = [
  {
    id: 'amina',
    contact: {
      id: 'contact-amina',
      name: 'Amina Haddad',
      phoneNumber: '+973 3300 1122',
      email: 'amina.haddad@example.com',
      about: 'Available',
      tags: ['VIP', 'Returning'],
      fields: [
        { key: 'customer-id', label: 'Customer id', value: 'CU-99312' },
        { key: 'lifetime', label: 'Lifetime value', value: 'BHD 1,240' },
      ],
    },
    unreadCount: 2,
    updatedAt: minutesAgo(4),
    status: 'open',
    assignee: { id: 'agent-sara', name: 'Sara Nasser' },
    labels: [{ id: 'billing', name: 'Billing', color: 'grape' }],
    lastMessage: {
      id: 'amina-6',
      type: 'text',
      direction: 'inbound',
      text: 'Perfect, thank you! Can you resend the invoice?',
      timestamp: minutesAgo(4),
    },
  },
  {
    id: 'yusuf',
    contact: {
      id: 'contact-yusuf',
      name: 'Yusuf Karim',
      phoneNumber: '+973 3300 9988',
      tags: ['Wholesale'],
    },
    unreadCount: 0,
    updatedAt: minutesAgo(95),
    status: 'pending',
    pinned: true,
    lastMessage: {
      id: 'yusuf-2',
      type: 'image',
      direction: 'outbound',
      status: 'read',
      text: 'Product catalogue',
      timestamp: minutesAgo(95),
    },
  },
  {
    id: 'layla',
    contact: {
      id: 'contact-layla',
      name: 'Layla Mansour',
      phoneNumber: '+973 3300 4455',
    },
    unreadCount: 0,
    updatedAt: daysAgo(2),
    status: 'resolved',
    muted: true,
    assignee: { id: 'agent-omar', name: 'Omar Fadel' },
    lastMessage: {
      id: 'layla-3',
      type: 'template',
      direction: 'outbound',
      status: 'delivered',
      text: 'Your appointment is confirmed for Tuesday at 14:00.',
      timestamp: daysAgo(2),
    },
  },
  {
    id: 'noor',
    contact: {
      id: 'contact-noor',
      phoneNumber: '+973 3300 7766',
    },
    unreadCount: 5,
    updatedAt: daysAgo(9),
    status: 'open',
    lastMessage: {
      id: 'noor-1',
      type: 'document',
      direction: 'inbound',
      text: 'purchase-order.pdf',
      timestamp: daysAgo(9),
    },
  },
]

export const demoMessages: Record<string, WhatsAppMessageData[]> = {
  amina: [
    {
      id: 'amina-1',
      type: 'system',
      direction: 'inbound',
      timestamp: daysAgo(1),
      text: 'Conversation assigned to Sara Nasser',
    },
    {
      id: 'amina-2',
      type: 'text',
      direction: 'inbound',
      timestamp: minutesAgo(48),
      text: 'Hi! I placed order 4821 yesterday and I have not received the receipt yet.',
    },
    {
      id: 'amina-3',
      type: 'text',
      direction: 'outbound',
      status: 'read',
      timestamp: minutesAgo(45),
      author: { id: 'agent-sara', name: 'Sara Nasser' },
      text: 'Hello Amina! Let me check that for you right away.',
    },
    {
      id: 'amina-4',
      type: 'document',
      direction: 'outbound',
      status: 'read',
      timestamp: minutesAgo(41),
      author: { id: 'agent-sara', name: 'Sara Nasser' },
      caption: 'Here is your receipt.',
      attachment: {
        mediaType: 'document',
        fileName: 'receipt-4821.pdf',
        mimeType: 'application/pdf',
        size: 184_320,
        url: 'https://mantine-vue.dev/receipt-4821.pdf',
      },
    },
    {
      id: 'amina-5',
      type: 'interactive',
      direction: 'outbound',
      status: 'delivered',
      timestamp: minutesAgo(20),
      interactive: {
        type: 'button',
        body: 'Did this solve your issue?',
        footer: 'We would love your feedback',
        buttons: [
          { id: 'yes', title: 'Yes, thanks' },
          { id: 'no', title: 'Not yet' },
        ],
      },
    },
    {
      id: 'amina-6',
      type: 'text',
      direction: 'inbound',
      timestamp: minutesAgo(4),
      text: 'Perfect, thank you! Can you resend the invoice?',
      replyTo: {
        id: 'amina-4',
        text: 'Here is your receipt.',
        direction: 'outbound',
        author: 'Sara Nasser',
      },
    },
  ],
  yusuf: [
    {
      id: 'yusuf-1',
      type: 'text',
      direction: 'inbound',
      timestamp: minutesAgo(140),
      text: 'Do you have the new catalogue?',
    },
    {
      id: 'yusuf-2',
      type: 'image',
      direction: 'outbound',
      status: 'read',
      timestamp: minutesAgo(95),
      caption: 'Product catalogue, spring collection.',
      attachment: {
        mediaType: 'image',
        fileName: 'catalogue.png',
        mimeType: 'image/png',
        width: 640,
        height: 360,
        url: 'https://placehold.co/640x360/25D366/FFFFFF/png?text=Catalogue',
      },
    },
  ],
  layla: [
    {
      id: 'layla-1',
      type: 'text',
      direction: 'inbound',
      timestamp: daysAgo(3),
      text: 'Can I move my appointment to Tuesday?',
    },
    {
      id: 'layla-2',
      type: 'text',
      direction: 'outbound',
      status: 'read',
      timestamp: daysAgo(3),
      text: 'Of course, I have moved it.',
    },
    {
      id: 'layla-3',
      type: 'template',
      direction: 'outbound',
      status: 'delivered',
      timestamp: daysAgo(2),
      template: {
        name: 'appointment_reminder',
        language: 'en_US',
        values: { body: { '1': 'Layla', '2': 'Tuesday at 14:00' } },
        template: {
          id: 'appointment_reminder',
          name: 'appointment_reminder',
          language: 'en_US',
          category: 'utility',
          status: 'approved',
          components: [
            { type: 'header', format: 'text', text: 'Appointment confirmed' },
            { type: 'body', text: 'Hi {{1}}, your appointment is confirmed for {{2}}.' },
            { type: 'footer', text: 'Reply STOP to opt out' },
          ],
        },
      },
    },
  ],
  noor: [
    {
      id: 'noor-1',
      type: 'document',
      direction: 'inbound',
      timestamp: daysAgo(9),
      attachment: {
        mediaType: 'document',
        fileName: 'purchase-order.pdf',
        mimeType: 'application/pdf',
        size: 512_000,
        url: 'https://mantine-vue.dev/purchase-order.pdf',
      },
    },
  ],
}

export const allMessageTypes: WhatsAppMessageData[] = [
  {
    id: 'type-system',
    type: 'system',
    direction: 'inbound',
    timestamp: minutesAgo(60),
    text: 'Conversation opened',
  },
  {
    id: 'type-text',
    type: 'text',
    direction: 'inbound',
    timestamp: minutesAgo(55),
    text: 'A plain text message.\nIt can span several lines.',
  },
  {
    id: 'type-image',
    type: 'image',
    direction: 'outbound',
    status: 'read',
    timestamp: minutesAgo(50),
    caption: 'An image with a caption',
    attachment: {
      mediaType: 'image',
      fileName: 'photo.png',
      width: 480,
      height: 270,
      url: 'https://placehold.co/480x270/128C7E/FFFFFF/png?text=Photo',
    },
  },
  {
    id: 'type-audio',
    type: 'audio',
    direction: 'inbound',
    timestamp: minutesAgo(45),
    attachment: { mediaType: 'audio', fileName: 'voice-note.ogg', durationSeconds: 34 },
  },
  {
    id: 'type-document',
    type: 'document',
    direction: 'inbound',
    timestamp: minutesAgo(40),
    attachment: {
      mediaType: 'document',
      fileName: 'terms-of-service.pdf',
      mimeType: 'application/pdf',
      size: 1_048_576,
      url: 'https://mantine-vue.dev/terms.pdf',
    },
  },
  {
    id: 'type-location',
    type: 'location',
    direction: 'inbound',
    timestamp: minutesAgo(35),
    location: { latitude: 26.2285, longitude: 50.586, name: 'Manama Branch', address: 'Road 1702' },
  },
  {
    id: 'type-contacts',
    type: 'contacts',
    direction: 'inbound',
    timestamp: minutesAgo(30),
    contacts: [{ name: 'Omar Fadel', phoneNumbers: ['+973 3300 3311'] }],
  },
  {
    id: 'type-template',
    type: 'template',
    direction: 'outbound',
    status: 'delivered',
    timestamp: minutesAgo(25),
    template: {
      name: 'order_shipped',
      language: 'en_US',
      values: { body: { '1': 'Amina', '2': '4821' } },
      template: {
        id: 'order_shipped',
        name: 'order_shipped',
        language: 'en_US',
        components: [
          { type: 'body', text: 'Hi {{1}}, order {{2}} has shipped.' },
          { type: 'buttons', buttons: [{ type: 'url', text: 'Track', url: 'https://track.test' }] },
        ],
      },
    },
  },
  {
    id: 'type-interactive',
    type: 'interactive',
    direction: 'outbound',
    status: 'sent',
    timestamp: minutesAgo(20),
    interactive: {
      type: 'cta_url',
      body: 'Your invoice is ready.',
      action: { displayText: 'Open invoice', url: 'https://example.com/invoice/4821' },
    },
  },
  {
    id: 'type-reactions',
    type: 'text',
    direction: 'inbound',
    timestamp: minutesAgo(15),
    text: 'A message with reactions',
    reactions: [
      { emoji: '👍', count: 2 },
      { emoji: '🎉', reacted: true },
    ],
  },
  {
    id: 'type-failed',
    type: 'text',
    direction: 'outbound',
    status: 'failed',
    timestamp: minutesAgo(10),
    text: 'A message the provider rejected',
    error: { code: '131047', message: 'Re-engagement message outside the allowed window' },
  },
  {
    id: 'type-unsupported',
    type: 'unsupported',
    direction: 'inbound',
    timestamp: minutesAgo(5),
  },
]

export const demoTemplates: WhatsAppTemplate[] = [
  {
    id: 'appointment_reminder',
    name: 'appointment_reminder',
    language: 'en_US',
    languageLabel: 'English (US)',
    category: 'utility',
    status: 'approved',
    components: [
      { type: 'header', format: 'text', text: 'Appointment reminder' },
      {
        type: 'body',
        text: 'Hi {{1}}, this is a reminder for your appointment on {{2}} at {{3}}.',
      },
      { type: 'footer', text: 'Reply STOP to opt out' },
      {
        type: 'buttons',
        buttons: [
          { type: 'quick_reply', text: 'Confirm' },
          { type: 'quick_reply', text: 'Reschedule' },
        ],
      },
    ],
  },
  {
    id: 'order_shipped',
    name: 'order_shipped',
    language: 'en_US',
    languageLabel: 'English (US)',
    category: 'utility',
    status: 'approved',
    description: 'Sent when an order leaves the warehouse',
    components: [
      { type: 'body', text: 'Good news {{name}}! Order {{order}} is on its way.' },
      {
        type: 'buttons',
        buttons: [
          { type: 'url', text: 'Track order', url: 'https://track.example.com/{{1}}' },
          { type: 'phone_number', text: 'Call support', phoneNumber: '+97317000000' },
        ],
      },
    ],
  },
  {
    id: 'invoice_receipt',
    name: 'invoice_receipt',
    language: 'en_US',
    category: 'utility',
    status: 'approved',
    components: [
      { type: 'header', format: 'document' },
      { type: 'body', text: 'Your invoice for {{1}} is attached.' },
    ],
  },
  {
    id: 'spring_sale',
    name: 'spring_sale',
    language: 'ar',
    languageLabel: 'Arabic',
    category: 'marketing',
    status: 'pending',
    components: [{ type: 'body', text: 'خصم {{1}}٪ على كل المنتجات حتى نهاية الشهر.' }],
  },
]

export function demoConversation(
  id: string,
  capabilities?: WhatsAppConversationData['capabilities'],
): WhatsAppConversationData {
  const summary = demoConversations.find((conversation) => conversation.id === id)!

  return { ...summary, capabilities }
}

export const openWindowCapabilities: WhatsAppConversationData['capabilities'] = {
  canSendFreeForm: true,
  canSendMedia: true,
  canSendTemplates: true,
  canUseEmoji: true,
  canSendInteractive: true,
  interactiveTypes: ['button', 'cta_url', 'list'],
  maxTextLength: 4096,
  mediaConstraints: {
    image: { maxFileSize: 5 * 1024 * 1024, accept: ['image/*'] },
    document: { maxFileSize: 100 * 1024 * 1024, maxFiles: 1 },
  },
  messagingWindow: { state: 'open', expiresAt: new Date(now + 18 * 3600_000).toISOString() },
}

export const closedWindowCapabilities: WhatsAppConversationData['capabilities'] = {
  canSendFreeForm: true,
  canSendMedia: true,
  canSendTemplates: true,
  messagingWindow: {
    state: 'closed',
    reasonCode: 'customer_service_window_expired',
    reason: 'Amina last replied more than 24 hours ago, so only templates can be sent.',
  },
}
