import { factory } from '@mantine-vue/core'
import WhatsAppContactPanelComponent from './WhatsAppContactPanel.vue'
import type { WhatsAppContactPanelFactory } from './WhatsAppContactPanel.types'
import classes from './WhatsAppContactPanel.module.css'

export const WhatsAppContactPanel = factory<WhatsAppContactPanelFactory>(
  WhatsAppContactPanelComponent,
  { classes },
)

export type {
  WhatsAppContactPanelEmits,
  WhatsAppContactPanelFactory,
  WhatsAppContactPanelOwnProps,
  WhatsAppContactPanelProps,
  WhatsAppContactPanelStylesNames,
} from './WhatsAppContactPanel.types'
