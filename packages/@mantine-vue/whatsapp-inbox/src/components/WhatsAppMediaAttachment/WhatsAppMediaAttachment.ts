import { factory } from '@mantine-vue/core'
import WhatsAppMediaAttachmentComponent from './WhatsAppMediaAttachment.vue'
import type { WhatsAppMediaAttachmentFactory } from './WhatsAppMediaAttachment.types'
import classes from './WhatsAppMediaAttachment.module.css'

export const WhatsAppMediaAttachment = factory<WhatsAppMediaAttachmentFactory>(
  WhatsAppMediaAttachmentComponent,
  { classes },
)

export type {
  WhatsAppMediaAttachmentEmits,
  WhatsAppMediaAttachmentFactory,
  WhatsAppMediaAttachmentOwnProps,
  WhatsAppMediaAttachmentProps,
  WhatsAppMediaAttachmentStylesNames,
} from './WhatsAppMediaAttachment.types'
