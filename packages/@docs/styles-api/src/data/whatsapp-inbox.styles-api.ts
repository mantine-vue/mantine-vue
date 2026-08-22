import type { StylesApiData } from '../types'

/**
 * Styles API documentation for `@mantine-vue/whatsapp-inbox`.
 *
 * Each record documents the selectors the component renders itself. Composite components forward
 * their `classNames`, `styles` and `unstyled` props to the primitives they render, so the
 * selectors of a nested component are documented on that component's own page.
 */

export const WhatsAppInboxStylesApi: StylesApiData<
  'inboxMain' | 'inboxPanel' | 'inboxRoot' | 'inboxSidebar'
> = {
  selectors: {
    inboxRoot: 'Root element, the grid that lays out the three panes',
    inboxSidebar: '`WhatsAppConversationList` pane',
    inboxMain: 'Wrapper of the `WhatsAppConversation` pane',
    inboxPanel: '`WhatsAppContactPanel` pane',
  },
  vars: {
    inboxRoot: {
      '--wa-sidebar-width': 'Controls `width` of the conversation list pane',
      '--wa-panel-width': 'Controls `width` of the contact panel pane',
    },
  },
  modifiers: [
    {
      modifier: 'data-narrow',
      selector: 'inboxRoot',
      condition: 'Component is narrower than `narrowBreakpoint`, or `layout` is `single`',
    },
    {
      modifier: 'data-with-panel',
      selector: 'inboxRoot',
      condition: 'Contact panel is rendered',
    },
  ],
}

export const WhatsAppConversationStylesApi: StylesApiData<
  'conversationRoot' | 'conversationState'
> = {
  selectors: {
    conversationRoot: 'Root element',
    conversationState: 'Wrapper of the state shown when no conversation is selected',
  },
  vars: {},
}

export const WhatsAppConversationHeaderStylesApi: StylesApiData<
  | 'conversationHeaderActions'
  | 'conversationHeaderAvatar'
  | 'conversationHeaderBack'
  | 'conversationHeaderBody'
  | 'conversationHeaderName'
  | 'conversationHeaderRoot'
  | 'conversationHeaderSubtitle'
> = {
  selectors: {
    conversationHeaderRoot: 'Root element (`header` tag)',
    conversationHeaderBack: 'Back control, rendered when `withBack` is set',
    conversationHeaderAvatar: 'Contact `Avatar`',
    conversationHeaderBody: 'Button wrapping the contact name and subtitle',
    conversationHeaderName: 'Contact name',
    conversationHeaderSubtitle: 'Subtitle under the contact name, the phone number by default',
    conversationHeaderActions: 'Wrapper of the header actions and the contact panel toggle',
  },
  vars: {},
}

export const WhatsAppConversationListStylesApi: StylesApiData<
  | 'conversationListFilters'
  | 'conversationListFooter'
  | 'conversationListHeader'
  | 'conversationListItemWrapper'
  | 'conversationListNewButton'
  | 'conversationListTitleRow'
  | 'newConversationActions'
  | 'newConversationForm'
  | 'conversationListItems'
  | 'conversationListLoadMore'
  | 'conversationListRoot'
  | 'conversationListScrollArea'
  | 'conversationListSearch'
  | 'conversationListState'
  | 'conversationListTitle'
> = {
  selectors: {
    conversationListRoot: 'Root element',
    conversationListHeader: 'Header containing the title, search field and filters',
    conversationListTitleRow: 'Row holding the list title and the new-conversation control',
    conversationListTitle: 'List title',
    conversationListNewButton: 'Control that opens the new-conversation form',
    newConversationForm: 'New-conversation form inside the dialog',
    newConversationActions: 'Cancel and submit controls of the new-conversation form',
    conversationListSearch: 'Search `TextInput`',
    conversationListFilters: 'Wrapper of the filter controls',
    conversationListScrollArea: '`ScrollArea` around the list',
    conversationListItems: 'List element (`ul` tag)',
    conversationListItemWrapper: 'List item element (`li` tag)',
    conversationListLoadMore: 'Wrapper of the load-more control',
    conversationListState: 'Wrapper of the loading, error and empty states',
    conversationListFooter: 'Wrapper of the `listFooter` slot',
  },
  vars: {},
}

