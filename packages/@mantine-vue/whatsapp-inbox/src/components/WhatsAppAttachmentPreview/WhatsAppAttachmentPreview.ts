import { factory } from '@mantine-vue/core'
import WhatsAppAttachmentPreviewComponent from './WhatsAppAttachmentPreview.vue'
import type { WhatsAppAttachmentPreviewFactory } from './WhatsAppAttachmentPreview.types'
import classes from './WhatsAppAttachmentPreview.module.css'

export const WhatsAppAttachmentPreview = factory<WhatsAppAttachmentPreviewFactory>(
  WhatsAppAttachmentPreviewComponent,
  { classes },
)

export type {
  WhatsAppAttachmentPreviewEmits,
  WhatsAppAttachmentPreviewFactory,
  WhatsAppAttachmentPreviewOwnProps,
  WhatsAppAttachmentPreviewProps,
  WhatsAppAttachmentPreviewStylesNames,
} from './WhatsAppAttachmentPreview.types'
