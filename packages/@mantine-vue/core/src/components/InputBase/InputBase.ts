import { withBoxProps, type MantineRadius, type MantineSize } from '../../core'
import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { Input } from '../Input'
import type { InputSlots } from '../Input/Input'
import type { MantineNode } from '../../core'

export type InputBaseStylesNames =
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

export interface InputBaseSlots extends InputSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
}

export const InputBase = withBoxProps(
  defineComponent({
    name: 'InputBase',
    inheritAttrs: false,
    slots: Object as SlotsType<InputBaseSlots>,
    props: {
      component: { type: [String, Object, Function] as PropType<any>, default: 'input' },
      __staticSelector: { type: String, default: 'InputBase' },
      __stylesApiProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      label: { type: null as unknown as PropType<MantineNode>, default: undefined },
      description: {
        type: null as unknown as PropType<MantineNode>,
        default: undefined,
      },
      error: {
        type: null as unknown as PropType<MantineNode | boolean>,
        default: undefined,
      },
      required: { type: Boolean, default: false },
      withAsterisk: { type: Boolean, default: undefined },
      labelProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      descriptionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      errorProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      inputContainer: { type: Function as PropType<(children: any) => any>, default: undefined },
      inputWrapperOrder: {
        type: Array as PropType<Array<'label' | 'input' | 'description' | 'error'>>,
        default: undefined,
      },
      id: { type: String, default: undefined },
      size: {
        type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
        default: 'sm',
      },
      labelElement: { type: String as PropType<'label' | 'div'>, default: 'label' },
      variant: { type: String as PropType<'default' | 'filled' | 'unstyled'>, default: 'default' },
      wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      multiline: { type: Boolean, default: false },
      withAria: { type: Boolean, default: true },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
      leftSection: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      leftSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
      leftSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      leftSectionPointerEvents: { type: String, default: undefined },
      rightSection: {
        type: null as unknown as PropType<MantineNode>,
        default: undefined,
      },
      rightSectionWidth: {
        type: [String, Number] as PropType<string | number>,
        default: undefined,
      },
      rightSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      rightSectionPointerEvents: { type: String, default: undefined },
      __clearSection: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      __clearable: { type: Boolean, default: false },
      __clearSectionMode: {
        type: String as PropType<'both' | 'rightSection' | 'clear'>,
        default: undefined,
      },
      __defaultRightSection: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
      disabled: { type: Boolean, default: false },
      pointer: { type: Boolean, default: false },
      withErrorStyles: { type: Boolean, default: true },
      inputSize: { type: [String, Number] as PropType<string | number>, default: undefined },
      loading: { type: Boolean, default: false },
      loadingPosition: { type: String as PropType<'left' | 'right'>, default: undefined },
      __bottomSection: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      __bottomSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
    },
    setup(props, { attrs, slots }) {
      return () =>
        h(
          Input.Wrapper,
          {
            ...props.wrapperProps,
            id: props.id,
            label: props.label,
            description: props.description,
            error: props.error,
            required: props.required,
            withAsterisk: props.withAsterisk,
            labelProps: props.labelProps,
            descriptionProps: props.descriptionProps,
            errorProps: props.errorProps,
            inputContainer: props.inputContainer,
            inputWrapperOrder: props.inputWrapperOrder,
            size: props.size,
            labelElement: props.labelElement,
            variant: props.variant,
            classNames: props.classNames,
            styles: props.styles,
            vars: props.vars,
            unstyled: props.unstyled,
            mod: props.mod,
          },
          {
            label: slots.label,
            description: slots.description,
            error: slots.error,
            default: () =>
              h(
                Input,
                {
                  ...attrs,
                  component: props.component,
                  __staticSelector: props.__staticSelector,
                  __stylesApiProps: props.__stylesApiProps ?? props,
                  error: props.error ?? (slots.error ? true : undefined),
                  required: props.required,
                  id: props.id,
                  size: props.size,
                  variant: props.variant,
                  multiline: props.multiline,
                  withAria: props.withAria,
                  classNames: props.classNames,
                  styles: props.styles,
                  vars: props.vars,
                  unstyled: props.unstyled,
                  leftSection: props.leftSection,
                  leftSectionWidth: props.leftSectionWidth,
                  leftSectionProps: props.leftSectionProps,
                  leftSectionPointerEvents: props.leftSectionPointerEvents,
                  rightSection: props.rightSection,
                  rightSectionWidth: props.rightSectionWidth,
                  rightSectionProps: props.rightSectionProps,
                  rightSectionPointerEvents: props.rightSectionPointerEvents,
                  __clearSection: props.__clearSection,
                  __clearable: props.__clearable,
                  __clearSectionMode: props.__clearSectionMode,
                  __defaultRightSection: props.__defaultRightSection,
                  radius: props.radius,
                  disabled: props.disabled,
                  pointer: props.pointer,
                  withErrorStyles: props.withErrorStyles,
                  inputSize: props.inputSize,
                  loading: props.loading,
                  loadingPosition: props.loadingPosition,
                  __bottomSection: props.__bottomSection,
                  __bottomSectionProps: props.__bottomSectionProps,
                  rootRef: props.rootRef,
                },
                {
                  default: () => slots.default?.(),
                  leftSection: slots.leftSection,
                  rightSection: slots.rightSection,
                },
              ),
          },
        )
    },
  }),
)

Object.assign(InputBase, { classes: Input.classes })