export const WhatsAppConversationListItemStylesApi: StylesApiData<
  | 'conversationItemAvatar'
  | 'conversationItemBody'
  | 'conversationItemBottomRow'
  | 'conversationItemIndicators'
  | 'conversationItemLabels'
  | 'conversationItemName'
  | 'conversationItemPhone'
  | 'conversationItemPreview'
  | 'conversationItemPreviewText'
  | 'conversationItemRoot'
  | 'conversationItemTime'
  | 'conversationItemTopRow'
  | 'conversationItemUnread'
> = {
  selectors: {
    conversationItemRoot: 'Root element (`button` tag)',
    conversationItemAvatar: 'Contact `Avatar`',
    conversationItemBody: 'Wrapper of everything next to the avatar',
    conversationItemTopRow: 'Row containing the contact name and the timestamp',
    conversationItemName: 'Contact name',
    conversationItemTime: 'Timestamp of the last activity',
    conversationItemPhone: 'Phone number, rendered under the name when it differs from it',
    conversationItemBottomRow: 'Row containing the preview, indicators and unread badge',
    conversationItemPreview: 'Wrapper of the delivery state and the preview text',
    conversationItemPreviewText: 'Last message preview text',
    conversationItemIndicators: 'Wrapper of the pinned and muted icons',
    conversationItemUnread: 'Unread count `Badge`',
    conversationItemLabels: 'Wrapper of the conversation label badges',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-selected',
      selector: 'conversationItemRoot',
      condition: '`selected` prop is set',
    },
    {
      modifier: 'data-unread',
      selector: 'conversationItemRoot',
      condition: '`conversation.unreadCount` is above zero',
    },
  ],
}

export const WhatsAppContactPanelStylesApi: StylesApiData<
  | 'contactPanelBody'
  | 'contactPanelEmpty'
  | 'contactPanelField'
  | 'contactPanelFieldLabel'
  | 'contactPanelFieldValue'
  | 'contactPanelFooter'
  | 'contactPanelHeader'
  | 'contactPanelIdentity'
  | 'contactPanelName'
  | 'contactPanelPhone'
  | 'contactPanelRoot'
  | 'contactPanelTags'
  | 'contactPanelTitle'
> = {
  selectors: {
    contactPanelRoot: 'Root element (`aside` tag)',
    contactPanelHeader: 'Panel header containing the title and close control',
    contactPanelTitle: 'Panel title',
    contactPanelBody: 'Scrollable body of the panel',
    contactPanelIdentity: 'Avatar, name and phone number block',
    contactPanelName: 'Contact name',
    contactPanelPhone: 'Contact phone number',
    contactPanelField: 'Wrapper of one labelled field',
    contactPanelFieldLabel: 'Field label',
    contactPanelFieldValue: 'Field value',
    contactPanelTags: 'Wrapper of the contact tag badges',
    contactPanelFooter: 'Wrapper of the `contactPanelFooter` slot',
    contactPanelEmpty: 'State shown when no contact is supplied',
  },
  vars: {},
}

export const WhatsAppMessageListStylesApi: StylesApiData<
  | 'messageListContent'
  | 'messageListDayDivider'
  | 'messageListDayLabel'
  | 'messageListGroup'
  | 'messageListGroupItems'
  | 'messageListItem'
  | 'messageListItems'
  | 'messageListLoadOlder'
  | 'messageListRoot'
  | 'messageListScrollArea'
  | 'messageListScrollToBottom'
  | 'messageListState'
