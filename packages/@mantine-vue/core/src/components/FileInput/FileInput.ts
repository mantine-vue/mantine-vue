import { computed, defineComponent, h, ref, watch, type PropType } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { CloseButton } from '../CloseButton'
import { FileButton } from '../FileButton'
import { Input } from '../Input'
import type { ClearSectionMode } from '../Input'
import { InputBase } from '../InputBase'

function defaultValueComponent(value: File | File[] | null) {
  const label = Array.isArray(value) ? value.map((file) => file.name).join(', ') : value?.name
  return h(
    'div',
    { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
    label,
  )
}

export const FileInput = defineComponent({
  name: 'FileInput',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'button' },
    onChange: {
      type: Function as PropType<(payload: File | File[] | null) => void>,
      default: undefined,
    },
    value: {
      type: [Object, Array, null] as PropType<File | File[] | null | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [Object, Array, null] as PropType<File | File[] | null | undefined>,
      default: undefined,
    },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: undefined },
    name: { type: String, default: undefined },
    form: { type: String, default: undefined },
    valueComponent: {
      type: Function as PropType<(value: File | File[] | null) => any>,
      default: defaultValueComponent,
    },
    clearable: { type: Boolean, default: false },
    clearSectionMode: { type: String as PropType<ClearSectionMode>, default: 'both' },
    clearButtonProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    readOnly: { type: Boolean, default: false },
    capture: {
      type: [Boolean, String] as PropType<boolean | 'user' | 'environment' | undefined>,
      default: undefined,
    },
    fileInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    placeholder: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    resetRef: { type: [Object, Function] as PropType<any>, default: undefined },
    rightSection: {
      type: [String, Number, Object, Function, null] as PropType<any>,
      default: undefined,
    },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    required: { type: Boolean, default: false },
    withAsterisk: { type: Boolean, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const resetRef = ref<(() => void) | null>(null)
    const [value, setValue] = useUncontrolled<File | File[] | null>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: props.multiple ? [] : null,
      onChange: (nextValue) => props.onChange?.(nextValue),
    })
    const hasValue = computed(() =>
      Array.isArray(value.value) ? value.value.length !== 0 : value.value !== null,
    )

    const reset = () => {
      resetRef.value?.()
    }

    assignRef(props.resetRef, reset)

    watch(
      value,
      (nextValue) => {
        if ((Array.isArray(nextValue) && nextValue.length === 0) || nextValue === null) {
          resetRef.value?.()
        }
      },
      { deep: true },
    )

    return () => {
      const clearButton = h(CloseButton, {
        ...props.clearButtonProps,
        variant: 'subtle',
        size: props.size,
        unstyled: props.unstyled,
        onClick: () => setValue(props.multiple ? [] : null),
      })
      const clearable = props.clearable && hasValue.value && !props.readOnly

      return h(
        FileButton,
        {
          onChange: setValue,
          multiple: props.multiple,
          accept: props.accept,
          name: props.name,
          form: props.form,
          disabled: props.readOnly,
          capture: props.capture,
          inputProps: props.fileInputProps,
          resetRef,
        },
        {
          default: ({ onClick }: { onClick: () => void }) =>
            h(
              InputBase,
              {
                ...attrs,
                component: props.component || 'button',
                onClick,
                rightSection: props.rightSection,
                __clearSection: clearButton,
                __clearable: clearable,
                __clearSectionMode: props.clearSectionMode,
                __staticSelector: 'FileInput',
                __stylesApiProps: props,
                multiline: true,
                type: 'button',
                pointer: true,
                unstyled: props.unstyled,
                size: props.size,
                label: props.label,
                description: props.description,
                error: props.error,
                required: props.required,
                withAsterisk: props.withAsterisk,
                wrapperProps: props.wrapperProps,
                classNames: props.classNames,
                styles: props.styles,
                vars: props.vars,
              },
              () =>
                !hasValue.value
                  ? h(
                      Input.Placeholder,
                      { __staticSelector: 'FileInput' } as any,
                      () => props.placeholder,
                    )
                  : props.valueComponent(value.value),
            ),
        },
      )
    }
  },
})

Object.assign(FileInput, { classes: InputBase.classes })
