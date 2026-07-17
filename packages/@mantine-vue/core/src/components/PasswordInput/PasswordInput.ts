import { defineComponent, h, ref, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { createVarsResolver, getSize, type MantineNode, useStyles } from '../../core'
import { ActionIcon } from '../ActionIcon'
import { Input } from '../Input'
import inputClasses from '../Input/Input.module.css'
import { PasswordToggleIcon } from './PasswordToggleIcon'
import classes from './PasswordInput.module.css'

export interface PasswordInputSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}

export type PasswordInputStylesNames =
  | 'root'
  | 'visibilityToggle'
  | 'innerInput'
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: {
    '--psi-icon-size': getSize(size, 'psi-icon-size'),
    '--psi-button-size': getSize(size, 'psi-button-size'),
  },
}))

const mergedClasses = { ...inputClasses, ...classes }

export const PasswordInput = defineComponent({
  name: 'PasswordInput',
  inheritAttrs: false,
  slots: Object as SlotsType<PasswordInputSlots>,
  props: {
    visibilityToggleIcon: { type: [Object, Function] as PropType<any>, default: undefined },
    visibilityToggleButtonProps: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    visible: { type: Boolean, default: undefined },
    defaultVisible: { type: Boolean, default: undefined },
    onVisibilityChange: {
      type: Function as PropType<(visible: boolean) => void>,
      default: undefined,
    },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
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
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    id: { type: String, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    variant: { type: String as PropType<'default' | 'filled' | 'unstyled'>, default: 'default' },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    disabled: { type: Boolean, default: false },
    leftSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    leftSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    leftSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    leftSectionPointerEvents: { type: String, default: undefined },
    rightSection: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    rightSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    rightSectionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    rightSectionPointerEvents: { type: String, default: undefined },
    withErrorStyles: { type: Boolean, default: true },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const uuid = useId(props.id)
    const fallbackId = ref(`password-input-${Math.random().toString(36).slice(2)}`)
    const [visible, setVisible] = useUncontrolled<boolean>({
      value: () => props.visible,
      defaultValue: props.defaultVisible,
      finalValue: false,
      onChange: (value) => props.onVisibilityChange?.(value),
    })
    const getStyles = useStyles({
      name: 'PasswordInput',
      props,
      classes: mergedClasses,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    const toggleVisibility = () => setVisible(!visible.value)

    return () => {
      const id = uuid.value || fallbackId.value
      const errorId = props.errorProps?.id || `${id}-error`
      const descriptionId = props.descriptionProps?.id || `${id}-description`
      const hasError =
        props.error !== undefined
          ? Boolean(props.error) && typeof props.error !== 'boolean'
          : Boolean(slots.error)
      const hasDescription =
        props.description !== undefined ? props.description !== null : Boolean(slots.description)
      const describedBy =
        `${hasError ? errorId : ''} ${hasDescription ? descriptionId : ''}`.trim() || undefined
      const VisibilityToggleIcon = props.visibilityToggleIcon || PasswordToggleIcon
      const visibilityToggleButton = h(
        ActionIcon,
        {
          ...getStyles('visibilityToggle'),
          ...props.visibilityToggleButtonProps,
          disabled: props.disabled,
          radius: props.radius,
          'aria-pressed': visible.value,
          tabIndex: -1,
          'aria-label':
            props.visibilityToggleButtonProps?.['aria-label'] || 'Toggle password visibility',
          variant: props.visibilityToggleButtonProps?.variant ?? 'subtle',
          color: 'gray',
          unstyled: props.unstyled,
          onTouchend: (event: TouchEvent) => {
            event.preventDefault()
            props.visibilityToggleButtonProps?.onTouchend?.(event)
            toggleVisibility()
          },
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            props.visibilityToggleButtonProps?.onMousedown?.(event)
            toggleVisibility()
          },
          onKeydown: (event: KeyboardEvent) => {
            props.visibilityToggleButtonProps?.onKeydown?.(event)
            if (event.key === ' ') {
              event.preventDefault()
              toggleVisibility()
            }
          },
        },
        () => h(VisibilityToggleIcon, { reveal: visible.value }),
      )

      return h(
        Input.Wrapper,
        {
          ...props.wrapperProps,
          id,
          label: props.label,
          description: props.description,
          error: props.error,
          required: props.required,
          withAsterisk: props.withAsterisk,
          labelProps: { ...props.labelProps, htmlFor: id },
          descriptionProps: { ...props.descriptionProps, id: descriptionId },
          errorProps: { ...props.errorProps, id: errorId },
          inputContainer: props.inputContainer,
          inputWrapperOrder: props.inputWrapperOrder,
          size: props.size,
          variant: props.variant,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        },
        {
          label: slots.label,
          description: slots.description,
          error: slots.error,
          default: () =>
            h(
              Input,
              {
                component: 'div',
                dir: attrs.dir as any,
                error: props.error ?? (slots.error ? true : undefined),
                leftSection: props.leftSection,
                size: props.size,
                classNames: {
                  ...(props.classNames as any),
                  input: [classes.input, (props.classNames as any)?.input],
                },
                styles: props.styles,
                radius: props.radius,
                disabled: props.disabled,
                __staticSelector: 'PasswordInput',
                __stylesApiProps: props,
                rightSectionWidth: props.rightSectionWidth,
                rightSection:
                  props.rightSection !== undefined || slots.rightSection
                    ? props.rightSection
                    : visibilityToggleButton,
                variant: props.variant,
                unstyled: props.unstyled,
                leftSectionWidth: props.leftSectionWidth,
                rightSectionPointerEvents: props.rightSectionPointerEvents || 'all',
                rightSectionProps: props.rightSectionProps,
                leftSectionProps: props.leftSectionProps,
                leftSectionPointerEvents: props.leftSectionPointerEvents,
                withAria: false,
                withErrorStyles: props.withErrorStyles,
              },
              {
                default: () =>
                  h('input', {
                    ...attrs,
                    ...getStyles('innerInput'),
                    required: props.required,
                    'data-invalid': props.error || slots.error ? true : undefined,
                    'data-with-left-section':
                      props.leftSection !== undefined || slots.leftSection ? true : undefined,
                    disabled: props.disabled,
                    id,
                    'aria-describedby': describedBy,
                    autocomplete: (attrs.autocomplete as any) || 'off',
                    type: visible.value ? 'text' : 'password',
                  }),
                leftSection: slots.leftSection,
                rightSection: slots.rightSection,
              },
            ),
        },
      )
    }
  },
})

Object.assign(PasswordInput, { classes: mergedClasses, varsResolver })
