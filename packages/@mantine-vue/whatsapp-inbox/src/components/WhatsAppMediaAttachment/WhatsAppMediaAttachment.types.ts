import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppAttachment, WhatsAppMessageDirection } from '../../types'

export type WhatsAppMediaAttachmentStylesNames =
  | 'mediaRoot'
  | 'mediaImage'
  | 'mediaVideo'
  | 'mediaAudio'
  | 'mediaImageControl'
  | 'mediaDocument'
  | 'mediaDocumentIcon'
  | 'mediaDocumentBody'
  | 'mediaDocumentName'
  | 'mediaDocumentMeta'
  | 'mediaAction'
  | 'mediaFallback'

export interface WhatsAppMediaAttachmentOwnProps extends StylesApiProps<WhatsAppMediaAttachmentFactory> {
  /** Attachment to render. `mediaType` picks the renderer. */
  attachment: WhatsAppAttachment

  /** Direction of the message the attachment belongs to, used for the document styling. */
  direction?: WhatsAppMessageDirection

  /**
   * Whether the download action is rendered for documents and media.
   * @default true
   */
  withDownload?: boolean

  /**
   * Whether images and videos render their own player or preview.
   * Turn this off to render a compact document-style row for every media type.
   * @default true
   */
  withPreview?: boolean

  /** Largest width of an image or video, any valid CSS length. */
  maxWidth?: string | number

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMediaAttachmentProps
  extends Omit<BoxProps, keyof WhatsAppMediaAttachmentOwnProps>, WhatsAppMediaAttachmentOwnProps {}

export interface WhatsAppMediaAttachmentEmits {
  /** Emitted when the download action is used. The default link behaviour still runs. */
  download: [attachment: WhatsAppAttachment]

  /** Emitted when an image or a sticker is activated, for consumers with a lightbox. */
  preview: [attachment: WhatsAppAttachment]
}

export type WhatsAppMediaAttachmentFactory = Factory<{
  props: Omit<WhatsAppMediaAttachmentProps, 'rootRef'>
  emits: WhatsAppMediaAttachmentEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppMediaAttachmentStylesNames
}>
