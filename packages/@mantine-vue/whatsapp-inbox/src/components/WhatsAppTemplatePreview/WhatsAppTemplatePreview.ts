import { factory } from '@mantine-vue/core'
import WhatsAppTemplatePreviewComponent from './WhatsAppTemplatePreview.vue'
import type { WhatsAppTemplatePreviewFactory } from './WhatsAppTemplatePreview.types'
import classes from './WhatsAppTemplatePreview.module.css'

export const WhatsAppTemplatePreview = factory<WhatsAppTemplatePreviewFactory>(
  WhatsAppTemplatePreviewComponent,
  { classes },
)

export type {
  WhatsAppTemplatePreviewFactory,
  WhatsAppTemplatePreviewOwnProps,
  WhatsAppTemplatePreviewProps,
  WhatsAppTemplatePreviewStylesNames,
} from './WhatsAppTemplatePreview.types'
