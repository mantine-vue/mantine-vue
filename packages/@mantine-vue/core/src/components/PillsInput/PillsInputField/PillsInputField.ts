import { defineComponent, h, type PropType } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { withBoxProps, Box, useProps, useStyles } from '../../../core'
import { useInputWrapperContext } from '../../Input'
import { usePillsInputContext } from '../PillsInput.context'
import classes from '../PillsInput.module.css'

export type PillsInputFieldStylesNames = 'field'

export const PillsInputField = withBoxProps(
  defineComponent({
    name: 'PillsInputField',
    inheritAttrs: false,
    props: {
      modelValue: { type: String, default: undefined },
      value: { type: String, default: undefined },
      defaultValue: { type: String, default: undefined },
      onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
      type: { type: String as PropType<'auto' | 'visible' | 'hidden'>, default: 'visible' },
      pointer: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      id: { type: String, default: undefined },
      inputRef: { type: [Object, Function] as PropType<any>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'change'],
    setup(rawProps, { attrs, emit }) {
      const props = useProps('PillsInputField', null, rawProps)
      const [value, setValue] = useUncontrolled<string>({
        value: () => (props.modelValue !== undefined ? props.modelValue : props.value),
        defaultValue: props.defaultValue,
        finalValue: '',
        onChange: (nextValue) => {
          emit('update:modelValue', nextValue)
          emit('change', nextValue)
        },
      })
      const context = usePillsInputContext()
      const inputWrapperContext = useInputWrapperContext()
      const getStyles = useStyles({
        name: 'PillsInputField',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
      })

      return () => {
        const disabled = props.disabled || context?.disabled

        return h(Box, {
          ...attrs,
          ...getStyles('field', { className: attrs.class, style: attrs.style as any }),
          component: 'input',
          value: value.value,
          ref: (node: any) => {
            const input = node?.$el ?? node ?? null
            if (context) {
              context.fieldRef.value = input
            }
            assignRef(props.inputRef, input)
          },
          'data-type': props.type,
          disabled,
          mod: [{ disabled, pointer: props.pointer }, props.mod],
          id: inputWrapperContext.inputId || props.id,
          'aria-invalid': context?.hasError || undefined,
          'aria-describedby': inputWrapperContext.describedBy,
          type: 'text',
          onInput: (event: Event) => {
            const handler = attrs.onInput as ((event: Event) => void) | undefined
            handler?.(event)
            setValue((event.currentTarget as HTMLInputElement).value)
          },
          onMousedown: (event: MouseEvent) => {
            if (!props.pointer) {
              event.stopPropagation()
            }
          },
        })
      }
    },
  }),
)

Object.assign(PillsInputField, { classes })
