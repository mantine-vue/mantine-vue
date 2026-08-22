import { factory } from '@mantine-vue/core'
import WhatsAppInboxComponent from './WhatsAppInbox.vue'
import type { WhatsAppInboxFactory } from './WhatsAppInbox.types'
import classes from './WhatsAppInbox.module.css'

export const WhatsAppInbox = factory<WhatsAppInboxFactory>(WhatsAppInboxComponent, { classes })

export type {
  WhatsAppInboxConversationProps,
  WhatsAppInboxEmits,
  WhatsAppInboxExposed,
  WhatsAppInboxFactory,
  WhatsAppInboxLayout,
  WhatsAppInboxOwnProps,
  WhatsAppInboxProps,
  WhatsAppInboxSlots,
  WhatsAppInboxStylesNames,
} from './WhatsAppInbox.types'
