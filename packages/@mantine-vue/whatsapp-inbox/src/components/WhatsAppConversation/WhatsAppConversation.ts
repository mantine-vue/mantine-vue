import { factory } from '@mantine-vue/core'
import WhatsAppConversationComponent from './WhatsAppConversation.vue'
import type { WhatsAppConversationFactory } from './WhatsAppConversation.types'
import classes from './WhatsAppConversation.module.css'

export const WhatsAppConversation = factory<WhatsAppConversationFactory>(
  WhatsAppConversationComponent,
  { classes },
)

export type {
  WhatsAppConversationEmits,
  WhatsAppConversationExposed,
  WhatsAppConversationFactory,
  WhatsAppConversationOwnProps,
  WhatsAppConversationProps,
  WhatsAppConversationStylesNames,
} from './WhatsAppConversation.types'
