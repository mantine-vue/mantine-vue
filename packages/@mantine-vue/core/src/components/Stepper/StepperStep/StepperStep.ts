import { defineComponent, h, isVNode, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  getThemeColor,
  type MantineColor,
  type MantineNode,
  useMantineTheme,
  useProps,
} from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { Loader } from '../../Loader'
import { Transition } from '../../Transition'
import { UnstyledButton } from '../../UnstyledButton'
import { useStepperContext } from '../Stepper.context'
import classes from '../Stepper.module.css'

export interface StepperStepFragmentSlotProps {
  step: number
}
type StepperStepFragment = MantineNode | ((payload: { step: number }) => VNodeChild)

export type StepperStepState = 'stepInactive' | 'stepProgress' | 'stepCompleted'
export type StepperStepStylesNames =
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

export interface StepperStepSlots {
  icon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  completedIcon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  progressIcon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  label?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  description?: (payload: StepperStepFragmentSlotProps) => VNodeChild
}

function renderFragment(fragment: any, step = 0) {
  if (typeof fragment === 'function') {
    return fragment({ step })
  }

  return isVNode(fragment) ? fragment : fragment
}

/** Resolve a Stepper fragment, honouring prop-over-slot precedence and passing `{ step }`. */
function resolveFragment(
  prop: StepperStepFragment | undefined,
  slot: ((payload: { step: number }) => VNodeChild) | undefined,
  step: number,
) {
  if (prop !== undefined) {
    return renderFragment(prop, step)
  }

  return slot ? slot({ step }) : undefined
}

const defaultProps = {
  withIcon: true,
  allowStepClick: true,
  iconPosition: 'left',
} as const

export const StepperStep = withBoxProps(
  defineComponent({
    name: 'StepperStep',
    inheritAttrs: false,
    slots: Object as SlotsType<StepperStepSlots>,
    props: {
      step: { type: Number, default: undefined },
      state: { type: String as PropType<StepperStepState>, default: undefined },
      color: { type: String as PropType<MantineColor>, default: undefined },
      withIcon: { type: Boolean, default: undefined },
      icon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      completedIcon: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      progressIcon: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      description: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      iconSize: { type: [String, Number] as PropType<string | number>, default: undefined },
      iconPosition: { type: String as PropType<'right' | 'left'>, default: undefined },
      loading: { type: Boolean, default: false },
      allowStepClick: { type: Boolean, default: undefined },
      allowStepSelect: { type: Boolean, default: undefined },
      orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      className: { type: [String, Array, Object] as PropType<any>, default: undefined },
      style: { type: [String, Array, Object] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('StepperStep', defaultProps, rawProps)
      const ctx = useStepperContext()
      const theme = useMantineTheme()

      return () => {
        const dataAttributes = {
          'data-progress': props.state === 'stepProgress' || undefined,
          'data-completed': props.state === 'stepCompleted' || undefined,
        }
        const step = props.step ?? 0
        const iconPosition = props.iconPosition ?? ctx.iconPosition
        const stylesApi = { classNames: props.classNames, styles: props.styles, props }
        const iconNode = resolveFragment(props.icon, slots.icon, step)
        const progressIconNode =
          props.progressIcon !== undefined || slots.progressIcon
            ? resolveFragment(props.progressIcon, slots.progressIcon, step)
            : undefined
        const currentIcon =
          props.state === 'stepProgress' ? (progressIconNode ?? iconNode) : iconNode
        const hasCompletedIcon = props.completedIcon !== undefined || !!slots.completedIcon
        const completed = hasCompletedIcon
          ? resolveFragment(props.completedIcon, slots.completedIcon, step)
          : h(CheckIcon, { width: '60%', height: '60%' })
        const labelPresent = props.label !== undefined || !!slots.label
        const descriptionPresent = props.description !== undefined || !!slots.description
        const labelNode = resolveFragment(props.label, slots.label, step)
        const descriptionNode = resolveFragment(props.description, slots.description, step)
        const stepStyles = ctx.getStyles('step', {
          className: [
            props.className ?? attrs.class,
            classes[`step--${ctx.orientation}` as keyof typeof classes],
          ],
          style: props.style ?? attrs.style,
          ...stylesApi,
        })

        return h(
          UnstyledButton,
          {
            ...attrs,
            ...stepStyles,
            mod: [{ iconPosition, allowClick: props.allowStepClick }, props.mod],
            ...dataAttributes,
            style: [
              stepStyles.style,
              { '--step-color': props.color ? getThemeColor(props.color, theme.value) : undefined },
              props.style,
              attrs.style,
            ],
            tabindex: props.allowStepClick ? 0 : -1,
          },
          () => [
            props.withIcon
              ? h('span', ctx.getStyles('stepWrapper', stylesApi), [
                  h('span', { ...ctx.getStyles('stepIcon', stylesApi), ...dataAttributes }, [
                    h(
                      Transition,
                      {
                        mounted: props.state === 'stepCompleted',
                        transition: 'scale',
                        duration: 200,
                      },
                      {
                        default: (transitionStyles: any) =>
                          h(
                            'span',
                            ctx.getStyles('stepCompletedIcon', {
                              ...stylesApi,
                              style: transitionStyles,
                            }),
                            props.loading
                              ? h(Loader, {
                                  color: 'var(--mantine-color-white)',
                                  size: 'calc(var(--stepper-icon-size) / 2)',
                                  ...ctx.getStyles('stepLoader', stylesApi),
                                })
                              : completed,
                          ),
                      },
                    ),
                    props.state !== 'stepCompleted'
                      ? h(
                          'span',
                          ctx.getStyles('stepIconContent', stylesApi),
                          props.loading
                            ? h(Loader, {
                                size: 'calc(var(--stepper-icon-size) / 2)',
                                color: props.color,
                                ...ctx.getStyles('stepLoader', stylesApi),
                              })
                            : currentIcon,
                        )
                      : null,
                  ]),
                  props.orientation === 'vertical'
                    ? h('span', {
                        ...ctx.getStyles('verticalSeparator', stylesApi),
                        'data-active': props.state === 'stepCompleted' || undefined,
                      })
                    : null,
                ])
              : null,
            labelPresent || descriptionPresent
              ? h(
                  'span',
                  {
                    ...ctx.getStyles('stepBody', stylesApi),
                    'data-orientation': ctx.orientation,
                    'data-icon-position': iconPosition,
                  },
                  [
                    labelPresent
                      ? h('span', ctx.getStyles('stepLabel', stylesApi), labelNode)
                      : null,
                    descriptionPresent
                      ? h('span', ctx.getStyles('stepDescription', stylesApi), descriptionNode)
                      : null,
                  ],
                )
              : null,
          ],
        )
      }
    },
  }),
)

Object.assign(StepperStep, { classes })
