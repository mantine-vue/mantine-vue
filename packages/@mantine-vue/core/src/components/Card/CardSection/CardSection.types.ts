import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  StylesApiProps,
  MantineElementType,
  PolymorphicFactory,
} from '../../../core'

/** Props declared by `CardSection` itself. See `CardSectionProps` for the full public type. */
export interface CardSectionOwnProps {
  /**
   * Root element or component rendered by `CardSection`.
   *
   * @default 'div'
   */
  component?: MantineElementType

  /**
   * Adds border to the root element
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * If set, the section inherits padding from the parent `Card`
   *
   * @default false
   */
  inheritPadding?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Card elements. */
  classNames?: StylesApiProps<CardSectionFactory>['classNames']

  /** Inline styles applied to Card elements. */
  styles?: StylesApiProps<CardSectionFactory>['styles']

  /** CSS variables applied to Card elements. */
  vars?: StylesApiProps<CardSectionFactory>['vars']
}

export interface CardSectionSlots {
  /** Section content. */
  default?: () => VNodeChild
}

export interface CardSectionProps
  extends Omit<BoxProps, keyof CardSectionOwnProps>, CardSectionOwnProps {}

export type CardSectionStylesNames = 'section'

export type CardSectionFactory = PolymorphicFactory<{
  props: Omit<CardSectionProps, 'component' | 'rootRef'>
  slots: CardSectionSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: CardSectionStylesNames
  compound: true
}>
