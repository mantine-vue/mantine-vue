import { factory } from '@mantine-vue/core'
import WhatsAppMessageBubbleComponent from './WhatsAppMessageBubble.vue'
import type { WhatsAppMessageBubbleFactory } from './WhatsAppMessageBubble.types'
import classes from './WhatsAppMessageBubble.module.css'

export const WhatsAppMessageBubble = factory<WhatsAppMessageBubbleFactory>(
  WhatsAppMessageBubbleComponent,
  { classes },
)

export type {
  WhatsAppMessageBubbleEmits,
  WhatsAppMessageBubbleFactory,
  WhatsAppMessageBubbleOwnProps,
  WhatsAppMessageBubbleProps,
  WhatsAppMessageBubbleSlots,
  WhatsAppMessageBubbleStylesNames,
  WhatsAppMessageBubbleVariant,
} from './WhatsAppMessageBubble.types'
