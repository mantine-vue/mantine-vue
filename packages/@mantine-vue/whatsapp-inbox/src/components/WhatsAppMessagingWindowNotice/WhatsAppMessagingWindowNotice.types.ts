import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppMessagingWindow } from '../../types'

export type WhatsAppMessagingWindowNoticeStylesNames =
  | 'windowNoticeRoot'
  | 'windowNoticeIcon'
  | 'windowNoticeBody'
  | 'windowNoticeTitle'
  | 'windowNoticeDescription'
  | 'windowNoticeAction'

export interface WhatsAppMessagingWindowNoticeOwnProps extends StylesApiProps<WhatsAppMessagingWindowNoticeFactory> {
  /**
   * Window state reported by the backend. Nothing is rendered unless `state` is `closed`, so the
   * notice can be mounted unconditionally.
   */
  messagingWindow?: WhatsAppMessagingWindow

  /**
   * Renders the action that opens the template selector.
   * @default true
   */
  withTemplateAction?: boolean

  /**
   * Whether templates may actually be sent. The action is hidden when they cannot, so the
   * notice never points at something the user is not allowed to do.
   * @default true
   */
  templatesAvailable?: boolean

  /** Overrides the title. Falls back to the label. */
  title?: string

  /**
   * Overrides the explanation. Falls back to `messagingWindow.reason` and then to the label, so
   * a backend can supply its own copy per reason code.
   */
  description?: string

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMessagingWindowNoticeProps
  extends
    Omit<BoxProps, keyof WhatsAppMessagingWindowNoticeOwnProps>,
    WhatsAppMessagingWindowNoticeOwnProps {}

export interface WhatsAppMessagingWindowNoticeSlots {
  /** Replaces the notice body. */
  default?: (props: { messagingWindow: WhatsAppMessagingWindow }) => VNodeChild

  /** Replaces the action rendered next to the explanation. */
  action?: () => VNodeChild
}

export interface WhatsAppMessagingWindowNoticeEmits {
  /** Emitted when the template action is used. */
  templateAction: []
}

export type WhatsAppMessagingWindowNoticeFactory = Factory<{
  props: Omit<WhatsAppMessagingWindowNoticeProps, 'rootRef'>
  slots: WhatsAppMessagingWindowNoticeSlots
  emits: WhatsAppMessagingWindowNoticeEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppMessagingWindowNoticeStylesNames
}>
