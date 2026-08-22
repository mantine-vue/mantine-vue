import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppUpload } from '../../types'

export type WhatsAppAttachmentPreviewStylesNames =
  | 'attachmentPreviewRoot'
  | 'attachmentPreviewThumb'
  | 'attachmentPreviewThumbImage'
  | 'attachmentPreviewBody'
  | 'attachmentPreviewName'
  | 'attachmentPreviewMeta'
  | 'attachmentPreviewProgress'
  | 'attachmentPreviewError'
  | 'attachmentPreviewActions'

export interface WhatsAppAttachmentPreviewOwnProps extends StylesApiProps<WhatsAppAttachmentPreviewFactory> {
  /** Upload to preview. Its `status` decides which actions are offered. */
  upload: WhatsAppUpload

  /**
   * Renders the remove action.
   * @default true
   */
  withRemove?: boolean

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppAttachmentPreviewProps
  extends
    Omit<BoxProps, keyof WhatsAppAttachmentPreviewOwnProps>,
    WhatsAppAttachmentPreviewOwnProps {}

export interface WhatsAppAttachmentPreviewEmits {
  /** Emitted when the attachment should be dropped from the composer. */
  remove: [upload: WhatsAppUpload]

  /** Emitted when a failed upload should be retried by the consumer. */
  retry: [upload: WhatsAppUpload]

  /** Emitted when an in-flight upload should be aborted by the consumer. */
  cancel: [upload: WhatsAppUpload]
}

export type WhatsAppAttachmentPreviewFactory = Factory<{
  props: Omit<WhatsAppAttachmentPreviewProps, 'rootRef'>
  emits: WhatsAppAttachmentPreviewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppAttachmentPreviewStylesNames
}>
