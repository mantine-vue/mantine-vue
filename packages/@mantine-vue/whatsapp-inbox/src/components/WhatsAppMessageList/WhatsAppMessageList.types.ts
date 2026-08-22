import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { MessageRenderers, WhatsAppMessageSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppAttachment,
  WhatsAppLoadMorePayload,
  WhatsAppMessageData,
  WhatsAppPaginationState,
} from '../../types'
import type { WhatsAppMessageStylesNames } from '../WhatsAppMessage'

export type WhatsAppMessageListStylesNames =
  | 'messageListRoot'
  | 'messageListScrollArea'
  | 'messageListContent'
  | 'messageListItems'
  | 'messageListGroup'
  | 'messageListGroupItems'
  | 'messageListItem'
  | 'messageListDayDivider'
  | 'messageListDayLabel'
  | 'messageListLoadOlder'
  | 'messageListState'
  | 'messageListScrollToBottom'
  | WhatsAppMessageStylesNames

export interface WhatsAppMessageListSlots extends WhatsAppMessageSlots {
  /** Replaces the empty state. */
  emptyConversation?: () => import('vue').VNodeChild

  /** Replaces the initial loading state. */
  loadingMessages?: () => import('vue').VNodeChild

  /** Replaces the error state. */
  errorMessages?: (props: { error: string }) => import('vue').VNodeChild
}

export interface WhatsAppMessageListOwnProps
  extends StylesApiProps<WhatsAppMessageListFactory>, MessageRenderers {
  /** Messages to render, in display order. The list never reorders them. */
  messages?: WhatsAppMessageData[]

  /**
   * Conversation the messages belong to. Changing it resets the scroll position and the
   * pending-messages counter, which is what makes switching conversations feel instant.
   */
  conversationId?: string

  /** Whether the initial message load is in flight. */
  loading?: boolean

  /** Failure of the last load. Renders the error state with a retry action. */
  error?: string | null

  /** Cursor state of the older-messages pagination. */
  pagination?: WhatsAppPaginationState

  /**
   * Whether failed messages offer a retry action. Falls back to the conversation capabilities.
   */
  withRetry?: boolean

  /**
   * Renders a date divider before the first message of each day.
   * @default true
   */
  withDayDividers?: boolean

  /**
   * Scrolls to the newest message when one arrives, but only while the user is already at the
   * bottom. Reading older messages is never interrupted.
   * @default true
   */
  autoScroll?: boolean

  /**
   * Distance in pixels from the bottom that still counts as "at the bottom".
   * @default 80
   */
  autoScrollThreshold?: number

  /**
   * Distance in pixels from the top at which `loadOlder` is emitted.
   * @default 120
   */
  loadOlderThreshold?: number

  /** Largest width of a message bubble, any valid CSS length. */
  bubbleMaxWidth?: string | number

  /** Props passed to the viewport element of the underlying `ScrollArea`. */
  viewportProps?: Record<string, any>

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMessageListProps
  extends Omit<BoxProps, keyof WhatsAppMessageListOwnProps>, WhatsAppMessageListOwnProps {}

export interface WhatsAppMessageListEmits {
  /** Emitted when the user scrolls near the top and older messages should be fetched. */
  loadOlder: [payload: WhatsAppLoadMorePayload]

  /** Emitted when the retry action of the error state is used. */
  retryLoad: []

  /** Emitted when the retry action of a failed message is used. */
  retryMessage: [message: WhatsAppMessageData]

  /** Emitted when the download action of an attachment is used. */
  mediaDownload: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]

  /** Emitted when an image or sticker is activated. */
  mediaPreview: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]

  /** Emitted when the user reaches or leaves the bottom of the history. */
  atBottomChange: [atBottom: boolean]
}

export interface WhatsAppMessageListExposed {
  /** Scrolls the history to the newest message. */
  scrollToBottom: (behavior?: ScrollBehavior) => void

  /** The scrollable viewport, for consumers that plug in their own virtualization. */
  getViewport: () => HTMLElement | null
}

export type WhatsAppMessageListFactory = Factory<{
  props: Omit<WhatsAppMessageListProps, 'rootRef'>
  slots: WhatsAppMessageListSlots
  emits: WhatsAppMessageListEmits
  exposed: WhatsAppMessageListExposed
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppMessageListStylesNames
}>
