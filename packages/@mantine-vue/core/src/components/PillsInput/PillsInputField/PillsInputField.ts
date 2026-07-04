import { defineComponent, h, type PropType } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
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
    setup(rawProps, { attrs }) {
      const props = useProps('PillsInputField', null, rawProps)
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
