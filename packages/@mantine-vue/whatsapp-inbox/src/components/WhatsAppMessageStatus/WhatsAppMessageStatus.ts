import { factory } from '@mantine-vue/core'
import WhatsAppMessageStatusComponent from './WhatsAppMessageStatus.vue'
import type { WhatsAppMessageStatusFactory } from './WhatsAppMessageStatus.types'
import classes from './WhatsAppMessageStatus.module.css'

export const WhatsAppMessageStatus = factory<WhatsAppMessageStatusFactory>(
  WhatsAppMessageStatusComponent,
  { classes },
)

export type {
  WhatsAppMessageStatusFactory,
  WhatsAppMessageStatusOwnProps,
  WhatsAppMessageStatusProps,
  WhatsAppMessageStatusStylesNames,
} from './WhatsAppMessageStatus.types'
