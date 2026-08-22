import * as inbox from './WhatsAppInbox'
import * as conversation from './WhatsAppConversation'
import * as conversationList from './WhatsAppConversationList'
import * as composer from './WhatsAppComposer'
import * as messagingWindow from './WhatsAppMessagingWindow'
import * as templates from './WhatsAppTemplates'
import * as interactive from './WhatsAppInteractive'
import * as media from './WhatsAppMedia'
import * as modalDrawer from './WhatsAppModalDrawer'
import * as customization from './WhatsAppCustomization'

export const WhatsAppInboxDemos = {
  usage: inbox.usage,
  controlled: inbox.controlled,
  drafts: inbox.drafts,
  newConversation: inbox.newConversation,
  contactPanel: inbox.contactPanel,
  narrow: inbox.narrow,
  slots: inbox.slots,
  states: inbox.states,
}

export const WhatsAppConversationDemos = {
  usage: conversation.usage,
  messageTypes: conversation.messageTypes,
  deliveryStates: conversation.deliveryStates,
  customRendering: conversation.customRendering,
  states: conversation.states,
}

export const WhatsAppConversationListDemos = {
  usage: conversationList.usage,
  filters: conversationList.filters,
  pagination: conversationList.pagination,
  item: conversationList.item,
  states: conversationList.states,
}

export const WhatsAppComposerDemos = {
  capabilities: composer.capabilities,
  sending: composer.sending,
  validation: composer.validation,
  emoji: composer.emoji,
  emojiFiltering: composer.emojiFiltering,
  emojiCustom: composer.emojiCustom,
  emojiStandalone: composer.emojiStandalone,
  reply: composer.reply,
}

export const WhatsAppMessagingWindowDemos = {
  closedWindow: messagingWindow.closedWindow,
  notice: messagingWindow.notice,
}

export const WhatsAppTemplatesDemos = {
  selector: templates.selector,
  preview: templates.preview,
  headerMedia: templates.headerMedia,
}

export const WhatsAppInteractiveDemos = {
  editor: interactive.editor,
  capabilityDriven: interactive.capabilityDriven,
  display: interactive.display,
}

export const WhatsAppMediaDemos = {
  uploads: media.uploads,
  uploadStates: media.uploadStates,
  attachments: media.attachments,
}

export const WhatsAppModalDrawerDemos = {
  modal: modalDrawer.modal,
  drawer: modalDrawer.drawer,
  restrictions: modalDrawer.restrictions,
}

export const WhatsAppCustomizationDemos = {
  contactPanel: customization.contactPanel,
  header: customization.header,
  labels: customization.labels,
  styling: customization.styling,
  composition: customization.composition,
}
