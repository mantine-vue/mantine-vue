import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  ForwardedProps,
  MessageRenderers,
  WhatsAppConversationSlots,
} from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppAttachment,
  WhatsAppAttachmentsAddPayload,
  WhatsAppConversationData,
  WhatsAppConversationCapabilities,
  WhatsAppDraftBehavior,
  WhatsAppLoadMorePayload,
  WhatsAppMessageData,
  WhatsAppMessageReference,
  WhatsAppOutgoingMessage,
  WhatsAppPaginationState,
  WhatsAppRejectedFile,
  WhatsAppTemplate,
  WhatsAppUpload,
} from '../../types'
import type { WhatsAppComposerProps, WhatsAppComposerStylesNames } from '../WhatsAppComposer'
import type {
  WhatsAppConversationHeaderProps,
  WhatsAppConversationHeaderStylesNames,
} from '../WhatsAppConversationHeader'
import type {
  WhatsAppMessageListProps,
  WhatsAppMessageListStylesNames,
} from '../WhatsAppMessageList'

export type WhatsAppConversationStylesNames =
  | 'conversationRoot'
  | 'conversationState'
  | WhatsAppConversationHeaderStylesNames
  | WhatsAppMessageListStylesNames
  | WhatsAppComposerStylesNames

export interface WhatsAppConversationOwnProps
  extends StylesApiProps<WhatsAppConversationFactory>, MessageRenderers {
  /** Conversation to show. Its `capabilities` drive the composer unless overridden. */
  conversation?: WhatsAppConversationData

  /**
   * Conversation the outgoing payloads are addressed to. Falls back to `conversation.id`, and
   * is what makes the modal usable with nothing but an id and a message list.
   */
  conversationId?: string

  /** Overrides the capabilities of `conversation`. */
  capabilities?: WhatsAppConversationCapabilities

  /** Messages of the conversation, in display order. */
  messages?: WhatsAppMessageData[]

  /** Whether the initial message load is in flight. */
  messagesLoading?: boolean

  /** Failure of the last message load. */
  messagesError?: string | null

  /** Cursor state of the older-messages pagination. */
  messagesPagination?: WhatsAppPaginationState

  /** Attachments staged in the composer. */
  uploads?: WhatsAppUpload[]

  /** Approved templates offered by the composer. */
  templates?: WhatsAppTemplate[]

  /** Whether the template list is loading. */
  templatesLoading?: boolean

  /** Failure of the last template load. */
  templatesError?: string | null

  /**
   * Controlled composer draft for a single conversation. When set it wins over `drafts`, which
   * is what the modal and drawer use: they only ever show one conversation.
   */
  draft?: string

  /**
   * Controlled drafts, keyed by conversation id. This is how an unsent message survives a switch
   * to another conversation and is restored on return.
   */
  drafts?: Record<string, string>

  /** Uncontrolled initial drafts, keyed by conversation id. */
  defaultDrafts?: Record<string, string>

  /**
   * What happens to an unsent draft when the conversation changes.
   *
   * `preserve` keeps one draft per conversation and restores it on return. `reset` drops the
   * draft of the conversation being left. Ignored while `draft` is controlled, since the
   * consumer owns the value in that case.
   *
   * @default 'preserve'
   */
  draftBehavior?: WhatsAppDraftBehavior

  /** Whether a send is in flight. */
  sending?: boolean

  /** Failure of the last send. */
  sendError?: string | null

  /** Message the draft replies to. */
  replyTo?: WhatsAppMessageReference | null

  /**
   * Renders the conversation header.
   * @default true
   */
  withHeader?: boolean

  /**
   * Renders the composer.
   * @default true
   */
  withComposer?: boolean

  /**
   * Renders the back control in the header.
   * @default false
   */
  withBack?: boolean

  /**
   * Renders the contact panel toggle in the header.
   * @default false
   */
  withContactToggle?: boolean

  /** Whether the contact panel is open, for the header toggle. */
  contactPanelOpened?: boolean

  /**
   * Moves focus to the composer when the conversation changes, so typing can start immediately
   * after picking a conversation with the keyboard.
   * @default true
   */
  focusComposerOnChange?: boolean

  /** Props passed to the underlying `WhatsAppConversationHeader`. */
  headerProps?: ForwardedProps<WhatsAppConversationHeaderProps>

  /** Props passed to the underlying `WhatsAppMessageList`. */
  messageListProps?: ForwardedProps<WhatsAppMessageListProps>

  /** Props passed to the underlying `WhatsAppComposer`. */
  composerProps?: ForwardedProps<WhatsAppComposerProps>

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppConversationProps
  extends Omit<BoxProps, keyof WhatsAppConversationOwnProps>, WhatsAppConversationOwnProps {}

export interface WhatsAppConversationEmits {
  /** Emitted when the composer draft changes. */
  'update:draft': [draft: string]

  /** Emitted with the full draft map whenever a draft changes or is dropped. */
  'update:drafts': [drafts: Record<string, string>]

  /** Emitted when the reply target changes. */
  'update:replyTo': [replyTo: WhatsAppMessageReference | null]

  /** Emitted whenever the draft changes, for typing indicators. */
  typing: [value: string]

  /** Emitted when a message should be sent. */
  send: [payload: WhatsAppOutgoingMessage]

  /** Emitted with the files that passed validation, for the consumer to upload. */
  attachmentsAdd: [payload: WhatsAppAttachmentsAddPayload]

  /** Emitted when files were refused by the configured constraints. */
  attachmentsReject: [rejected: WhatsAppRejectedFile[]]

  /** Emitted when a staged attachment should be dropped. */
  attachmentRemove: [upload: WhatsAppUpload]

  /** Emitted when a failed upload should be retried. */
  attachmentRetry: [upload: WhatsAppUpload]

  /** Emitted when an in-flight upload should be aborted. */
  attachmentCancel: [upload: WhatsAppUpload]

  /** Emitted when the composer refuses to send. */
  validationError: [message: string]

  /** Emitted when the retry action of a send error is used. */
  retrySend: []

  /** Emitted when the retry action of a template load error is used. */
  templatesRetryLoad: []

  /** Emitted when older messages should be fetched. */
  loadOlderMessages: [payload: WhatsAppLoadMorePayload]

  /** Emitted when the retry action of the message-history error state is used. */
  retryLoadMessages: []

  /** Emitted when the retry action of a failed message is used. */
  retryMessage: [message: WhatsAppMessageData]

  /** Emitted when the download action of an attachment is used. */
  mediaDownload: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]

  /** Emitted when an image or sticker is activated. */
  mediaPreview: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]

  /** Emitted when the header back control is used. */
  back: []

  /** Emitted when the contact panel toggle is used. */
  toggleContactPanel: [opened: boolean]

  /** Emitted when the header contact is activated. */
  contactClick: [conversation: WhatsAppConversationData]

  /** Emitted when the user reaches or leaves the bottom of the history. */
  atBottomChange: [atBottom: boolean]
}

export interface WhatsAppConversationExposed {
  /** Moves focus to the composer input. */
  focusComposer: () => void

  /** Scrolls the history to the newest message. */
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

export type WhatsAppConversationFactory = Factory<{
  props: Omit<WhatsAppConversationProps, 'rootRef'>
  slots: WhatsAppConversationSlots
  emits: WhatsAppConversationEmits
  exposed: WhatsAppConversationExposed
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppConversationStylesNames
}>
