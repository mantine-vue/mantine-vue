import { factory } from '@mantine-vue/core'
import WhatsAppInboxDrawerComponent from './WhatsAppInboxDrawer.vue'
import type { WhatsAppInboxDrawerFactory } from './WhatsAppInboxDrawer.types'
import classes from './WhatsAppInboxDrawer.module.css'

export const WhatsAppInboxDrawer = factory<WhatsAppInboxDrawerFactory>(
  WhatsAppInboxDrawerComponent,
  { classes },
)

export type {
  WhatsAppInboxDrawerConversationProps,
  WhatsAppInboxDrawerEmits,
  WhatsAppInboxDrawerFactory,
  WhatsAppInboxDrawerOwnProps,
  WhatsAppInboxDrawerProps,
  WhatsAppInboxDrawerStylesNames,
} from './WhatsAppInboxDrawer.types'
