import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppDeliveryStatus as WhatsAppMessageStatusValue } from '../../types'

export type WhatsAppMessageStatusStylesNames = 'statusRoot' | 'statusIcon' | 'statusLabel'

export interface WhatsAppMessageStatusOwnProps extends StylesApiProps<WhatsAppMessageStatusFactory> {
  /** Delivery state to render. Nothing is rendered when it is not set. */
  status?: WhatsAppMessageStatusValue

  /**
   * Also renders the state as text next to the icon. The text is always available to screen
   * readers, so this only controls whether it is visible.
   * @default false
   */
  withLabel?: boolean

  /**
   * Icon size, any valid CSS length.
   * @default '1em'
   */
  size?: string | number

  /** Label overrides, used for the state names. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppMessageStatusProps
  extends Omit<BoxProps, keyof WhatsAppMessageStatusOwnProps>, WhatsAppMessageStatusOwnProps {}

export type WhatsAppMessageStatusFactory = Factory<{
  props: Omit<WhatsAppMessageStatusProps, 'rootRef'>
  ref: HTMLSpanElement
  element: 'span'
  stylesNames: WhatsAppMessageStatusStylesNames
}>
