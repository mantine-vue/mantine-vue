import type { VNodeChild } from 'vue'
import type { BoxProps, MantineRadius, StylesApiProps } from '../../core'
import type { AccordionChevronPosition, AccordionHeadingOrder } from './Accordion.context'

export type AccordionStylesNames =
  | 'root'
  | 'content'
  | 'item'
  | 'panel'
  | 'icon'
  | 'chevron'
  | 'label'
  | 'itemTitle'
  | 'control'

export type AccordionVariant = 'default' | 'contained' | 'filled' | 'separated'

export type AccordionCssVariables = {
  root: '--accordion-transition-duration' | '--accordion-chevron-size' | '--accordion-radius'
}

export interface AccordionSlots {
  /** `Accordion.Item` children. */
  default?: () => VNodeChild

  /** Chevron used by every `Accordion.Control`. Alternative to the `chevron` prop. */
  chevron?: () => VNodeChild
}

/** Props declared by `Accordion` itself. See `AccordionProps` for the full public type. */
export interface AccordionOwnProps extends StylesApiProps<AccordionProps> {
  /**
   * If set, more than one item can be open at a time and the value is an array.
   *
   * @default false
   */
  multiple?: boolean

  /** Value of the open item, or items in `multiple` mode. Bound with `v-model:value`. */
  value?: string | string[] | null

  /** Uncontrolled initial open item, or items in `multiple` mode. */
  defaultValue?: string | string[] | null

  /** Base `id` used to connect each control with its panel. Generated when not set. */
  id?: string

  /**
   * If set, arrow key navigation wraps from the last control to the first and back.
   *
   * @default true
   */
  loop?: boolean

  /** Duration of the open and close transition in ms. */
  transitionDuration?: number

  /**
   * If set, the chevron does not rotate when its item opens.
   *
   * @default false
   */
  disableChevronRotation?: boolean

  /**
   * If set, clicking the open item does not close it. Ignored in `multiple` mode.
   *
   * @default false
   */
  disableCollapse?: boolean

  /**
   * Side the chevron is rendered on.
   *
   * @default 'right'
   */
  chevronPosition?: AccordionChevronPosition

  /**
   * Size of the chevron container.
   *
   * @default 'auto'
   */
  chevronSize?: string | number

  /**
   * Size of the default chevron icon.
   *
   * @default 16
   */
  chevronIconSize?: string | number

  /** Heading level each control is wrapped in. No heading is rendered when not set. */
  order?: AccordionHeadingOrder

  /**
   * Chevron used by every control. `null` removes it.
   * Can also be set with the `chevron` slot – the slot takes precedence over the prop.
   */
  chevron?: any

  /**
   * Controls the visual representation of the accordion.
   *
   * @default 'default'
   */
  variant?: AccordionVariant

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: MantineRadius

  /** If set, the content of closed items stays mounted. */
  keepMounted?: boolean
}

export interface AccordionProps
  extends Omit<BoxProps, keyof AccordionOwnProps>, AccordionOwnProps {}
