/**
 * Every user-visible string the extension renders on its own.
 *
 * Nothing is hard-coded inside a template: a consumer localizes the whole inbox by passing one
 * `labels` object to `WhatsAppInboxProvider`, and any component can still override a single key
 * without losing the rest.
 */
export interface WhatsAppInboxLabels {
  /* Conversation list */
  conversationsLabel: string
  searchPlaceholder: string
  searchLabel: string
  unreadFilterLabel: string
  statusFilterLabel: string
  statusFilterPlaceholder: string
  assigneeFilterLabel: string
  assigneeFilterPlaceholder: string
  unassigned: string
  clearFilters: string
  newConversation: string
  newConversationTitle: string
  newConversationDescription: string
  newConversationPhoneLabel: string
  newConversationPhonePlaceholder: string
  newConversationNameLabel: string
  newConversationNamePlaceholder: string
  newConversationSubmit: string
  newConversationInvalidPhone: string
  newConversationExists: string
  loadMoreConversations: string
  loadingConversations: string
  conversationsError: string
  emptyInbox: string
  emptySearch: string
  unreadCountLabel: (count: number) => string
  conversationItemLabel: (name: string) => string

  /* Conversation view */
  noConversationSelected: string
  noConversationSelectedDescription: string
  emptyConversation: string
  emptyConversationDescription: string
  conversationError: string
  messagesError: string
  loadingMessages: string
  loadOlderMessages: string
  loadingOlderMessages: string
  backToConversations: string
  scrollToBottom: string
  newMessages: (count: number) => string
  messageHistoryLabel: string

  /* Dates */
  today: string
  yesterday: string

  /* Delivery states */
  statusPending: string
  statusSent: string
  statusDelivered: string
  statusRead: string
  statusFailed: string
  messageStatusLabel: (status: string) => string
  inboundMessageLabel: string
  outboundMessageLabel: string
  forwarded: string
  retrySend: string
  sendFailed: string

  /* Composer */
  composerPlaceholder: string
  composerLabel: string
  send: string
  sending: string
  attachFile: string
  emoji: string
  templates: string
  interactiveMessage: string
  cancelReply: string
  replyingTo: string
  messageTooLong: (max: number) => string
  characterCount: (count: number, max: number) => string
  emptyMessage: string

  /* Emoji picker */
  emojiPickerLabel: string
  emojiPickerSearchPlaceholder: string
  emojiPickerNoResults: string
  emojiPickerSearchResults: string
  emojiGroupRecent: string
  emojiGroupSmileys: string
  emojiGroupPeople: string
  emojiGroupAnimals: string
  emojiGroupFood: string
  emojiGroupActivity: string
  emojiGroupTravel: string
  emojiGroupObjects: string
  emojiGroupSymbols: string
  emojiGroupFlags: string

  /* Messaging window */
  windowClosedTitle: string
  windowClosedDescription: string
  windowExpiresAt: (time: string) => string
  sendTemplateInstead: string
  composerDisabled: string

  /* Templates */
  templateSelectorTitle: string
  templateSearchPlaceholder: string
  templateCategoryLabel: string
  templateLanguageLabel: string
  templateStatusLabel: string
  templatesEmpty: string
  templatesError: string
  templatesLoading: string
  templateParameters: string
  templateHeaderVariables: string
  templateBodyVariables: string
  templateButtonVariables: string
  templatePreview: string
  templateRequiredField: string
  templateBack: string
  templateSubmit: string
  templateUnavailable: string
  templateHeaderMedia: string
  templateHeaderMediaRequired: string

  /* Interactive editor */
  interactiveTitle: string
  interactiveType: string
  interactiveTypeButton: string
  interactiveTypeCtaUrl: string
  interactiveTypeList: string
  interactiveBody: string
  interactiveFooter: string
  interactiveHeader: string
  interactiveButtons: string
  interactiveAddButton: string
  interactiveRemoveButton: string
  interactiveButtonText: string
  interactiveCtaDisplayText: string
  interactiveCtaUrl: string
  interactiveListButton: string
  interactiveListSections: string
  interactiveAddSection: string
  interactiveRemoveSection: string
  interactiveAddRow: string
  interactiveRemoveRow: string
  interactiveSectionTitle: string
  interactiveRowTitle: string
  interactiveRowDescription: string
  interactiveSubmit: string
  interactiveBodyRequired: string
  interactiveButtonsRequired: string
  interactiveUrlRequired: string
  interactiveRowsRequired: string

  /* Media */
  download: string
  openInNewTab: string
  removeAttachment: string
  retryUpload: string
  cancelUpload: string
  uploading: string
  uploadFailed: string
  attachmentsLabel: string
  playAudio: string
  fileTooLarge: (fileName: string, max: string) => string
  fileInvalidType: (fileName: string) => string
  tooManyFiles: (max: number) => string
  mediaUnavailable: string

