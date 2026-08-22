import { factory } from '@mantine-vue/core'
import WhatsAppConversationListItemComponent from './WhatsAppConversationListItem.vue'
import type { WhatsAppConversationListItemFactory } from './WhatsAppConversationListItem.types'
import classes from './WhatsAppConversationListItem.module.css'

export const WhatsAppConversationListItem = factory<WhatsAppConversationListItemFactory>(
  WhatsAppConversationListItemComponent,
  { classes },
)

export type {
  WhatsAppConversationListItemEmits,
  WhatsAppConversationListItemFactory,
  WhatsAppConversationListItemOwnProps,
  WhatsAppConversationListItemProps,
  WhatsAppConversationListItemSlots,
  WhatsAppConversationListItemStylesNames,
} from './WhatsAppConversationListItem.types'
