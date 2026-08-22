import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { MessageRenderers, WhatsAppMessageSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppAttachment, WhatsAppMessageData } from '../../types'
import type { WhatsAppMediaAttachmentStylesNames } from '../WhatsAppMediaAttachment'
import type { WhatsAppMessageBubbleStylesNames } from '../WhatsAppMessageBubble'
import type { WhatsAppTemplatePreviewStylesNames } from '../WhatsAppTemplatePreview'

export type WhatsAppMessageStylesNames =
  | 'messageRoot'
  | 'messageInteractive'
  | 'messageInteractiveBody'
  | 'messageInteractiveFooter'
  | 'messageInteractiveButtons'
  | 'messageInteractiveButton'
  | 'messageInteractiveReply'
  | 'messageCaption'
  | 'messageLocation'
  | 'messageLocationName'
  | 'messageLocationAddress'
  | 'messageContactCard'
  | 'messageContactName'
  | 'messageContactDetail'
  | 'messageUnsupported'
  | WhatsAppMessageBubbleStylesNames
  | WhatsAppMediaAttachmentStylesNames
  | WhatsAppTemplatePreviewStylesNames

export interface WhatsAppMessageOwnProps
  extends StylesApiProps<WhatsAppMessageFactory>, MessageRenderers {
  /** Message to render. Its `type` picks the content renderer. */
  message: WhatsAppMessageData

  /**
   * Whether a failed message offers a retry action. Comes from the conversation capabilities
   * when the message is rendered inside a `WhatsAppConversation`.
   * @default true
   */
  withRetry?: boolean

  /**
   * Draws the bubble tail. Turned off for the middle of a run of messages from the same side.
   * @default true
   */
  withTail?: boolean

  /** Largest width of the bubble, any valid CSS length. */
  maxWidth?: string | number

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMessageProps
  extends Omit<BoxProps, keyof WhatsAppMessageOwnProps>, WhatsAppMessageOwnProps {}

export interface WhatsAppMessageEmits {
  /** Emitted when the retry action of a failed message is used. */
  retry: [message: WhatsAppMessageData]

  /** Emitted when the download action of an attachment is used. */
  mediaDownload: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]

  /** Emitted when an image or sticker is activated, for consumers with a lightbox. */
  mediaPreview: [attachment: WhatsAppAttachment, message: WhatsAppMessageData]
}

export type WhatsAppMessageFactory = Factory<{
  props: Omit<WhatsAppMessageProps, 'rootRef'>
  slots: WhatsAppMessageSlots
  emits: WhatsAppMessageEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppMessageStylesNames
}>
