import { factory } from '@mantine-vue/core'
import WhatsAppConversationHeaderComponent from './WhatsAppConversationHeader.vue'
import type { WhatsAppConversationHeaderFactory } from './WhatsAppConversationHeader.types'
import classes from './WhatsAppConversationHeader.module.css'

export const WhatsAppConversationHeader = factory<WhatsAppConversationHeaderFactory>(
  WhatsAppConversationHeaderComponent,
  { classes },
)

export type {
  WhatsAppConversationHeaderEmits,
  WhatsAppConversationHeaderFactory,
  WhatsAppConversationHeaderOwnProps,
  WhatsAppConversationHeaderProps,
  WhatsAppConversationHeaderSlots,
  WhatsAppConversationHeaderStylesNames,
} from './WhatsAppConversationHeader.types'
