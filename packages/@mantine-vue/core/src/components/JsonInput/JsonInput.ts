import { defineComponent, h, ref, type PropType } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { InputBase } from '../InputBase'
import { Textarea } from '../Textarea'
import { validateJson } from './validate-json/validate-json'

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

export const JsonInput = defineComponent({
  name: 'JsonInput',
  inheritAttrs: false,
  props: {
    value: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
    formatOnBlur: { type: Boolean, default: false },
    validationError: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    serialize: { type: Function as PropType<typeof JSON.stringify>, default: JSON.stringify },
    deserialize: { type: Function as PropType<typeof JSON.parse>, default: JSON.parse },
    indentSpaces: { type: Number, default: 2 },
    readOnly: { type: Boolean, default: false },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const [value, setValue] = useUncontrolled<string>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: '',
      onChange: (nextValue) => props.onChange?.(nextValue),
    })
    const valid = ref(validateJson(value.value, props.deserialize))

    return () =>
      h(
        Textarea,
        {
          ...attrs,
          value: value.value,
          readOnly: props.readOnly,
          autoComplete: 'off',
          __staticSelector: 'JsonInput',
          error: valid.value ? props.error : props.validationError || true,
          'data-monospace': true,
          onInput: (event: Event) => {
            callHandler((attrs as any).onInput, event)
            setValue((event.currentTarget as HTMLTextAreaElement).value)
          },
          onFocus: (event: FocusEvent) => {
            callHandler((attrs as any).onFocus, event)
            valid.value = true
          },
          onBlur: (event: FocusEvent) => {
            callHandler((attrs as any).onBlur, event)
            const target = event.currentTarget as HTMLTextAreaElement
            const isValid = validateJson(target.value, props.deserialize)

            if (props.formatOnBlur && !props.readOnly && isValid && target.value.trim() !== '') {
              setValue(props.serialize(props.deserialize(target.value), null, props.indentSpaces))
            }

            valid.value = isValid
          },
        },
        slots,
      )
  },
})

Object.assign(JsonInput, { classes: InputBase.classes })
