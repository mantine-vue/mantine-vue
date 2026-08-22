import { factory } from '@mantine-vue/core'
import WhatsAppTemplateSelectorComponent from './WhatsAppTemplateSelector.vue'
import type { WhatsAppTemplateSelectorFactory } from './WhatsAppTemplateSelector.types'
import classes from './WhatsAppTemplateSelector.module.css'

export const WhatsAppTemplateSelector = factory<WhatsAppTemplateSelectorFactory>(
  WhatsAppTemplateSelectorComponent,
  { classes },
)

export type {
  WhatsAppTemplateSelectorEmits,
  WhatsAppTemplateSelectorFactory,
  WhatsAppTemplateSelectorOwnProps,
  WhatsAppTemplateSelectorProps,
  WhatsAppTemplateSelectorSlots,
  WhatsAppTemplateSelectorStylesNames,
  WhatsAppTemplateSubmitPayload,
} from './WhatsAppTemplateSelector.types'
