import { computed, defineComponent, h, type PropType } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, createVarsResolver, getFontSize, rem, useStyles } from '../../../core'
import { InputDescription } from '../InputDescription/InputDescription'
import { InputError } from '../InputError/InputError'
import { InputLabel } from '../InputLabel/InputLabel'
import { provideInputWrapperContext } from '../InputWrapper.context'
import { getInputOffsets, type InputWrapperOrderPart } from './get-input-offsets/get-input-offsets'
import classes from '../Input.module.css'

export type InputWrapperStylesNames = 'root' | 'label' | 'required' | 'description' | 'error'

const defaultOrder: InputWrapperOrderPart[] = ['label', 'description', 'input', 'error']

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  label: {
    '--input-label-size': getFontSize(size),
    '--input-asterisk-color': undefined,
  },
  error: {
    '--input-error-size': size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
  description: {
    '--input-description-size':
      size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
}))

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

export const InputWrapper = defineComponent({
  name: 'InputWrapper',
  inheritAttrs: false,
  props: {
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    required: { type: Boolean, default: false },
    withAsterisk: { type: Boolean, default: undefined },
    labelProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    descriptionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    errorProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    inputContainer: { type: Function as PropType<(children: any) => any>, default: undefined },
    inputWrapperOrder: { type: Array as PropType<InputWrapperOrderPart[]>, default: undefined },
    id: { type: String, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    labelElement: { type: String as PropType<'label' | 'div'>, default: 'label' },
    variant: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const idBase = useId(props.id)
    const getStyles = useStyles({
      name: 'InputWrapper',
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

    const ids = computed(() => {
      const errorId = props.errorProps?.id || `${idBase.value}-error`
      const descriptionId = props.descriptionProps?.id || `${idBase.value}-description`
      const hasError = Boolean(props.error) && typeof props.error !== 'boolean'
      const hasDescription = Boolean(props.description)
      const describedBy = `${hasError ? errorId : ''} ${hasDescription ? descriptionId : ''}`.trim()

      return {
        errorId,
        descriptionId,
        inputId: idBase.value,
        labelId: props.labelProps?.id || `${idBase.value}-label`,
        hasError,
        hasDescription,
        describedBy: describedBy || undefined,
      }
    })

    provideInputWrapperContext({
      getStyles,
      get describedBy() {
        return ids.value.describedBy
      },
      get inputId() {
        return ids.value.inputId
      },
      get labelId() {
        return ids.value.labelId
      },
      get offsetBottom() {
        return getInputOffsets(props.inputWrapperOrder ?? defaultOrder, {
          hasDescription: ids.value.hasDescription,
          hasError: ids.value.hasError,
        }).offsetBottom
      },
      get offsetTop() {
        return getInputOffsets(props.inputWrapperOrder ?? defaultOrder, {
          hasDescription: ids.value.hasDescription,
          hasError: ids.value.hasError,
        }).offsetTop
      },
    } as any)

    return () => {
      const order = props.inputWrapperOrder ?? defaultOrder
      const isRequired =
        typeof props.withAsterisk === 'boolean' ? props.withAsterisk : props.required
      const sharedProps = {
        size: props.size,
        variant: props.variant,
      }

      const label = props.label
        ? h(
            InputLabel,
            {
              key: 'label',
              labelElement: props.labelElement,
              id: ids.value.labelId,
              htmlFor: ids.value.inputId,
              required: isRequired,
              ...sharedProps,
              ...props.labelProps,
            },
            () => renderContent(props.label),
          )
        : null

      const description = ids.value.hasDescription
        ? h(
            InputDescription,
            {
              key: 'description',
              ...props.descriptionProps,
              ...sharedProps,
              size: props.descriptionProps?.size || props.size,
              id: props.descriptionProps?.id || ids.value.descriptionId,
            },
            () => renderContent(props.description),
          )
        : null

      const input = props.inputContainer
        ? props.inputContainer(slots.default?.())
        : slots.default?.()

      const error = ids.value.hasError
        ? h(
            InputError,
            {
              key: 'error',
              ...props.errorProps,
              ...sharedProps,
              size: props.errorProps?.size || props.size,
              id: props.errorProps?.id || ids.value.errorId,
            },
            () => renderContent(props.error),
          )
        : null

      const content = order.map((part) => {
        if (part === 'label') {
          return label
        }
        if (part === 'description') {
          return description
        }
        if (part === 'error') {
          return error
        }
        return input
      })

      return h(
        Box,
        {
          ...attrs,
          variant: props.variant,
          'data-size': props.size,
          mod: [{ error: Boolean(props.error) }, props.mod],
          id: props.labelElement === 'label' ? undefined : props.id,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        },
        () => content,
      )
    }
  },
})

Object.assign(InputWrapper, { classes, varsResolver })
