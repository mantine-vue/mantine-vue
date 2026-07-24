import { reactive, defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getRadius,
  getSize,
  rem,
  resolveNode,
  type MantineNode,
  type MantineRadius,
  type MantineSize,
  type SectionSlots,
  useStyles,
} from '../../core'
import { Loader } from '../Loader'
import { InputClearButton } from './InputClearButton/InputClearButton'
import { InputClearSection, type ClearSectionMode } from './InputClearSection/InputClearSection'
import { InputDescription } from './InputDescription/InputDescription'
import { InputError } from './InputError/InputError'
import { InputLabel } from './InputLabel/InputLabel'
import { InputPlaceholder } from './InputPlaceholder/InputPlaceholder'
import { provideInputContext } from './Input.context'
import { useInputWrapperContext } from './InputWrapper.context'
import { InputWrapper } from './InputWrapper/InputWrapper'
import classes from './Input.module.css'

export type InputStylesNames = 'input' | 'wrapper' | 'section' | 'bottomSection'
export type InputVariant = 'default' | 'filled' | 'unstyled'
export type InputCssVariables = {
  wrapper:
    | '--input-height'
    | '--input-fz'
    | '--input-radius'
    | '--input-left-section-width'
    | '--input-right-section-width'
    | '--input-left-section-pointer-events'
    | '--input-right-section-pointer-events'
    | '--input-padding-y'
    | '--input-margin-top'
    | '--input-margin-bottom'
}
export interface InputStylesCtx {
  offsetTop?: boolean
  offsetBottom?: boolean
}

export interface InputSlots extends SectionSlots {
  default?: () => VNodeChild
}

const varsResolver = createVarsResolver<any>((_, props, ctx: InputStylesCtx) => ({
  wrapper: {
    '--input-margin-top': ctx.offsetTop ? 'calc(var(--mantine-spacing-xs) / 2)' : undefined,
    '--input-margin-bottom': ctx.offsetBottom ? 'calc(var(--mantine-spacing-xs) / 2)' : undefined,
    '--input-height': getSize(props.size, 'input-height'),
    '--input-fz': getFontSize(props.size),
    '--input-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--input-left-section-width':
      props.leftSectionWidth !== undefined ? rem(props.leftSectionWidth) : undefined,
    '--input-right-section-width':
      props.rightSectionWidth !== undefined ? rem(props.rightSectionWidth) : undefined,
    '--input-padding-y': props.multiline ? getSize(props.size, 'input-padding-y') : undefined,
    '--input-left-section-pointer-events': props.leftSectionPointerEvents,
    '--input-right-section-pointer-events': props.rightSectionPointerEvents,
  },
}))

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

