import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type AccordionPanelStylesNames = 'panel' | 'content'

/** Props declared by `AccordionPanel` itself. See `AccordionPanelProps` for the full public type. */
export interface AccordionPanelOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** If set, overrides the Accordion-level `keepMounted` value. When undefined (default), uses Accordion's `keepMounted` setting. */
  keepMounted?: boolean

  /** Class names applied to Accordion panel elements. */
  classNames?: StylesApiProps<AccordionPanelFactory>['classNames']

  /** Inline styles applied to Accordion panel elements. */
  styles?: StylesApiProps<AccordionPanelFactory>['styles']
}

export interface AccordionPanelSlots {
  /** Panel content. */
  default?: () => VNodeChild
}

export interface AccordionPanelProps
  extends Omit<BoxProps, keyof AccordionPanelOwnProps>, AccordionPanelOwnProps {}

export type AccordionPanelFactory = Factory<{
  props: Omit<AccordionPanelProps, 'rootRef'>
  slots: AccordionPanelSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: AccordionPanelStylesNames
  compound: true
}>
