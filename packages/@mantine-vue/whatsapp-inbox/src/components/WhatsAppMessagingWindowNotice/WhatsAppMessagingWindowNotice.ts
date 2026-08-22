import { factory } from '@mantine-vue/core'
import WhatsAppMessagingWindowNoticeComponent from './WhatsAppMessagingWindowNotice.vue'
import type { WhatsAppMessagingWindowNoticeFactory } from './WhatsAppMessagingWindowNotice.types'
import classes from './WhatsAppMessagingWindowNotice.module.css'

export const WhatsAppMessagingWindowNotice = factory<WhatsAppMessagingWindowNoticeFactory>(
  WhatsAppMessagingWindowNoticeComponent,
  { classes },
)

export type {
  WhatsAppMessagingWindowNoticeEmits,
  WhatsAppMessagingWindowNoticeFactory,
  WhatsAppMessagingWindowNoticeOwnProps,
  WhatsAppMessagingWindowNoticeProps,
  WhatsAppMessagingWindowNoticeSlots,
  WhatsAppMessagingWindowNoticeStylesNames,
} from './WhatsAppMessagingWindowNotice.types'
