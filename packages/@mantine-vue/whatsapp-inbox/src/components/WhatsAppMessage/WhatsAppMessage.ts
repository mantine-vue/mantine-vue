import { factory } from '@mantine-vue/core'
import WhatsAppMessageComponent from './WhatsAppMessage.vue'
import type { WhatsAppMessageFactory } from './WhatsAppMessage.types'
import classes from './WhatsAppMessage.module.css'

export const WhatsAppMessage = factory<WhatsAppMessageFactory>(WhatsAppMessageComponent, {
  classes,
})

export type {
  WhatsAppMessageEmits,
  WhatsAppMessageFactory,
  WhatsAppMessageOwnProps,
  WhatsAppMessageProps,
  WhatsAppMessageStylesNames,
} from './WhatsAppMessage.types'
