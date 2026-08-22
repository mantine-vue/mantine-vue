import type { VNodeChild } from 'vue'
import type { BoxProps, Factory, ModalProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ForwardedProps } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppAttachmentsAddPayload,
  WhatsAppConversationCapabilities,
  WhatsAppMessageReference,
  WhatsAppOutgoingMessage,
  WhatsAppRejectedFile,
  WhatsAppTemplate,
  WhatsAppUpload,
} from '../../types'
import type { WhatsAppAttachmentPreviewStylesNames } from '../WhatsAppAttachmentPreview'
import type {
  WhatsAppEmojiPickerProps,
  WhatsAppEmojiPickerStylesNames,
} from '../WhatsAppEmojiPicker'
import type { WhatsAppInteractiveMessageEditorStylesNames } from '../WhatsAppInteractiveMessageEditor'
import type { WhatsAppMessagingWindowNoticeStylesNames } from '../WhatsAppMessagingWindowNotice'
import type { WhatsAppTemplateSelectorStylesNames } from '../WhatsAppTemplateSelector'

export type WhatsAppComposerStylesNames =
  | 'composerRoot'
  | 'composerNotice'
  | 'composerReply'
  | 'composerReplyBody'
  | 'composerReplyAuthor'
  | 'composerReplyText'
  | 'composerAttachments'
  | 'composerError'
  | 'composerInputRow'
  | 'composerInput'
  | 'composerActions'
  | 'composerAction'
  | 'composerSend'
  | 'composerFooter'
  | 'composerCount'
  | WhatsAppAttachmentPreviewStylesNames
  | WhatsAppEmojiPickerStylesNames
  | WhatsAppMessagingWindowNoticeStylesNames
  | WhatsAppTemplateSelectorStylesNames
  | WhatsAppInteractiveMessageEditorStylesNames

export interface WhatsAppComposerSlots {
  /** Rendered before the text input, after the attachment control. */
  composerPrefix?: () => VNodeChild

  /** Rendered after the text input, before the send control. */
  composerSuffix?: () => VNodeChild

  /** Replaces the whole action row, send control included. */
  composerActions?: () => VNodeChild

  /**
   * Replaces the built-in emoji picker inside the popover.
   *
   * Supplying it takes precedence over `withEmojiPicker`, so a consumer with their own picker –
   * a fuller catalogue, skin tones, localized names – drops it in without turning anything off.
   */
  emojiPicker?: (props: { insert: (emoji: string) => void; close: () => void }) => VNodeChild

  /** Replaces the preview of one staged attachment. */
  attachmentPreview?: (props: { upload: WhatsAppUpload }) => VNodeChild

  /** Replaces the preview shown inside the template selector. */
  templatePreview?: (props: { template: WhatsAppTemplate }) => VNodeChild
}

export interface WhatsAppComposerOwnProps extends StylesApiProps<WhatsAppComposerFactory> {
  /** Conversation the message is sent to. Included in every outgoing payload. */
  conversationId?: string

  /** Controlled draft text. */
  modelValue?: string

  /** Uncontrolled initial draft text. */
  defaultValue?: string

  /**
   * What may be sent in this conversation. Falls back to the surrounding
   * `WhatsAppConversation`, and then to the defaults.
   */
  capabilities?: WhatsAppConversationCapabilities

  /** Attachments staged in the composer, with the upload state the consumer reports. */
  uploads?: WhatsAppUpload[]

  /** Approved templates offered by the template selector. */
  templates?: WhatsAppTemplate[]

  /** Whether the template list is loading. */
  templatesLoading?: boolean

  /** Failure of the last template load. */
  templatesError?: string | null

  /** Controlled opened state of the template selector. */
  templatesOpened?: boolean

  /** Controlled opened state of the interactive message editor. */
  interactiveOpened?: boolean

  /** Whether a send is in flight. Disables the send control and shows a loader. */
  sending?: boolean

  /** Disables every control, whatever the capabilities say. */
  disabled?: boolean

  /** Failure of the last send, rendered above the input with a retry action. */
  error?: string | null

  /** Message the draft replies to. Rendered as a quote above the input. */
  replyTo?: WhatsAppMessageReference | null

  /** Overrides the input placeholder. */
  placeholder?: string

  /**
   * Sends the draft when Enter is pressed. Shift+Enter always inserts a newline.
   * @default true
   */
  sendOnEnter?: boolean

  /**
   * Smallest number of visible rows of the input.
   * @default 1
   */
  minRows?: number

  /**
   * Largest number of visible rows before the input scrolls.
   * @default 6
   */
  maxRows?: number

  /** Focuses the input on mount. */
  autofocus?: boolean

  /** Forces the attachment control on or off, overriding the capabilities. */
  withAttachments?: boolean

  /** Forces the template control on or off, overriding the capabilities. */
  withTemplates?: boolean

  /** Forces the emoji control on or off, overriding the capabilities. */
  withEmoji?: boolean

  /**
   * Renders the built-in `WhatsAppEmojiPicker` inside the emoji popover. Turn it off to supply
   * your own through the `emojiPicker` slot; with neither, the emoji control stays hidden rather
   * than opening an empty popover.
   * @default true
   */
  withEmojiPicker?: boolean

  /**
   * Props passed to the built-in picker: category and emoji allow-lists, block-lists, size and
   * the recently-used list.
   */
  emojiPickerProps?: ForwardedProps<WhatsAppEmojiPickerProps>

  /** Forces the interactive control on or off, overriding the capabilities. */
  withInteractive?: boolean

  /**
   * Renders the remaining character count when the capabilities define a maximum length.
   * @default true
   */
  withCharacterCount?: boolean

  /** Props passed to the `Modal` that holds the template selector. */
  templateModalProps?: ForwardedProps<ModalProps>

  /** Props passed to the `Modal` that holds the interactive message editor. */
  interactiveModalProps?: ForwardedProps<ModalProps>

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppComposerProps
  extends Omit<BoxProps, keyof WhatsAppComposerOwnProps>, WhatsAppComposerOwnProps {}

export interface WhatsAppComposerEmits {
  /** Emitted whenever the draft text changes. */
  'update:modelValue': [value: string]

  /** Emitted whenever the draft text changes, for typing indicators. */
  typing: [value: string]

  /** Emitted when the opened state of the template selector changes. */
  'update:templatesOpened': [opened: boolean]

  /** Emitted when the opened state of the interactive editor changes. */
  'update:interactiveOpened': [opened: boolean]

  /** Emitted when the reply target is cleared. */
  'update:replyTo': [replyTo: WhatsAppMessageReference | null]

  /**
   * Emitted when a message should be sent. The payload is a discriminated union on `kind`, so
   * the consumer's handler can switch over it exhaustively.
   */
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

  /** Emitted when the composer refuses to send, with the reason shown to the user. */
  validationError: [message: string]

  /** Emitted when the retry action of a send error is used. */
  retrySend: []

  /** Emitted when the retry action of a template load error is used. */
  templatesRetryLoad: []
}

export interface WhatsAppComposerExposed {
  /** Moves focus to the text input. */
  focus: () => void

  /** Inserts text at the caret, as the emoji picker does. */
  insert: (text: string) => void

  /** Opens the template selector. */
  openTemplates: () => void
}

export type WhatsAppComposerFactory = Factory<{
  props: Omit<WhatsAppComposerProps, 'rootRef'>
  slots: WhatsAppComposerSlots
  emits: WhatsAppComposerEmits
  exposed: WhatsAppComposerExposed
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppComposerStylesNames
}>