  /* Contact panel */
  contactPanelTitle: string
  contactPanelToggle: string
  contactPhoneNumber: string
  contactEmail: string
  contactAbout: string
  contactTags: string
  contactStatus: string
  contactAssignee: string

  /* Message content fallbacks, also used for conversation previews */
  messageTypeImage: string
  messageTypeVideo: string
  messageTypeAudio: string
  messageTypeDocument: string
  messageTypeSticker: string
  messageTypeLocation: string
  messageTypeContacts: string
  messageTypeTemplate: string
  messageTypeInteractive: string
  messageTypeUnsupported: string

  /* Generic */
  retry: string
  close: string
  cancel: string
  loading: string
}

/** English defaults. Every key can be replaced through `labels`. */
export const DEFAULT_WHATSAPP_INBOX_LABELS: WhatsAppInboxLabels = {
  conversationsLabel: 'Conversations',
  searchPlaceholder: 'Search conversations',
  searchLabel: 'Search conversations',
  unreadFilterLabel: 'Unread only',
  statusFilterLabel: 'Status',
  statusFilterPlaceholder: 'All statuses',
  assigneeFilterLabel: 'Assignee',
  assigneeFilterPlaceholder: 'Anyone',
  unassigned: 'Unassigned',
  clearFilters: 'Clear filters',
  newConversation: 'New conversation',
  newConversationTitle: 'Start a new conversation',
  newConversationDescription:
    'Enter the WhatsApp number of the person you want to message. Include the country code.',
  newConversationPhoneLabel: 'Phone number',
  newConversationPhonePlaceholder: '+973 3300 0000',
  newConversationNameLabel: 'Name (optional)',
  newConversationNamePlaceholder: 'How this contact should appear in the list',
  newConversationSubmit: 'Start conversation',
  newConversationInvalidPhone: 'Enter a valid phone number, including the country code',
  newConversationExists: 'You already have a conversation with this number',
  loadMoreConversations: 'Load more',
  loadingConversations: 'Loading conversations',
  conversationsError: 'Conversations could not be loaded',
  emptyInbox: 'No conversations yet',
  emptySearch: 'No conversations match your filters',
  unreadCountLabel: (count) => `${count} unread ${count === 1 ? 'message' : 'messages'}`,
  conversationItemLabel: (name) => `Conversation with ${name}`,

  noConversationSelected: 'No conversation selected',
  noConversationSelectedDescription: 'Pick a conversation from the list to start messaging.',
  emptyConversation: 'No messages yet',
  emptyConversationDescription: 'Messages in this conversation will appear here.',
  conversationError: 'Conversation could not be loaded',
  messagesError: 'Messages could not be loaded',
  loadingMessages: 'Loading messages',
  loadOlderMessages: 'Load older messages',
  loadingOlderMessages: 'Loading older messages',
  backToConversations: 'Back to conversations',
  scrollToBottom: 'Scroll to latest messages',
  newMessages: (count) => `${count} new ${count === 1 ? 'message' : 'messages'}`,
  messageHistoryLabel: 'Message history',

  today: 'Today',
  yesterday: 'Yesterday',

  statusPending: 'Sending',
  statusSent: 'Sent',
  statusDelivered: 'Delivered',
  statusRead: 'Read',
  statusFailed: 'Failed',
  messageStatusLabel: (status) => `Message ${status.toLowerCase()}`,
  inboundMessageLabel: 'Received message',
  outboundMessageLabel: 'Sent message',
  forwarded: 'Forwarded',
  retrySend: 'Try again',
  sendFailed: 'Message could not be sent',

  composerPlaceholder: 'Type a message',
  composerLabel: 'Message',
  send: 'Send',
  sending: 'Sending',
  attachFile: 'Attach file',
  emoji: 'Insert emoji',
  templates: 'Send template',
  interactiveMessage: 'Interactive message',
  cancelReply: 'Cancel reply',
  replyingTo: 'Replying to',
  messageTooLong: (max) => `Message must be ${max} characters or fewer`,
  characterCount: (count, max) => `${count} / ${max}`,
  emptyMessage: 'Enter a message before sending',

  emojiPickerLabel: 'Emoji',
  emojiPickerSearchPlaceholder: 'Search emoji',
  emojiPickerNoResults: 'No emoji found',
  emojiPickerSearchResults: 'Search results',
  emojiGroupRecent: 'Recently used',
  emojiGroupSmileys: 'Smileys and emotion',
  emojiGroupPeople: 'People and body',
  emojiGroupAnimals: 'Animals and nature',
  emojiGroupFood: 'Food and drink',
  emojiGroupActivity: 'Activity',
  emojiGroupTravel: 'Travel and places',
  emojiGroupObjects: 'Objects',
  emojiGroupSymbols: 'Symbols',
  emojiGroupFlags: 'Flags',

  windowClosedTitle: 'Free-form messaging is unavailable',
  windowClosedDescription:
    'The customer service window for this conversation is closed. Send an approved template to reach this contact.',
  windowExpiresAt: (time) => `Free-form messaging available until ${time}`,
  sendTemplateInstead: 'Send a template',
  composerDisabled: 'You cannot send messages in this conversation',

  templateSelectorTitle: 'Templates',
  templateSearchPlaceholder: 'Search templates',
  templateCategoryLabel: 'Category',
  templateLanguageLabel: 'Language',
  templateStatusLabel: 'Status',
  templatesEmpty: 'No templates match your search',
  templatesError: 'Templates could not be loaded',
  templatesLoading: 'Loading templates',
  templateParameters: 'Template parameters',
  templateHeaderVariables: 'Header',
  templateBodyVariables: 'Body',
  templateButtonVariables: 'Buttons',
  templatePreview: 'Preview',
  templateRequiredField: 'This value is required',
  templateBack: 'Back to templates',
  templateSubmit: 'Send template',
  templateUnavailable: 'This template is not approved and cannot be sent',
  templateHeaderMedia: 'Header media',
  templateHeaderMediaRequired: 'Header media is required',

  interactiveTitle: 'Interactive message',
  interactiveType: 'Type',
  interactiveTypeButton: 'Reply buttons',
  interactiveTypeCtaUrl: 'Call to action',
  interactiveTypeList: 'List',
  interactiveBody: 'Body',
  interactiveFooter: 'Footer',
  interactiveHeader: 'Header',
  interactiveButtons: 'Buttons',
  interactiveAddButton: 'Add button',
  interactiveRemoveButton: 'Remove button',
  interactiveButtonText: 'Button text',
  interactiveCtaDisplayText: 'Button text',
  interactiveCtaUrl: 'URL',
  interactiveListButton: 'List button text',
  interactiveListSections: 'Sections',
  interactiveAddSection: 'Add section',
  interactiveRemoveSection: 'Remove section',
  interactiveAddRow: 'Add row',
  interactiveRemoveRow: 'Remove row',
  interactiveSectionTitle: 'Section title',
  interactiveRowTitle: 'Row title',
  interactiveRowDescription: 'Row description',
  interactiveSubmit: 'Send interactive message',
  interactiveBodyRequired: 'Body text is required',
  interactiveButtonsRequired: 'Add at least one button',
  interactiveUrlRequired: 'A valid URL is required',
  interactiveRowsRequired: 'Add at least one row',

  download: 'Download',
  openInNewTab: 'Open',
  removeAttachment: 'Remove attachment',
  retryUpload: 'Retry upload',
  cancelUpload: 'Cancel upload',
  uploading: 'Uploading',
  uploadFailed: 'Upload failed',
  attachmentsLabel: 'Attachments',
  playAudio: 'Play audio message',
  fileTooLarge: (fileName, max) => `${fileName} is larger than ${max}`,
  fileInvalidType: (fileName) => `${fileName} is not a supported file type`,
  tooManyFiles: (max) => `You can attach at most ${max} ${max === 1 ? 'file' : 'files'}`,
  mediaUnavailable: 'Media is unavailable',

  contactPanelTitle: 'Contact details',
  contactPanelToggle: 'Toggle contact details',
  contactPhoneNumber: 'Phone number',
  contactEmail: 'Email',
  contactAbout: 'About',
  contactTags: 'Tags',
  contactStatus: 'Status',
  contactAssignee: 'Assignee',

  messageTypeImage: 'Photo',
  messageTypeVideo: 'Video',
  messageTypeAudio: 'Audio',
  messageTypeDocument: 'Document',
  messageTypeSticker: 'Sticker',
  messageTypeLocation: 'Location',
  messageTypeContacts: 'Contact',
  messageTypeTemplate: 'Template',
  messageTypeInteractive: 'Interactive message',
  messageTypeUnsupported: 'Unsupported message',

  retry: 'Try again',
  close: 'Close',
  cancel: 'Cancel',
  loading: 'Loading',
}

/** Partial override of the built-in labels. */
export type WhatsAppInboxLabelsOverride = Partial<WhatsAppInboxLabels>

/** Reads one label, applying an override on top of the defaults. */
export function getWhatsAppLabel<Key extends keyof WhatsAppInboxLabels>(
  key: Key,
  override?: WhatsAppInboxLabelsOverride,
): WhatsAppInboxLabels[Key] {
  return (override?.[key] ?? DEFAULT_WHATSAPP_INBOX_LABELS[key]) as WhatsAppInboxLabels[Key]
}

/** Merges one or more overrides over the defaults, later sources winning. */
export function mergeWhatsAppLabels(
  ...overrides: (WhatsAppInboxLabelsOverride | undefined)[]
): WhatsAppInboxLabels {
  return overrides.reduce<WhatsAppInboxLabels>(
    (acc, override) => (override ? { ...acc, ...override } : acc),
    DEFAULT_WHATSAPP_INBOX_LABELS,
  )
}