> = {
  selectors: {
    messageListRoot: 'Root element',
    messageListScrollArea: '`ScrollArea` around the history',
    messageListContent: 'Content wrapper inside the scroll viewport',
    messageListItems: 'List of days (`ol` tag) with `role="log"`',
    messageListGroup: 'One calendar day (`li` tag), the box the day divider sticks inside',
    messageListGroupItems: 'List of messages within one day (`ol` tag)',
    messageListItem: 'One message (`li` tag)',
    messageListDayDivider: 'Sticky day divider, scoped to its day group',
    messageListDayLabel: 'Day divider label',
    messageListLoadOlder: 'Wrapper of the load-older control',
    messageListState: 'Wrapper of the loading, error and empty states',
    messageListScrollToBottom: 'Floating control that scrolls to the newest message',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-first-of-run',
      selector: 'messageListItem',
      condition: 'Message starts a run of messages from the same side',
    },
  ],
}

export const WhatsAppMessageStylesApi: StylesApiData<
  | 'messageCaption'
  | 'messageContactCard'
  | 'messageContactDetail'
  | 'messageContactName'
  | 'messageInteractive'
  | 'messageInteractiveBody'
  | 'messageInteractiveButton'
  | 'messageInteractiveButtons'
  | 'messageInteractiveFooter'
  | 'messageInteractiveReply'
  | 'messageLocation'
  | 'messageLocationAddress'
  | 'messageLocationName'
  | 'messageRoot'
  | 'messageUnsupported'
> = {
  selectors: {
    messageRoot: 'Root element, the `WhatsAppMessageBubble` rendered for the message',
    messageCaption: 'Caption under a media message',
    messageInteractive: 'Wrapper of an interactive message',
    messageInteractiveBody: 'Body text of an interactive message',
    messageInteractiveFooter: 'Footer text of an interactive message',
    messageInteractiveButtons: 'Wrapper of the interactive message buttons',
    messageInteractiveButton: 'One interactive message button',
    messageInteractiveReply: 'Option the recipient picked, on an inbound interactive reply',
    messageLocation: 'Wrapper of a location message',
    messageLocationName: 'Location name',
    messageLocationAddress: 'Location address',
    messageContactCard: 'Wrapper of one shared contact card',
    messageContactName: 'Shared contact name',
    messageContactDetail: 'Shared contact phone number',
    messageUnsupported: 'Text shown for a message the backend could not normalize',
  },
  vars: {},
}

export const WhatsAppMessageBubbleStylesApi: StylesApiData<
  | 'bubble'
  | 'bubbleAuthor'
  | 'bubbleContent'
  | 'bubbleError'
  | 'bubbleErrorText'
  | 'bubbleFooter'
  | 'bubbleForwarded'
  | 'bubbleQuote'
  | 'bubbleQuoteAuthor'
  | 'bubbleQuoteText'
  | 'bubbleReaction'
  | 'bubbleReactions'
  | 'bubbleRetry'
  | 'bubbleRoot'
  | 'bubbleStatus'
  | 'bubbleTime'
  | 'systemMessage'
> = {
  selectors: {
    bubbleRoot: 'Root element, aligned by message direction',
    bubble: 'The bubble itself',
    bubbleAuthor: 'Author name, rendered in shared inboxes',
    bubbleForwarded: 'Forwarded marker',
    bubbleQuote: 'Quoted message block',
    bubbleQuoteAuthor: 'Author of the quoted message',
    bubbleQuoteText: 'Preview text of the quoted message',
    bubbleContent: 'Message content',
    bubbleFooter: 'Row containing the timestamp and delivery state',
    bubbleTime: 'Timestamp (`time` tag)',
    bubbleStatus: '`WhatsAppMessageStatus` rendered in the footer',
    bubbleReactions: 'Wrapper of the reaction chips',
    bubbleReaction: 'One reaction chip',
    bubbleError: 'Failure row under the bubble, with `role="alert"`',
    bubbleErrorText: 'Failure message text',
    bubbleRetry: 'Retry control of a failed message',
    systemMessage: 'Centred text rendered instead of a bubble when `variant` is `system`',
  },
  vars: {
    bubbleRoot: {
      '--wa-bubble-radius': 'Controls `border-radius` of the bubble',
      '--wa-bubble-max-width': 'Controls `max-width` of the bubble',
    },
  },
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'bubbleRoot',
      value: 'Value of the `direction` prop',
    },
    {
      modifier: 'data-variant',
      selector: 'bubbleRoot',
      value: 'Value of the `variant` prop',
    },
    {
      modifier: 'data-with-tail',
      selector: 'bubbleRoot',
      condition: '`withTail` is set and the bubble is not a system message',
    },
  ],
}

