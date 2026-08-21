import type { BoxProps, Factory, MantineColor } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { AnyDateValue, DateLabelFormat } from '../../types'

export type CurrentTimeIndicatorStylesNames =
  | 'currentTimeIndicator'
  | 'currentTimeIndicatorLine'
  | 'currentTimeIndicatorThumb'
  | 'currentTimeIndicatorTimeBubble'

export type CurrentTimeIndicatorCssVariables = {
  currentTimeIndicator:
    | '--indicator-color'
    | '--start-offset'
    | '--end-offset'
    | '--top-offset'
    | '--time-bubble-start-offset'
    | '--time-bubble-width'
}

/**
 * Props declared by `CurrentTimeIndicator` itself. See `CurrentTimeIndicatorProps` for the
 * full public type.
 */
export interface CurrentTimeIndicatorOwnProps extends StylesApiProps<CurrentTimeIndicatorFactory> {
  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default 'red'
   */
  color?: MantineColor

  /**
   * Offset from the start of the row.
   * @default '0px'
   */
  startOffset?: string

  /**
   * Offset from the end of the row.
   * @default '0px'
   */
  endOffset?: string

  /**
   * Extra offset added to the computed vertical position.
   * @default '0px'
   */
  topOffset?: string

  /**
   * Offset of the time bubble from the start of the row.
   * @default '0px'
   */
  timeBubbleStartOffset?: string

  /**
   * If set, a bubble with the current time is displayed next to the line.
   * @default true
   */
  withTimeBubble?: boolean

  /**
   * If set, a thumb is displayed at the start of the line.
   * @default true
   */
  withThumb?: boolean

  /**
   * Format of the time displayed in the bubble.
   * @default 'HH:mm'
   */
  currentTimeFormat?: DateLabelFormat

  /**
   * Locale passed down to `dayjs` when formatting the time.
   * @default 'en'
   */
  locale?: string

  /**
   * First visible time of the day, `HH:mm:ss`.
   * @default '00:00:00'
   */
  startTime?: string

  /**
   * Last visible time of the day, `HH:mm:ss`.
   * @default '23:59:59'
   */
  endTime?: string

  /**
   * Length of one time slot in minutes. Used to align the indicator to whole slots when
   * `endTime` does not divide evenly.
   * @default 60
   */
  intervalMinutes?: number

  /**
   * Returns the current time, called on every tick. Use it to render the indicator in
   * another timezone.
   * @default () => dayjs()
   */
  getCurrentTime?: () => AnyDateValue
}

export interface CurrentTimeIndicatorProps
  extends Omit<BoxProps, keyof CurrentTimeIndicatorOwnProps>, CurrentTimeIndicatorOwnProps {}

export type CurrentTimeIndicatorFactory = Factory<{
  props: Omit<CurrentTimeIndicatorProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
  stylesNames: CurrentTimeIndicatorStylesNames
  vars: CurrentTimeIndicatorCssVariables
}>
