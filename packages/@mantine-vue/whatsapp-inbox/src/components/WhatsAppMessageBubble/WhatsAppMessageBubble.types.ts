import type { VNodeChild } from 'vue'
import type { BoxProps, Factory, MantineRadius } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type {
  WhatsAppMessageAuthor,
  WhatsAppMessageDirection,
  WhatsAppMessageError,
  WhatsAppMessageReference,
  WhatsAppDeliveryStatus,
  WhatsAppReaction,
  WhatsAppTimestamp,
} from '../../types'

export type WhatsAppMessageBubbleStylesNames =
  | 'bubbleRoot'
  | 'bubble'
  | 'bubbleAuthor'
  | 'bubbleQuote'
  | 'bubbleQuoteAuthor'
  | 'bubbleQuoteText'
  | 'bubbleForwarded'
  | 'bubbleContent'
  | 'bubbleFooter'
  | 'bubbleTime'
  | 'bubbleStatus'
  | 'bubbleError'
  | 'bubbleErrorText'
  | 'bubbleRetry'
  | 'bubbleReactions'
  | 'bubbleReaction'
  | 'systemMessage'

/** How the bubble is laid out. `system` renders centred text without a bubble. */
export type WhatsAppMessageBubbleVariant = 'bubble' | 'system'

export interface WhatsAppMessageBubbleOwnProps extends StylesApiProps<WhatsAppMessageBubbleFactory> {
  /** Side the bubble is aligned to and colour it uses. */
  direction: WhatsAppMessageDirection

  /**
   * Layout of the bubble.
   * @default 'bubble'
   */
  variant?: WhatsAppMessageBubbleVariant

  /** Delivery state rendered in the footer. */
  status?: WhatsAppDeliveryStatus

  /** Time rendered in the footer. */
  timestamp?: WhatsAppTimestamp

  /** Agent who sent the message, rendered above the content in shared inboxes. */
  author?: WhatsAppMessageAuthor

  /** Quoted message rendered above the content. */
  replyTo?: WhatsAppMessageReference

  /** Renders the forwarded marker. */
  forwarded?: boolean

  /** Failure details rendered under the bubble, with a retry action when retryable. */
  error?: WhatsAppMessageError

  /**
   * Whether the retry action may be rendered at all. Comes from the conversation capabilities.
   * @default true
   */
  withRetry?: boolean

  /** Reactions rendered under the bubble. */
  reactions?: WhatsAppReaction[]

  /**
   * Draws the small tail on the first bubble of a run.
   * @default true
   */
  withTail?: boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   * @default 'lg'
   */
  radius?: MantineRadius

  /**
   * Largest width of the bubble, any valid CSS length.
   * @default '75%'
   */
  maxWidth?: string | number

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMessageBubbleProps
  extends Omit<BoxProps, keyof WhatsAppMessageBubbleOwnProps>, WhatsAppMessageBubbleOwnProps {}

export interface WhatsAppMessageBubbleSlots {
  /** Content of the bubble. */
  default?: () => VNodeChild

  /** Rendered inside the bubble, between the content and the timestamp row. */
  footer?: () => VNodeChild

  /** Replaces the quoted message block. */
  quote?: (props: { replyTo: WhatsAppMessageReference }) => VNodeChild
}

export interface WhatsAppMessageBubbleEmits {
  /** Emitted when the retry action of a failed message is used. */
  retry: []
}

export type WhatsAppMessageBubbleFactory = Factory<{
  props: Omit<WhatsAppMessageBubbleProps, 'rootRef'>
  slots: WhatsAppMessageBubbleSlots
  emits: WhatsAppMessageBubbleEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppMessageBubbleStylesNames
}>
