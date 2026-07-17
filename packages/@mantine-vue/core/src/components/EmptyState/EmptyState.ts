import {
  defineComponent,
  Fragment,
  h,
  type PropType,
  type SlotsType,
  type VNode,
  type VNodeChild,
} from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  hasNode,
  resolveNode,
  useProps,
  useStyles,
  type MantineColor,
  type MantineNode,
  type MantineSize,
} from '../../core'
import { provideEmptyStateContext } from './EmptyState.context'
import { EmptyStateActions } from './EmptyStateActions/EmptyStateActions'
import { EmptyStateDescription } from './EmptyStateDescription/EmptyStateDescription'
import { EmptyStateIndicator } from './EmptyStateIndicator/EmptyStateIndicator'
import { EmptyStateTitle } from './EmptyStateTitle/EmptyStateTitle'
import classes from './EmptyState.module.css'

export type EmptyStateStylesNames =
  | 'root'
  | 'body'
  | 'indicator'
  | 'title'
  | 'description'
  | 'actions'

export type EmptyStateVariant = 'filled' | 'light'

export type EmptyStateCssVariables = {
  root:
    | '--empty-state-indicator-size'
    | '--empty-state-gap'
    | '--empty-state-title-fz'
    | '--empty-state-description-fz'
    | '--empty-state-indicator-bg'
    | '--empty-state-indicator-color'
}

export interface EmptyStateProps {
  /** Controls indicator size, gap between elements and font sizes of title and description @default 'md' */
  size?: MantineSize | (string & {})

  /** Content alignment. `center` stacks the content in a centered column, `left`/`right` place the indicator on the side with the content next to it @default 'center' */
  align?: 'left' | 'center' | 'right'

  /** Controls the indicator appearance. `filled` and `light` display a colored circular background behind the icon. If not set, the icon is displayed with dimmed color */
  variant?: EmptyStateVariant | (string & {})

  /** Key of `theme.colors` or any valid CSS color, used by `filled` and `light` variants @default theme.primaryColor */
  color?: MantineColor

  /** Title content, rendered inside `EmptyState.Title`. Can also be provided via the `#title` slot */
  title?: MantineNode

  /** Description content, rendered inside `EmptyState.Description`. Can also be provided via the `#description` slot */
  description?: MantineNode

  /** Icon or illustration, rendered inside `EmptyState.Indicator`. Can also be provided via the `#icon` slot */
  icon?: MantineNode

  /** If set, a neutral circular background is displayed behind the indicator. Setting `variant` always displays a colored background regardless of this prop @default false */
  withIndicatorBackground?: boolean

  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  mod?: any
  [key: string]: any
}

export interface EmptyStateSlots {
  default?: () => VNodeChild
  icon?: () => VNodeChild
  title?: () => VNodeChild
  description?: () => VNodeChild
}

const defaultProps = {
  size: 'md',
  align: 'center',
} satisfies Partial<EmptyStateProps>

const varsResolver = createVarsResolver<any>((theme, { size, variant, color }) => {
  const colors = variant
    ? theme.variantColorResolver({ color: color || theme.primaryColor, theme, variant })
    : null

  return {
    root: {
      '--empty-state-indicator-size': getSize(size, 'empty-state-indicator-size'),
      '--empty-state-gap': getSize(size, 'empty-state-gap'),
      '--empty-state-title-fz': getSize(size, 'empty-state-title-fz'),
      '--empty-state-description-fz': getSize(size, 'empty-state-description-fz'),
      '--empty-state-indicator-bg': colors ? colors.background : undefined,
      '--empty-state-indicator-color': colors ? colors.color : undefined,
    },
  }
})

function flattenChildren(nodes: VNodeChild[]): VNode[] {
  const flat: VNode[] = []
  const collect = (input: VNodeChild[]) => {
    input.forEach((child) => {
      if (child == null || typeof child === 'boolean') {
        return
      }
      if (Array.isArray(child)) {
        collect(child)
        return
      }
      if (typeof child === 'object' && (child as VNode).type === Fragment) {
        const inner = (child as VNode).children
        collect(Array.isArray(inner) ? (inner as VNodeChild[]) : [inner as VNodeChild])
        return
      }
      flat.push(child as VNode)
    })
  }
  collect(nodes)
  return flat
}

const EmptyStateBase = defineComponent({
  name: 'EmptyState',
  inheritAttrs: false,
  slots: Object as SlotsType<EmptyStateSlots>,
  props: {
    size: { type: String as PropType<MantineSize | (string & {})>, default: undefined },
    align: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: undefined,
    },
    variant: {
      type: String as PropType<EmptyStateVariant | (string & {})>,
      default: undefined,
    },
    color: { type: String, default: undefined },
    title: { type: null as unknown as PropType<MantineNode>, default: undefined },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    icon: { type: null as unknown as PropType<MantineNode>, default: undefined },
    withIndicatorBackground: { type: Boolean, default: undefined },
    mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('EmptyState', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'EmptyState',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    provideEmptyStateContext({
      getStyles,
      get withIndicatorBackground() {
        return props.withIndicatorBackground || !!props.variant
      },
    })

    return () => {
      const rawChildren = slots.default?.() ?? []
      const children = flattenChildren(Array.isArray(rawChildren) ? rawChildren : [rawChildren])

      const bodyChildren: VNode[] = []
      let childrenIndicator: VNode | null = null

      children.forEach((child) => {
        if (child.type === (EmptyStateIndicator as any)) {
          childrenIndicator = child
        } else {
          bodyChildren.push(child)
        }
      })

      const iconContent = resolveNode(props.icon, slots.icon)
      const indicator = hasNode(iconContent)
        ? h(EmptyStateIndicator, null, () => iconContent)
        : childrenIndicator

      const titleContent = resolveNode(props.title, slots.title)
      const descriptionContent = resolveNode(props.description, slots.description)
      const hasBody =
        hasNode(titleContent) || hasNode(descriptionContent) || bodyChildren.length > 0

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { variant: props.variant }),
          variant: props.variant,
          mod: [{ align: props.align }, props.mod],
        },
        () => [
          indicator,
          hasBody &&
            h(Box, { ...getStyles('body') }, () => [
              hasNode(titleContent) && h(EmptyStateTitle, null, () => titleContent),
              hasNode(descriptionContent) &&
                h(EmptyStateDescription, null, () => descriptionContent),
              bodyChildren,
            ]),
        ],
      )
    }
  },
})

export const EmptyState = withBoxProps(
  Object.assign(EmptyStateBase, {
    classes,
    varsResolver,
    Indicator: EmptyStateIndicator,
    Title: EmptyStateTitle,
    Description: EmptyStateDescription,
    Actions: EmptyStateActions,
  }),
)
