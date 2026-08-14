import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSize, StylesApiProps, Factory } from '../../../core'

export interface PillGroupContextValue {
  size?: MantineSize | (string & {}) | number
  disabled?: boolean
}

/** Props declared by `PillGroup` itself. See `PillGroupProps` for the full public type. */
export interface PillGroupOwnProps extends StylesApiProps<PillGroupFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Controls spacing between pills, by default controlled by `size` */
  gap?: MantineSize | (string & {}) | number

  /**
   * Controls size of the child `Pill` components and gap between them
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {})

  /** If set, adds disabled to all child `Pill` components */
  disabled?: boolean
}

export interface PillGroupProps
  extends Omit<BoxProps, keyof PillGroupOwnProps>, PillGroupOwnProps {}

export interface PillGroupSlots {
  /** Pill components contained by the group. */
  default?: () => VNodeChild
}

export type PillGroupStylesNames = 'group'

export type PillGroupCssVariables = {
  group: '--pg-gap'
}

export type PillGroupFactory = Factory<{
  props: Omit<PillGroupProps, 'rootRef'>
  ref: HTMLDivElement
  slots: PillGroupSlots
  element: 'div'
  stylesNames: PillGroupStylesNames
  vars: PillGroupCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