const InputBase = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  slots: Object as SlotsType<InputSlots>,
  props: {
    component: { type: [String, Object, Function] as PropType<any>, default: 'input' },
    __staticSelector: { type: String, default: undefined },
    __stylesApiProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    leftSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    leftSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    leftSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    leftSectionPointerEvents: { type: String, default: 'none' },
    rightSection: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    rightSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    rightSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    rightSectionPointerEvents: { type: String, default: 'none' },
    required: { type: Boolean, default: false },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    disabled: { type: Boolean, default: false },
    size: {
      type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
      default: 'sm',
    },
    pointer: { type: Boolean, default: false },
    withErrorStyles: { type: Boolean, default: true },
    inputSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    __clearSection: {
      type: [String, Number, Object, Function] as PropType<any>,
      default: undefined,
    },
    __clearable: { type: Boolean, default: false },
    __clearSectionMode: { type: String as PropType<ClearSectionMode>, default: 'both' },
    __defaultRightSection: {
      type: [String, Number, Object, Function] as PropType<any>,
      default: undefined,
    },
    loading: { type: Boolean, default: false },
    loadingPosition: { type: String as PropType<'left' | 'right'>, default: 'right' },
    __bottomSection: {
      type: [String, Number, Object, Function] as PropType<any>,
      default: undefined,
    },
    __bottomSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    variant: { type: String as PropType<InputVariant>, default: 'default' },
    error: { type: [String, Number, Object, Boolean] as PropType<any>, default: undefined },
    multiline: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    withAria: { type: Boolean, default: true },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const wrapperCtx = useInputWrapperContext()
    const stylesCtx = reactive<InputStylesCtx>({
      offsetBottom: false,
      offsetTop: false,
    })
    const getStyles = useStyles({
      name: ['Input', props.__staticSelector],
      props: props.__stylesApiProps || props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      rootSelector: 'wrapper',
      varsResolver,
      stylesCtx,
    })

    provideInputContext({ size: props.size || 'sm' })

    return () => {
      stylesCtx.offsetBottom = wrapperCtx.offsetBottom
      stylesCtx.offsetTop = wrapperCtx.offsetTop

      const loadingIndicator = props.loading
        ? h(Loader, {
            size:
              props.loadingPosition === 'left'
                ? 'calc(var(--input-left-section-size) / 2)'
                : 'calc(var(--input-right-section-size) / 2)',
          })
        : null
      const resolvedLeftSection = resolveNode(props.leftSection, slots.leftSection)
      const resolvedRightSection = resolveNode(props.rightSection, slots.rightSection)
      const leftSection =
        props.loading && props.loadingPosition === 'left' ? loadingIndicator : resolvedLeftSection
      const rightSection = InputClearSection({
        __clearable: props.__clearable,
        __clearSection: props.__clearSection,
        rightSection:
          props.loading && props.loadingPosition === 'right'
            ? loadingIndicator
            : resolvedRightSection,
        __defaultRightSection: props.__defaultRightSection,
        size: props.size,
        __clearSectionMode: props.__clearSectionMode,
      })
      const ariaAttributes = props.withAria
        ? {
            required: props.required,
            disabled: props.disabled,
            'aria-invalid': props.error ? true : undefined,
            'aria-describedby': wrapperCtx.describedBy,
            id: wrapperCtx.inputId || props.id,
          }
        : {}

      return h(
        Box,
        {
          ...props.wrapperProps,
          ref: (node: any) => assignRef(props.rootRef, node?.$el ?? node ?? null),
          ...getStyles('wrapper'),
          mod: [
            {
              error: Boolean(props.error) && props.withErrorStyles,
              pointer: props.pointer,
              disabled: props.disabled,
              multiline: props.multiline,
              withRightSection: Boolean(rightSection),
              withLeftSection: Boolean(leftSection),
              withBottomSection: Boolean(props.__bottomSection),
            },
            props.mod,
          ],
          variant: props.variant,
          'data-size': props.size,
        },
        () => [
          leftSection
            ? h(
                'div',
                {
                  ...props.leftSectionProps,
                  'data-position': 'left',
                  ...getStyles('section', {
                    className: props.leftSectionProps?.class,
                    style: props.leftSectionProps?.style,
                  }),
                },
                renderContent(leftSection),
              )
            : null,
          h(
            Box,
            {
              ...attrs,
              ...ariaAttributes,
              component: props.component,
              required: props.required,
              disabled: props.disabled,
              __size: props.inputSize,
              mod: {
                disabled: props.disabled,
                error: Boolean(props.error) && props.withErrorStyles,
              },
              variant: props.variant,
              ...getStyles('input'),
            },
            () => slots.default?.(),
          ),
          props.__bottomSection
            ? h(
                'div',
                {
                  ...props.__bottomSectionProps,
                  ...getStyles('bottomSection', {
                    className: props.__bottomSectionProps?.class,
                    style: props.__bottomSectionProps?.style,
                  }),
                },
                renderContent(props.__bottomSection),
              )
            : null,
          rightSection
            ? h(
                'div',
                {
                  ...props.rightSectionProps,
                  'data-position': 'right',
                  ...getStyles('section', {
                    className: props.rightSectionProps?.class,
                    style: props.rightSectionProps?.style,
                  }),
                },
                renderContent(rightSection),
              )
            : null,
        ],
      )
    }
  },
})

export const Input = withBoxProps(
  Object.assign(InputBase, {
    classes,
    varsResolver,
    Wrapper: InputWrapper,
    Label: InputLabel,
    Error: InputError,
    Description: InputDescription,
    Placeholder: InputPlaceholder,
    ClearButton: InputClearButton,
  }),
)
