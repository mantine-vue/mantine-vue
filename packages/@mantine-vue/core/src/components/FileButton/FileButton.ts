import { defineComponent, h, ref, type PropType } from 'vue'
import { assignRef } from '@mantine-vue/hooks'

export const FileButton = defineComponent({
  name: 'FileButton',
  inheritAttrs: false,
  props: {
    onChange: {
      type: Function as PropType<(payload: File | File[] | null) => void>,
      required: true,
    },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: undefined },
    name: { type: String, default: undefined },
    form: { type: String, default: undefined },
    resetRef: { type: [Object, Function] as PropType<any>, default: undefined },
    disabled: { type: Boolean, default: false },
    capture: {
      type: [Boolean, String] as PropType<boolean | 'user' | 'environment' | undefined>,
      default: undefined,
    },
    inputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    inputRef: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const inputRef = ref<HTMLInputElement | null>(null)
    const reset = () => {
      if (inputRef.value) {
        inputRef.value.value = ''
      }
    }

    assignRef(props.resetRef, reset)

    const onClick = () => {
      if (!props.disabled) {
        inputRef.value?.click()
      }
    }

    return () => [
      h('input', {
        ...props.inputProps,
        style: [{ display: 'none' }, props.inputProps?.style],
        type: 'file',
        accept: props.accept,
        multiple: props.multiple,
        name: props.name,
        form: props.form,
        capture: props.capture,
        ref: (node: any) => {
          inputRef.value = node
          assignRef(props.inputRef, node)
        },
        onChange: (event: Event) => {
          const files = (event.currentTarget as HTMLInputElement).files

          if (files === null) {
            props.onChange(props.multiple ? [] : null)
            return
          }

          props.onChange(props.multiple ? Array.from(files) : files[0] || null)
        },
      }),
      slots.default?.({ onClick, ...attrs }),
    ]
  },
})