export const WhatsAppMessageStatusStylesApi: StylesApiData<
  'statusIcon' | 'statusLabel' | 'statusRoot'
> = {
  selectors: {
    statusRoot: 'Root element (`span` tag)',
    statusIcon: 'State icon, a different glyph per state',
    statusLabel: 'Visible state label, rendered when `withLabel` is set',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-status',
      selector: 'statusRoot',
      value: 'Value of the `status` prop',
    },
  ],
}

export const WhatsAppMediaAttachmentStylesApi: StylesApiData<
  | 'mediaAction'
  | 'mediaAudio'
  | 'mediaDocument'
  | 'mediaDocumentBody'
  | 'mediaDocumentIcon'
  | 'mediaDocumentMeta'
  | 'mediaDocumentName'
  | 'mediaFallback'
  | 'mediaImage'
  | 'mediaImageControl'
  | 'mediaRoot'
  | 'mediaVideo'
> = {
  selectors: {
    mediaRoot: 'Root element',
    mediaImageControl: 'Button wrapping an image or sticker',
    mediaImage: 'Image element',
    mediaVideo: 'Video player',
    mediaAudio: 'Audio player',
    mediaDocument: 'Document row, also used as the fallback for media without a url',
    mediaDocumentIcon: 'Icon of the document row',
    mediaDocumentBody: 'Wrapper of the document name and metadata',
    mediaDocumentName: 'Document file name',
    mediaDocumentMeta: 'Document size and duration',
    mediaAction: 'Download control',
    mediaFallback: 'Text shown when the media has no url to download',
  },
  vars: {
    mediaRoot: {
      '--wa-media-max-width': 'Controls `max-width` of images, videos and the document row',
    },
  },
  modifiers: [
    {
      modifier: 'data-media-type',
      selector: 'mediaRoot',
      value: 'Value of `attachment.mediaType`',
    },
  ],
}

export const WhatsAppAttachmentPreviewStylesApi: StylesApiData<
  | 'attachmentPreviewActions'
  | 'attachmentPreviewBody'
  | 'attachmentPreviewError'
  | 'attachmentPreviewMeta'
  | 'attachmentPreviewName'
  | 'attachmentPreviewProgress'
  | 'attachmentPreviewRoot'
  | 'attachmentPreviewThumb'
  | 'attachmentPreviewThumbImage'
> = {
  selectors: {
    attachmentPreviewRoot: 'Root element',
    attachmentPreviewThumb: 'Thumbnail container',
    attachmentPreviewThumbImage: 'Thumbnail image, rendered for image uploads',
    attachmentPreviewBody: 'Wrapper of the file name, metadata and progress bar',
    attachmentPreviewName: 'File name',
    attachmentPreviewMeta: 'File size, or the upload progress while uploading',
    attachmentPreviewProgress: 'Upload `Progress` bar',
    attachmentPreviewError: 'Upload failure message, with `role="alert"`',
    attachmentPreviewActions: 'Wrapper of the retry, cancel and remove controls',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-status',
      selector: 'attachmentPreviewRoot',
      value: 'Value of `upload.status`',
    },
  ],
}

export const WhatsAppComposerStylesApi: StylesApiData<
  | 'composerAction'
  | 'composerActions'
  | 'composerAttachments'
  | 'composerCount'
  | 'composerError'
  | 'composerFooter'
  | 'composerInput'
  | 'composerInputRow'
  | 'composerNotice'
  | 'composerReply'
  | 'composerReplyAuthor'
  | 'composerReplyBody'
  | 'composerReplyText'
  | 'composerRoot'
  | 'composerSend'
