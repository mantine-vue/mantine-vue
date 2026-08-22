import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppConversationSummary } from '../../types'

export type WhatsAppConversationHeaderStylesNames =
  | 'conversationHeaderRoot'
  | 'conversationHeaderBack'
  | 'conversationHeaderAvatar'
  | 'conversationHeaderBody'
  | 'conversationHeaderName'
  | 'conversationHeaderSubtitle'
  | 'conversationHeaderActions'

export interface WhatsAppConversationHeaderSlots {
  /** Replaces the whole header content. */
  default?: (props: { conversation: WhatsAppConversationSummary | undefined }) => VNodeChild

  /** Rendered at the end of the header, before the contact panel toggle. */
  headerActions?: (props: { conversation: WhatsAppConversationSummary | undefined }) => VNodeChild
}

export interface WhatsAppConversationHeaderOwnProps extends StylesApiProps<WhatsAppConversationHeaderFactory> {
  /** Conversation being shown. */
  conversation?: WhatsAppConversationSummary

  /**
   * Renders the back control, used by the narrow layout and by the drawer.
   * @default false
   */
  withBack?: boolean

  /**
   * Renders the control that toggles the contact panel.
   * @default false
   */
  withContactToggle?: boolean

  /** Whether the contact panel is open, used for the toggle aria-expanded state. */
  contactPanelOpened?: boolean

  /**
   * Text under the contact name. Falls back to the phone number, which is what makes two
   * contacts with the same name distinguishable.
   */
  subtitle?: string

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppConversationHeaderProps
  extends
    Omit<BoxProps, keyof WhatsAppConversationHeaderOwnProps>,
    WhatsAppConversationHeaderOwnProps {}

export interface WhatsAppConversationHeaderEmits {
  /** Emitted when the back control is used. */
  back: []

  /** Emitted when the contact panel toggle is used, with the state it should move to. */
  toggleContactPanel: [opened: boolean]

  /** Emitted when the contact name or avatar is activated. */
  contactClick: [conversation: WhatsAppConversationSummary]
}

export type WhatsAppConversationHeaderFactory = Factory<{
  props: Omit<WhatsAppConversationHeaderProps, 'rootRef'>
  slots: WhatsAppConversationHeaderSlots
  emits: WhatsAppConversationHeaderEmits
  ref: HTMLElement
  element: 'header'
  stylesNames: WhatsAppConversationHeaderStylesNames
}>
