import type { VNodeChild } from 'vue'
import type {
  AlignItems,
  BoxProps,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  MantineSpacing,
  StyleProp,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'
import type { VueRefTarget } from '@mantine-vue/hooks'

/** Props declared by `Flex` itself. See `FlexProps` for the full public type. */
export interface FlexOwnProps extends StylesApiProps<FlexProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Flex`.
   *
   * @default 'div'
   */
  component?: MantineElementType

  /** `gap` CSS property */
  gap?: StyleProp<MantineSpacing>

  /** `row-gap` CSS property */
  rowGap?: StyleProp<MantineSpacing>

  /** `column-gap` CSS property */
  columnGap?: StyleProp<MantineSpacing>

  /** `align-items` CSS property */
  align?: StyleProp<AlignItems>

  /** `justify-content` CSS property */
  justify?: StyleProp<JustifyContent>

  /** `flex-wrap` CSS property */
  wrap?: StyleProp<FlexWrap>

  /** `flex-direction` CSS property */
  direction?: StyleProp<FlexDirection>
}

export interface FlexProps extends Omit<BoxProps, keyof FlexOwnProps>, FlexOwnProps {}

export type FlexStylesNames = 'root'
export interface FlexSlots {
  /** Flex container content. */
  default?: () => VNodeChild
}

/** Public contract of `Flex`. `component` and `rootRef` come from the factory. */
export type FlexFactory = PolymorphicFactory<{
  props: Omit<FlexProps, 'component' | 'rootRef'>
  slots: FlexSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: FlexStylesNames
}>
