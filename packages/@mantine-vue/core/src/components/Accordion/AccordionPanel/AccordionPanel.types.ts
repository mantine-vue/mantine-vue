import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type AccordionPanelStylesNames = 'panel' | 'content'

/** Props declared by `AccordionPanel` itself. See `AccordionPanelProps` for the full public type. */
export interface AccordionPanelOwnProps {
  /** If set, overrides the Accordion-level `keepMounted` value. When undefined (default), uses Accordion's `keepMounted` setting. */
  keepMounted?: boolean

  /** Class names applied to Accordion panel elements. */
  classNames?: StylesApiProps<AccordionPanelProps>['classNames']

  /** Inline styles applied to Accordion panel elements. */
  styles?: StylesApiProps<AccordionPanelProps>['styles']
}

export interface AccordionPanelSlots {
  /** Panel content. */
  default?: () => VNodeChild
}

export interface AccordionPanelProps
  extends Omit<BoxProps, keyof AccordionPanelOwnProps>, AccordionPanelOwnProps {}
