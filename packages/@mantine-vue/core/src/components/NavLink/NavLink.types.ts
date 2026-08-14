import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineSpacing,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'

export type NavLinkStylesNames =
  | 'root'
  | 'section'
  | 'body'
  | 'label'
  | 'description'
  | 'chevron'
  | 'collapse'
  | 'children'
export type NavLinkVariant = 'filled' | 'light' | 'subtle'

/** Props declared by `NavLink` itself. See `NavLinkProps` for the full public type. */
export interface NavLinkOwnProps extends StylesApiProps<NavLinkProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `NavLink`.
   *
   * @default 'a'
   */
  component?: MantineElementType

  /** Main link label. Can also be set with the `label` slot – the slot takes precedence over the prop. */
  label?: MantineNode

  /**
   * Link description, displayed below the label.
   * Can also be set with the `description` slot – the slot takes precedence over the prop.
   */
  description?: MantineNode

  /**
   * Section displayed on the left side of the label.
   * Can also be set with the `leftSection` slot – the slot takes precedence over the prop.
   */
  leftSection?: MantineNode

  /**
   * Section displayed on the right side of the label.
   * Can also be set with the `rightSection` slot – the slot takes precedence over the prop.
   */
  rightSection?: MantineNode

  /**
   * Determines whether the link should have active styles
   *
   * @default false
   */
  active?: boolean

  /**
   * Key of `theme.colors` or any valid CSS color to control active styles
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * If set, label and description are truncated with ellipsis instead of wrapping
   *
   * @default false
   */
  noWrap?: boolean

  /** Controlled nested items collapse state. Bound with `v-model:opened`. */
  opened?: boolean

  /** Uncontrolled nested items collapse initial state */
  defaultOpened?: boolean

  /**
   * If set, right section will not be rotated when collapse is opened
   *
   * @default false
   */
  disableRightSectionRotation?: boolean

  /**
   * Controls indentation of nested NavLink components, key of `theme.spacing` or any valid CSS value
   *
   * @default 'lg'
   */
  childrenOffset?: MantineSpacing

  /**
   * If set, disabled styles will be added to the root element
   *
   * @default false
   */
  disabled?: boolean

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** If set to `false`, child `NavLinks` are unmounted when collapsed */
  keepMounted?: boolean

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: NavLinkVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface NavLinkSlots {
  /** Nested `NavLink` components. */
  default?: () => VNodeChild
  /** Main link label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild
  /** Link description. Takes precedence over the `description` prop. */
  description?: () => VNodeChild
  /** Left section. Takes precedence over the `leftSection` prop. */
  leftSection?: () => VNodeChild
  /** Right section. Takes precedence over the `rightSection` prop. */
  rightSection?: () => VNodeChild
}

export interface NavLinkProps extends Omit<BoxProps, keyof NavLinkOwnProps>, NavLinkOwnProps {}

export type NavLinkCssVariables = {
  root: '--nl-color' | '--nl-bg' | '--nl-hover'
  children: '--nl-offset'
}
export interface NavLinkEmits {
  /** Emitted when the collapsible section is opened or closed. */
  'update:opened': [opened: boolean]
}

/** Public contract of `NavLink`. `component` and `rootRef` come from the factory. */
export type NavLinkFactory = PolymorphicFactory<{
  props: Omit<NavLinkProps, 'component' | 'rootRef'>
  slots: NavLinkSlots
  emits: NavLinkEmits
  ref: HTMLAnchorElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'a'
  defaultRef: HTMLAnchorElement
  stylesNames: NavLinkStylesNames
  vars: NavLinkCssVariables
  variant: NavLinkVariant
}>
