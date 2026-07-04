import { Comment, Fragment, cloneVNode, defineComponent, h, type PropType, type VNode } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getSpacing,
  getThemeColor,
  rem,
  useProps,
  useStyles,
} from '../../core'
import { provideStepperContext } from './Stepper.context'
import { StepperCompleted } from './StepperCompleted/StepperCompleted'
import { StepperStep } from './StepperStep/StepperStep'
import classes from './Stepper.module.css'

export type StepperStylesNames =
  | 'root'
  | 'separator'
  | 'steps'
  | 'content'
  | 'step'
  | 'stepLoader'
  | 'verticalSeparator'
  | 'stepWrapper'
  | 'stepIcon'
  | 'stepCompletedIcon'
  | 'stepIconContent'
  | 'stepBody'
  | 'stepLabel'
  | 'stepDescription'

const defaultProps = {
  orientation: 'horizontal',
  iconPosition: 'left',
  allowNextStepsSelect: true,
  wrap: true,
} as const

const varsResolver = createVarsResolver<any>(
  (theme, { color, iconSize, size, contentPadding, radius, autoContrast }) => ({
    root: {
      '--stepper-color': color ? getThemeColor(color, theme) : undefined,
      '--stepper-icon-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
      '--stepper-icon-size':
        iconSize === undefined ? getSize(size, 'stepper-icon-size') : rem(iconSize),
      '--stepper-content-padding': getSpacing(contentPadding),
      '--stepper-radius': radius === undefined ? undefined : getRadius(radius),
      '--stepper-fz': getFontSize(size),
      '--stepper-spacing': getSpacing(size),
    },
  }),
)

function getSlotContent(vnode: VNode | undefined) {
  const children = vnode?.children as any
  return typeof children?.default === 'function' ? children.default() : children
}

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    child.type === Fragment && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : child.type === Comment
        ? []
        : [child],
  )
}

const StepperBase = defineComponent({
  name: 'Stepper',
  inheritAttrs: false,
  props: {
    active: { type: Number, required: true },
    onStepClick: { type: Function as PropType<(stepIndex: number) => void>, default: undefined },
    icon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    completedIcon: {
      type: [String, Number, Object, Function] as PropType<any>,
      default: undefined,
    },
    progressIcon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    color: { type: String, default: undefined },
    iconSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    contentPadding: { type: [String, Number] as PropType<string | number>, default: undefined },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: undefined },
    iconPosition: { type: String as PropType<'right' | 'left'>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    allowNextStepsSelect: { type: Boolean, default: undefined },
    wrap: { type: Boolean, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    keepMounted: { type: Boolean, default: false },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Stepper', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'Stepper',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    provideStepperContext({
      getStyles,
      get orientation() {
        return props.orientation
      },
      get iconPosition() {
        return props.iconPosition
      },
    } as any)

    return () => {
      const children = flattenChildren((slots.default?.() ?? []) as VNode[])
      const steps = children.filter((child) => child.type !== StepperCompleted)
      const completed = children.find((child) => child.type === StepperCompleted)
      const items: VNode[] = []

      steps.forEach((item, index) => {
        const itemProps = (item.props ?? {}) as Record<string, any>
        const state =
          props.active === index
            ? 'stepProgress'
            : props.active > index
              ? 'stepCompleted'
              : 'stepInactive'
        const selectable =
          typeof props.onStepClick === 'function' &&
          (typeof itemProps.allowStepSelect === 'boolean'
            ? itemProps.allowStepSelect
            : state === 'stepCompleted' || props.allowNextStepsSelect)

        items.push(
          cloneVNode(
            item,
            {
              icon: itemProps.icon ?? props.icon ?? index + 1,
              step: index,
              state,
              onClick: () => selectable && props.onStepClick?.(index),
              allowStepClick: selectable,
              completedIcon: itemProps.completedIcon ?? props.completedIcon,
              progressIcon: itemProps.progressIcon ?? props.progressIcon,
              color: itemProps.color ?? props.color,
              iconSize: props.iconSize,
              iconPosition: itemProps.iconPosition ?? props.iconPosition,
              orientation: props.orientation,
            },
            true,
          ),
        )

        if (props.orientation === 'horizontal' && index !== steps.length - 1) {
          items.push(
            h('div', {
              ...getStyles('separator'),
              'data-active': index < props.active || undefined,
              'data-orientation': props.orientation,
              key: `separator-${index}`,
            }),
          )
        }
      })

      const contents = props.keepMounted
        ? [
            ...steps.map((step, index) =>
              h(
                'div',
                {
                  ...getStyles('content'),
                  style: [
                    getStyles('content').style,
                    props.active === index ? undefined : { display: 'none' },
                  ],
                  'aria-hidden': props.active === index ? undefined : 'true',
                },
                getSlotContent(step),
              ),
            ),
            completed
              ? h(
                  'div',
                  {
                    ...getStyles('content'),
                    style: [
                      getStyles('content').style,
                      props.active > steps.length - 1 ? undefined : { display: 'none' },
                    ],
                    'aria-hidden': props.active > steps.length - 1 ? undefined : 'true',
                  },
                  getSlotContent(completed),
                )
              : null,
          ]
        : (() => {
            const content =
              props.active > steps.length - 1
                ? getSlotContent(completed)
                : getSlotContent(steps[props.active])
            return content ? h('div', getStyles('content'), content) : null
          })()

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          mod: props.mod,
          size: props.size,
        },
        () => [
          h(
            Box,
            {
              ...getStyles('steps'),
              mod: {
                orientation: props.orientation,
                iconPosition: props.iconPosition,
                wrap: props.wrap && props.orientation !== 'vertical',
              },
            },
            () => items,
          ),
          contents,
        ],
      )
    }
  },
})

export const Stepper = withBoxProps(
  Object.assign(StepperBase, {
    classes,
    varsResolver,
    Step: StepperStep,
    Completed: StepperCompleted,
  }),
)
