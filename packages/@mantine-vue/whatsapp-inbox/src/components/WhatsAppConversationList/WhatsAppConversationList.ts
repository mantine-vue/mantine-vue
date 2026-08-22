import { factory } from '@mantine-vue/core'
import WhatsAppConversationListComponent from './WhatsAppConversationList.vue'
import type { WhatsAppConversationListFactory } from './WhatsAppConversationList.types'
import classes from './WhatsAppConversationList.module.css'

export const WhatsAppConversationList = factory<WhatsAppConversationListFactory>(
  WhatsAppConversationListComponent,
  { classes },
)

export type {
  WhatsAppConversationListEmits,
  WhatsAppConversationListFactory,
  WhatsAppConversationListOwnProps,
  WhatsAppConversationListProps,
  WhatsAppConversationListStylesNames,
  WhatsAppConversationOrder,
} from './WhatsAppConversationList.types'
