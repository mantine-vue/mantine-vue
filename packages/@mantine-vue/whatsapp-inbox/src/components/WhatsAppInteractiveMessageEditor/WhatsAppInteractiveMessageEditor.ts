import { factory } from '@mantine-vue/core'
import WhatsAppInteractiveMessageEditorComponent from './WhatsAppInteractiveMessageEditor.vue'
import type { WhatsAppInteractiveMessageEditorFactory } from './WhatsAppInteractiveMessageEditor.types'
import classes from './WhatsAppInteractiveMessageEditor.module.css'

export const WhatsAppInteractiveMessageEditor = factory<WhatsAppInteractiveMessageEditorFactory>(
  WhatsAppInteractiveMessageEditorComponent,
  {
    classes,
  },
)

export type {
  WhatsAppInteractiveMessageEditorEmits,
  WhatsAppInteractiveMessageEditorFactory,
  WhatsAppInteractiveMessageEditorOwnProps,
  WhatsAppInteractiveMessageEditorProps,
  WhatsAppInteractiveMessageEditorStylesNames,
} from './WhatsAppInteractiveMessageEditor.types'
