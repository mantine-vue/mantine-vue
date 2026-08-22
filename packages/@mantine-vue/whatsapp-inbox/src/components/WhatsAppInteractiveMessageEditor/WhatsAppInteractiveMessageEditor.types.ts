import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppInteractiveContent, WhatsAppInteractiveType } from '../../types'

export type WhatsAppInteractiveMessageEditorStylesNames =
  | 'interactiveEditorRoot'
  | 'interactiveEditorSection'
  | 'interactiveEditorSectionTitle'
  | 'interactiveEditorRow'
  | 'interactiveEditorItem'
  | 'interactiveEditorFooter'

export interface WhatsAppInteractiveMessageEditorOwnProps extends StylesApiProps<WhatsAppInteractiveMessageEditorFactory> {
  /** Controlled draft. Always a well-formed `WhatsAppInteractiveContent`. */
  modelValue?: WhatsAppInteractiveContent

  /** Uncontrolled initial draft. */
  defaultValue?: WhatsAppInteractiveContent

  /**
   * Interactive types the provider supports, from the conversation capabilities. The type
   * selector is hidden when only one is available, and the editor renders nothing when the
   * list is empty.
   * @default ['button']
   */
  interactiveTypes?: WhatsAppInteractiveType[]

  /**
   * Largest number of reply buttons a message may carry.
   * @default 3
   */
  maxButtons?: number

  /**
   * Largest number of rows a list section may carry.
   * @default 10
   */
  maxRowsPerSection?: number

  /** Disables every control. */
  disabled?: boolean

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppInteractiveMessageEditorProps
  extends
    Omit<BoxProps, keyof WhatsAppInteractiveMessageEditorOwnProps>,
    WhatsAppInteractiveMessageEditorOwnProps {}

export interface WhatsAppInteractiveMessageEditorEmits {
  /** Emitted whenever the draft changes. */
  'update:modelValue': [value: WhatsAppInteractiveContent]

  /** Emitted when the draft passes validation and should be sent. */
  submit: [value: WhatsAppInteractiveContent]

  /** Emitted when the cancel action is used. */
  cancel: []
}

export type WhatsAppInteractiveMessageEditorFactory = Factory<{
  props: Omit<WhatsAppInteractiveMessageEditorProps, 'rootRef'>
  emits: WhatsAppInteractiveMessageEditorEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppInteractiveMessageEditorStylesNames
}>
