import { factory } from '@mantine-vue/core'
import WhatsAppInboxModalComponent from './WhatsAppInboxModal.vue'
import type { WhatsAppInboxModalFactory } from './WhatsAppInboxModal.types'
import classes from './WhatsAppInboxModal.module.css'

export const WhatsAppInboxModal = factory<WhatsAppInboxModalFactory>(WhatsAppInboxModalComponent, {
  classes,
})

export type {
  WhatsAppInboxModalConversationProps,
  WhatsAppInboxModalEmits,
  WhatsAppInboxModalFactory,
  WhatsAppInboxModalOwnProps,
  WhatsAppInboxModalProps,
  WhatsAppInboxModalStylesNames,
} from './WhatsAppInboxModal.types'
