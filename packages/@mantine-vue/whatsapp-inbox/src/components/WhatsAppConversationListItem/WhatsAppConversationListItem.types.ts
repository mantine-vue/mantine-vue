import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppConversationItemSlotProps } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppConversationSummary } from '../../types'
import type { WhatsAppMessageStatusStylesNames } from '../WhatsAppMessageStatus'

export type WhatsAppConversationListItemStylesNames =
  | 'conversationItemRoot'
  | 'conversationItemAvatar'
  | 'conversationItemBody'
  | 'conversationItemTopRow'
  | 'conversationItemName'
  | 'conversationItemTime'
  | 'conversationItemBottomRow'
  | 'conversationItemPreview'
  | 'conversationItemPreviewText'
  | 'conversationItemIndicators'
  | 'conversationItemUnread'
  | 'conversationItemLabels'
  | 'conversationItemPhone'
  | WhatsAppMessageStatusStylesNames

export interface WhatsAppConversationListItemSlots {
  /** Replaces the avatar. */
  conversationAvatar?: (props: WhatsAppConversationItemSlotProps) => VNodeChild

  /** Replaces the last-message preview line. */
  conversationPreview?: (props: WhatsAppConversationItemSlotProps) => VNodeChild
}

export interface WhatsAppConversationListItemOwnProps extends StylesApiProps<WhatsAppConversationListItemFactory> {
  /** Conversation to render. */
  conversation: WhatsAppConversationSummary

  /** Whether the conversation is the selected one. */
  selected?: boolean

  /**
   * Renders the unread badge when `unreadCount` is above zero.
   * @default true
   */
  withUnreadBadge?: boolean

  /**
   * Renders the delivery state of the last outbound message before the preview text.
   * @default true
   */
  withStatus?: boolean

  /**
   * Renders the phone number under the contact name.
   * @default true
   */
  withPhoneNumber?: boolean

  /**
   * Renders the conversation labels as badges.
   * @default true
   */
  withLabels?: boolean

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppConversationListItemProps
  extends
    Omit<BoxProps, keyof WhatsAppConversationListItemOwnProps>,
    WhatsAppConversationListItemOwnProps {}

export interface WhatsAppConversationListItemEmits {
  /** Emitted when the item is activated by click or keyboard. */
  select: [conversation: WhatsAppConversationSummary]
}

export type WhatsAppConversationListItemFactory = Factory<{
  props: Omit<WhatsAppConversationListItemProps, 'rootRef'>
  slots: WhatsAppConversationListItemSlots
  emits: WhatsAppConversationListItemEmits
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: WhatsAppConversationListItemStylesNames
}>
