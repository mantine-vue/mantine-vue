import { defineComponent, h, ref, type PropType } from 'vue'
import { InputBase } from '../InputBase'
import { providePillsInputContext } from './PillsInput.context'
import { PillsInputField } from './PillsInputField/PillsInputField'

const PillsInputBase = defineComponent({
  name: 'PillsInput',
  inheritAttrs: false,
  props: {
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    disabled: { type: Boolean, default: false },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    variant: { type: String as PropType<'default' | 'filled' | 'unstyled'>, default: 'default' },
    __staticSelector: { type: String, default: undefined },
    __stylesApiProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    required: { type: Boolean, default: false },
    withAsterisk: { type: Boolean, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const fieldRef = ref<HTMLInputElement | null>(null)

    providePillsInputContext({
      fieldRef,
      get size() {
        return props.size
      },
      get disabled() {
        return props.disabled
      },
      get hasError() {
        return Boolean(props.error)
      },
      get variant() {
        return props.variant
      },
    })

    const focusField = () => fieldRef.value?.focus()

    return () =>
      h(
        InputBase,
        {
          ...attrs,
          size: props.size,
          error: props.error,
          variant: props.variant,
          component: 'div',
          'data-no-overflow': true,
          multiline: true,
          disabled: props.disabled,
          __staticSelector: props.__staticSelector || 'PillsInput',
          __stylesApiProps: props.__stylesApiProps,
          withAria: false,
          label: props.label,
          description: props.description,
          required: props.required,
          withAsterisk: props.withAsterisk,
          wrapperProps: props.wrapperProps,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          radius: props.radius,
          mod: props.mod,
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            focusField()
            const handler = (attrs as any).onMousedown ?? (attrs as any).onMouseDown
            if (Array.isArray(handler)) {
              handler.forEach((item) => item?.(event))
            } else {
              handler?.(event)
            }
          },
          onClick: (event: MouseEvent) => {
            event.preventDefault()
            const fieldset = (event.currentTarget as HTMLElement).closest(
              'fieldset',
            ) as HTMLFieldSetElement | null
            if (!fieldset?.disabled) {
              focusField()
              const handler = (attrs as any).onClick
              if (Array.isArray(handler)) {
                handler.forEach((item) => item?.(event))
              } else {
                handler?.(event)
              }
            }
          },
        },
        () => slots.default?.(),
      )
  },
})

export const PillsInput = Object.assign(PillsInputBase, {
  classes: InputBase.classes,
  Field: PillsInputField,
})
