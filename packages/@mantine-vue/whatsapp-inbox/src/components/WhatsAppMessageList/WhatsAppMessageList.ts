import { factory } from '@mantine-vue/core'
import WhatsAppMessageListComponent from './WhatsAppMessageList.vue'
import type { WhatsAppMessageListFactory } from './WhatsAppMessageList.types'
import classes from './WhatsAppMessageList.module.css'

export const WhatsAppMessageList = factory<WhatsAppMessageListFactory>(
  WhatsAppMessageListComponent,
  { classes },
)

export type {
  WhatsAppMessageListEmits,
  WhatsAppMessageListExposed,
  WhatsAppMessageListFactory,
  WhatsAppMessageListOwnProps,
  WhatsAppMessageListProps,
  WhatsAppMessageListSlots,
  WhatsAppMessageListStylesNames,
} from './WhatsAppMessageList.types'
