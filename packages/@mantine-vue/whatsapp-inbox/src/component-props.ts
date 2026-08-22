import type { VNodeChild } from 'vue'
import type { EmitsToProps } from '@mantine-vue/core'
import type {
  WhatsAppAttachment,
  WhatsAppContact,
  WhatsAppConversationSummary,
  WhatsAppMessageData,
  WhatsAppTemplate,
  WhatsAppUpload,
} from './types'

/**
 * Props forwarded to a component the inbox renders internally, plus the `on*` listeners for its
 * events so a nested object can subscribe to them.
 *
 * `rootRef` is dropped because it only makes sense on an element the consumer owns, and because
 * the factory narrows it to a concrete element type a `Partial<…Props>` cannot satisfy.
 */
export type ForwardedProps<Props, Emits = Record<never, never>> = Partial<Omit<Props, 'rootRef'>> &
  EmitsToProps<Emits>

/**
 * Replaces the rendering of one message.
 *
 * The counterpart of the `message` slot. Returning `undefined` uses the built-in renderer.
 */
export type RenderMessage = (message: WhatsAppMessageData) => VNodeChild | undefined

/** Replaces the content of one message bubble, keeping the bubble, footer and status. */
export type RenderMessageContent = (message: WhatsAppMessageData) => VNodeChild | undefined

/** Scoped slots that mirror the message render props. Slots take precedence over the props. */
export interface WhatsAppMessageSlots {
  /** Replaces a message entirely, bubble included. Takes precedence over `renderMessage`. */
  message?: (props: { message: WhatsAppMessageData }) => VNodeChild

  /** Replaces the content inside a bubble. Takes precedence over `renderMessageContent`. */
  messageContent?: (props: { message: WhatsAppMessageData }) => VNodeChild

  /** Appended inside the bubble, under the content and before the timestamp row. */
  messageFooter?: (props: { message: WhatsAppMessageData }) => VNodeChild

  /** Replaces the media renderer of a received attachment. */
  mediaAttachment?: (props: {
    attachment: WhatsAppAttachment
    message: WhatsAppMessageData
  }) => VNodeChild
}

/** The `renderMessage` / `renderMessageContent` pair passed down to each message. */
export interface MessageRenderers {
  /**
   * Replaces the rendering of a message, bubble included. Returning `undefined` falls back to the
   * built-in renderer. Can also be set with the `message` slot, which takes precedence.
   */
  renderMessage?: RenderMessage

  /**
   * Replaces the content inside a message bubble, keeping the bubble, timestamp and delivery
   * state. Can also be set with the `messageContent` slot, which takes precedence.
   */
  renderMessageContent?: RenderMessageContent
}

/**
 * Folds the message scoped slots into the equivalent render props, so a list forwards one object
 * to every message instead of re-declaring the slots at each call site.
 */
export function resolveMessageRenderers(
  props: MessageRenderers,
  slots: WhatsAppMessageSlots,
): MessageRenderers {
  return {
    renderMessage: slots.message ? (message) => slots.message!({ message }) : props.renderMessage,
    renderMessageContent: slots.messageContent
      ? (message) => slots.messageContent!({ message })
      : props.renderMessageContent,
  }
}

/** Slot props of the conversation list item slots. */
export interface WhatsAppConversationItemSlotProps {
  conversation: WhatsAppConversationSummary
  selected: boolean
}

/** Slots shared by the conversation list and the full inbox. */
export interface WhatsAppConversationListSlots {
  /** Replaces a whole conversation list item. */
  conversationItem?: (props: WhatsAppConversationItemSlotProps) => VNodeChild

  /** Replaces the avatar of a list item. */
  conversationAvatar?: (props: WhatsAppConversationItemSlotProps) => VNodeChild

  /** Replaces the last-message preview of a list item. */
  conversationPreview?: (props: WhatsAppConversationItemSlotProps) => VNodeChild

  /** Rendered above the search field. */
  listHeader?: () => VNodeChild

  /** Rendered under the list, after the load-more control. */
  listFooter?: () => VNodeChild

  /** Replaces the empty state of the list. */
  emptyInbox?: () => VNodeChild

  /** Replaces the loading state of the list. */
  loadingInbox?: () => VNodeChild

  /** Replaces the error state of the list. */
  errorInbox?: (props: { error: string }) => VNodeChild

  /** Rendered next to the search field, for custom filter controls. */
  filters?: () => VNodeChild
}

/** Slots of the conversation view, shared with the inbox, modal and drawer. */
export interface WhatsAppConversationSlots extends WhatsAppMessageSlots {
  /** Replaces the conversation header. */
  conversationHeader?: (props: {
    conversation: WhatsAppConversationSummary | undefined
  }) => VNodeChild

  /** Rendered at the end of the conversation header, before the contact panel toggle. */
  headerActions?: (props: { conversation: WhatsAppConversationSummary | undefined }) => VNodeChild

  /** Replaces the empty state shown when the conversation has no messages. */
  emptyConversation?: () => VNodeChild

  /** Replaces the loading state of the message history. */
  loadingMessages?: () => VNodeChild

  /** Replaces the error state of the message history. */
  errorMessages?: (props: { error: string }) => VNodeChild

  /** Rendered before the composer input, after the attachment control. */
  composerPrefix?: () => VNodeChild

  /** Rendered after the composer input, before the send control. */
  composerSuffix?: () => VNodeChild

  /** Replaces the composer action row. */
  composerActions?: () => VNodeChild

  /** Emoji picker rendered in the composer emoji popover. */
  emojiPicker?: (props: { insert: (emoji: string) => void; close: () => void }) => VNodeChild

  /** Replaces the preview of one staged attachment. */
  attachmentPreview?: (props: { upload: WhatsAppUpload }) => VNodeChild

  /** Replaces the preview of a template inside the template selector. */
  templatePreview?: (props: { template: WhatsAppTemplate }) => VNodeChild
}

/** Slots of the contact panel. */
export interface WhatsAppContactPanelSlots {
  /** Rendered above the built-in contact fields. */
  contactPanelHeader?: (props: { contact: WhatsAppContact }) => VNodeChild

  /** Replaces the whole contact panel body. */
  contactPanel?: (props: { contact: WhatsAppContact }) => VNodeChild

  /** Rendered under the built-in contact fields. */
  contactPanelFooter?: (props: { contact: WhatsAppContact }) => VNodeChild
}