> = {
  selectors: {
    composerRoot: 'Root element',
    composerNotice: 'Messaging window notice and the disabled-reason alert',
    composerReply: 'Quote of the message the draft replies to',
    composerReplyBody: 'Wrapper of the quote author and text',
    composerReplyAuthor: 'Author of the quoted message',
    composerReplyText: 'Preview text of the quoted message',
    composerAttachments: 'Wrapper of the staged attachment previews',
    composerError: 'Send error and validation `Alert`',
    composerInputRow: 'Row containing the actions and the text input',
    composerInput: 'Message `Textarea`',
    composerActions: 'Wrapper of an action group',
    composerAction: 'One composer action control',
    composerSend: 'Send control',
    composerFooter: 'Row under the input, containing the character count',
    composerCount: 'Character count',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-exceeded',
      selector: 'composerCount',
      condition: 'Draft is longer than `capabilities.maxTextLength`',
    },
  ],
}

export const WhatsAppMessagingWindowNoticeStylesApi: StylesApiData<
  | 'windowNoticeAction'
  | 'windowNoticeBody'
  | 'windowNoticeDescription'
  | 'windowNoticeIcon'
  | 'windowNoticeRoot'
  | 'windowNoticeTitle'
> = {
  selectors: {
    windowNoticeRoot: 'Root element, with `role="status"`',
    windowNoticeIcon: 'Lock icon',
    windowNoticeBody: 'Wrapper of the title and description',
    windowNoticeTitle: 'Notice title',
    windowNoticeDescription: 'Explanation, `messagingWindow.reason` when the backend supplies one',
    windowNoticeAction: 'Wrapper of the action that opens the template selector',
  },
  vars: {},
}

export const WhatsAppTemplateSelectorStylesApi: StylesApiData<
  | 'templateSelectorControls'
  | 'templateSelectorDetail'
  | 'templateSelectorFooter'
  | 'templateSelectorForm'
  | 'templateSelectorItem'
  | 'templateSelectorItemBody'
  | 'templateSelectorItemMeta'
  | 'templateSelectorItemName'
  | 'templateSelectorList'
  | 'templateSelectorPreview'
  | 'templateSelectorRoot'
  | 'templateSelectorSection'
  | 'templateSelectorSectionTitle'
  | 'templateSelectorState'
> = {
  selectors: {
    templateSelectorRoot: 'Root element',
    templateSelectorControls: 'Search field and category filter',
    templateSelectorList: 'Template list (`ul` tag)',
    templateSelectorItem: 'One template row (`button` tag)',
    templateSelectorItemName: 'Template name',
    templateSelectorItemMeta: 'Category, language and status badges',
    templateSelectorItemBody: 'Body text preview of the template',
    templateSelectorState: 'Wrapper of the loading and empty states',
    templateSelectorDetail: 'Scrollable detail view of the selected template',
    templateSelectorPreview: 'Wrapper of the template preview',
    templateSelectorForm: 'Parameter form',
    templateSelectorSection: 'One section of the parameter form',
    templateSelectorSectionTitle: 'Title of a parameter form section',
    templateSelectorFooter: 'Footer containing the back and submit controls',
  },
  vars: {
    templateSelectorRoot: {
      '--wa-template-list-max-height': 'Controls `max-height` of the list and the detail view',
    },
  },
  modifiers: [
    {
      modifier: 'data-selected',
      selector: 'templateSelectorItem',
      condition: 'Template is the selected one',
    },
    {
      modifier: 'data-disabled',
      selector: 'templateSelectorItem',
      condition: 'Template status is not `approved`',
    },
  ],
}

export const WhatsAppTemplatePreviewStylesApi: StylesApiData<
  | 'templatePreviewBody'
  | 'templatePreviewButton'
  | 'templatePreviewButtons'
  | 'templatePreviewFallback'
  | 'templatePreviewFooter'
  | 'templatePreviewHeader'
  | 'templatePreviewHeaderMedia'
  | 'templatePreviewMeta'
  | 'templatePreviewRoot'
