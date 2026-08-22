import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppContactPanelSlots } from '../../component-props'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppContact, WhatsAppConversationSummary } from '../../types'

export type WhatsAppContactPanelStylesNames =
  | 'contactPanelRoot'
  | 'contactPanelHeader'
  | 'contactPanelTitle'
  | 'contactPanelBody'
  | 'contactPanelIdentity'
  | 'contactPanelName'
  | 'contactPanelPhone'
  | 'contactPanelField'
  | 'contactPanelFieldLabel'
  | 'contactPanelFieldValue'
  | 'contactPanelTags'
  | 'contactPanelFooter'
  | 'contactPanelEmpty'

export interface WhatsAppContactPanelOwnProps extends StylesApiProps<WhatsAppContactPanelFactory> {
  /** Contact to describe. Falls back to the contact of `conversation`. */
  contact?: WhatsAppContact

  /** Conversation the contact belongs to, used for the status and assignee rows. */
  conversation?: WhatsAppConversationSummary

  /**
   * Renders the close control in the panel header.
   * @default false
   */
  withCloseButton?: boolean

  /**
   * Renders the panel title.
   * @default true
   */
  withHeader?: boolean

  /** Overrides the panel title. */
  title?: string

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppContactPanelProps
  extends Omit<BoxProps, keyof WhatsAppContactPanelOwnProps>, WhatsAppContactPanelOwnProps {}

export interface WhatsAppContactPanelEmits {
  /** Emitted when the close control is used. */
  close: []
}

export type WhatsAppContactPanelFactory = Factory<{
  props: Omit<WhatsAppContactPanelProps, 'rootRef'>
  slots: WhatsAppContactPanelSlots
  emits: WhatsAppContactPanelEmits
  ref: HTMLElement
  element: 'aside'
  stylesNames: WhatsAppContactPanelStylesNames
}>
