import type { BoxProps, Factory, ModalProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ForwardedProps, WhatsAppConversationSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppConversationEmits,
  WhatsAppConversationOwnProps,
  WhatsAppConversationStylesNames,
} from '../WhatsAppConversation'

export type WhatsAppInboxModalStylesNames =
  | 'modalRoot'
  | 'modalContent'
  | 'modalBody'
  | WhatsAppConversationStylesNames

/**
 * Conversation props the modal forwards.
 *
 * The Styles API members are re-declared by the modal itself so its own `classNames` keys cover
 * both the dialog and the conversation inside it.
 */
export type WhatsAppInboxModalConversationProps = Omit<
  WhatsAppConversationOwnProps,
  'classNames' | 'styles' | 'vars' | 'unstyled' | 'labels' | 'withBack'
>

export interface WhatsAppInboxModalOwnProps
  extends StylesApiProps<WhatsAppInboxModalFactory>, WhatsAppInboxModalConversationProps {
  /** Whether the modal is open. Bind it with `v-model:opened`. */
  opened?: boolean

  /**
   * Title of the dialog. Falls back to the contact name, so the modal always has an accessible
   * name even when nothing is passed.
   */
  title?: string

  /**
   * Height of the conversation inside the dialog, any valid CSS length.
   * @default '70vh'
   */
  height?: string | number

  /**
   * Moves focus to the composer when the modal opens.
   * @default true
   */
  focusComposerOnOpen?: boolean

  /** Props passed to the underlying `Modal`. */
  modalProps?: ForwardedProps<ModalProps>

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppInboxModalProps
  extends Omit<BoxProps, keyof WhatsAppInboxModalOwnProps>, WhatsAppInboxModalOwnProps {}

export interface WhatsAppInboxModalEmits extends WhatsAppConversationEmits {
  /** Emitted when the opened state changes. */
  'update:opened': [opened: boolean]

  /** Emitted when the modal is dismissed. */
  close: []
}

export type WhatsAppInboxModalFactory = Factory<{
  props: Omit<WhatsAppInboxModalProps, 'rootRef'>
  slots: WhatsAppConversationSlots
  emits: WhatsAppInboxModalEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppInboxModalStylesNames
}>