> = {
  selectors: {
    templatePreviewRoot: 'Root element',
    templatePreviewMeta: 'Category, language and status badges, rendered when `withMeta` is set',
    templatePreviewHeader: 'Text header of the template',
    templatePreviewHeaderMedia: 'Media header placeholder',
    templatePreviewBody: 'Body text, with the entered values substituted',
    templatePreviewFooter: 'Footer text',
    templatePreviewButtons: 'Wrapper of the template buttons',
    templatePreviewButton: 'One template button',
    templatePreviewFallback: 'Text rendered when no template definition is available',
  },
  vars: {},
}

export const WhatsAppInteractiveMessageEditorStylesApi: StylesApiData<
  | 'interactiveEditorFooter'
  | 'interactiveEditorItem'
  | 'interactiveEditorRoot'
  | 'interactiveEditorRow'
  | 'interactiveEditorSection'
  | 'interactiveEditorSectionTitle'
> = {
  selectors: {
    interactiveEditorRoot: 'Root element',
    interactiveEditorSection: 'One section of the editor',
    interactiveEditorSectionTitle: 'Section title',
    interactiveEditorRow: 'Row containing an input and its remove control',
    interactiveEditorItem: 'One list section of a list message',
    interactiveEditorFooter: 'Footer containing the cancel and submit controls',
  },
  vars: {},
}

export const WhatsAppInboxModalStylesApi: StylesApiData<
  'modalBody' | 'modalContent' | 'modalRoot'
> = {
  selectors: {
    modalRoot: '`Modal` root element',
    modalContent: '`Modal` content, laid out as a column so the body fills the dialog',
    modalBody: '`Modal` body, which holds the conversation',
  },
  vars: {
    modalBody: {
      '--wa-modal-height': 'Controls `height` of the conversation inside the dialog',
    },
  },
}

export const WhatsAppInboxDrawerStylesApi: StylesApiData<
  'drawerBody' | 'drawerContent' | 'drawerRoot'
> = {
  selectors: {
    drawerRoot: '`Drawer` root element',
    drawerContent: '`Drawer` content, laid out as a column so the composer stays at the bottom',
    drawerBody: '`Drawer` body, which holds the conversation',
  },
  vars: {},
}

export const WhatsAppEmojiPickerStylesApi: StylesApiData<
  | 'emojiPickerBody'
  | 'emojiPickerEmpty'
  | 'emojiPickerGrid'
  | 'emojiPickerGroup'
  | 'emojiPickerGroupLabel'
  | 'emojiPickerItem'
  | 'emojiPickerPreview'
  | 'emojiPickerPreviewEmoji'
  | 'emojiPickerPreviewName'
  | 'emojiPickerRoot'
  | 'emojiPickerSearch'
  | 'emojiPickerTab'
  | 'emojiPickerTabs'
> = {
  selectors: {
    emojiPickerRoot: 'Root element',
    emojiPickerSearch: 'Search `TextInput`',
    emojiPickerTabs: 'Category tab strip',
    emojiPickerTab: 'One category tab',
    emojiPickerBody: 'Scrollable area holding the category sections',
    emojiPickerGroup: 'One category section, the box its label sticks inside',
    emojiPickerGroupLabel: 'Sticky category label',
    emojiPickerGrid: 'Grid of emoji within one category',
    emojiPickerItem: 'One emoji button',
    emojiPickerEmpty: 'State shown when a search matches nothing',
    emojiPickerPreview: 'Preview row under the grid',
    emojiPickerPreviewEmoji: 'Hovered or focused emoji in the preview',
    emojiPickerPreviewName: 'Name of the hovered or focused emoji',
  },
  vars: {
    emojiPickerRoot: {
      '--wa-emoji-columns': 'Controls the number of emoji per row',
      '--wa-emoji-height': 'Controls `height` of the scrollable grid',
      '--wa-emoji-width': 'Controls `width` of the picker',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'emojiPickerTab',
      condition: 'Category is the one currently scrolled to',
    },
  ],
}
