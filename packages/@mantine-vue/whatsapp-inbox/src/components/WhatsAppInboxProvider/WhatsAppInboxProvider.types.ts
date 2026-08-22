import type { VNodeChild } from 'vue'
import type { WhatsAppInboxFormatters } from '../../WhatsAppInbox.context'
import type { WhatsAppInboxLabelsOverride } from '../../labels'

/** Props accepted by `WhatsAppInboxProvider`. */
export interface WhatsAppInboxProviderProps {
  /** Overrides for the built-in labels, applied to every component below the provider. */
  labels?: WhatsAppInboxLabelsOverride

  /** BCP 47 locale used by the built-in date and time formatters. */
  locale?: string

  /** Replaces individual formatters, for example to render times in the contact's timezone. */
  formatters?: Partial<WhatsAppInboxFormatters>
}

export interface WhatsAppInboxProviderSlots {
  /** Subtree the configuration applies to. */
  default?: () => VNodeChild
}
