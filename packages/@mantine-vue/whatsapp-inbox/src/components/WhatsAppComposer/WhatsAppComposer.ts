import { factory } from '@mantine-vue/core'
import WhatsAppComposerComponent from './WhatsAppComposer.vue'
import type { WhatsAppComposerFactory } from './WhatsAppComposer.types'
import classes from './WhatsAppComposer.module.css'

export const WhatsAppComposer = factory<WhatsAppComposerFactory>(WhatsAppComposerComponent, {
  classes,
})

export type {
  WhatsAppComposerEmits,
  WhatsAppComposerExposed,
  WhatsAppComposerFactory,
  WhatsAppComposerOwnProps,
  WhatsAppComposerProps,
  WhatsAppComposerSlots,
  WhatsAppComposerStylesNames,
} from './WhatsAppComposer.types'
