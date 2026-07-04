import { computed, defineComponent, h, ref, type PropType } from 'vue'
import { assignRef, useId, useUncontrolled, type VueRefTarget } from '@mantine-vue/hooks'
import { withBoxProps, createVarsResolver, getSize, useProps, useStyles } from '../../core'
import { Group } from '../Group'
import { Input } from '../Input'
import { InputBase } from '../InputBase'
import { createPinArray } from './create-pin-array/create-pin-array'
import classes from './PinInput.module.css'

const regex = {
  number: /^[0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/i,
}

export type PinInputStylesNames = 'root' | 'pinInput' | 'input'
export type PinInputCssVariables = {
  root: '--pin-input-size'
}

export interface PinInputProps {
  name?: string
  form?: string
  gap?: string | number
  radius?: string | number
  size?: string | number
  autoFocus?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  placeholder?: string
  manageFocus?: boolean
  oneTimeCode?: boolean
  id?: string
  disabled?: boolean
  error?: boolean
  type?: 'alphanumeric' | 'number' | RegExp
  mask?: boolean
  length?: number
  readOnly?: boolean
  inputType?: string
  inputMode?: string
  ariaLabel?: string
  hiddenInputProps?: Record<string, any>
  rootRef?: VueRefTarget<HTMLDivElement>
  inputRef?: VueRefTarget<HTMLInputElement>
  getInputProps?: (index: number) => Record<string, any>
  variant?: string
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  gap: 'sm',
  length: 4,
  manageFocus: true,
  oneTimeCode: true,
  placeholder: '\u25cb',
  type: 'alphanumeric',
  ariaLabel: 'PinInput',
  size: 'sm',
} as const

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: {
    '--pin-input-size': getSize(size ?? 'sm', 'pin-input-size'),
  },
}))

function getInputElement(node: any): HTMLInputElement | null {
  const element = node?.$el ?? node

  if (!element) {
    return null
  }

  if (typeof HTMLInputElement !== 'undefined' && element instanceof HTMLInputElement) {
    return element
  }

  return element.querySelector?.('input') ?? null
}

export const PinInput = withBoxProps(
  defineComponent({
    name: 'PinInput',
    inheritAttrs: false,
    props: {
      name: { type: String, default: undefined },
      form: { type: String, default: undefined },
      gap: { type: [String, Number] as PropType<string | number>, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      autoFocus: { type: Boolean, default: false },
      value: { type: String, default: undefined },
      defaultValue: { type: String, default: undefined },
      onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
      onComplete: { type: Function as PropType<(value: string) => void>, default: undefined },
      placeholder: { type: String, default: undefined },
      manageFocus: { type: Boolean, default: undefined },
      oneTimeCode: { type: Boolean, default: undefined },
      id: { type: String, default: undefined },
      disabled: { type: Boolean, default: false },
      error: { type: Boolean, default: false },
      type: {
        type: [String, Object] as PropType<'alphanumeric' | 'number' | RegExp>,
        default: undefined,
      },
      mask: { type: Boolean, default: false },
      length: { type: Number, default: undefined },
      readOnly: { type: Boolean, default: false },
      inputType: { type: String, default: undefined },
      inputMode: { type: String, default: undefined },
      ariaLabel: { type: String, default: undefined },
      hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      rootRef: {
        type: [Object, Function] as PropType<VueRefTarget<HTMLDivElement>>,
        default: undefined,
      },
      inputRef: {
        type: [Object, Function] as PropType<VueRefTarget<HTMLInputElement>>,
        default: undefined,
      },
      getInputProps: {
        type: Function as PropType<(index: number) => Record<string, any>>,
        default: undefined,
      },
      variant: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('PinInput', defaultProps, rawProps)
      const uuid = useId(props.id)
      const focusedIndex = ref(-1)
      const inputsRef = ref<Array<HTMLInputElement | null>>([])
      const completed = ref(false)
      const currentLength = computed(() => props.length ?? defaultProps.length)

      const getStyles = useStyles({
        name: 'PinInput',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
        vars: props.vars as any,
        varsResolver,
      })

      const [value, setValue] = useUncontrolled<string[]>({
        value: () =>
          props.value !== undefined ? createPinArray(currentLength.value, props.value) : undefined,
        defaultValue: props.defaultValue?.split('').slice(0, currentLength.value),
        finalValue: createPinArray(currentLength.value, ''),
        onChange: (nextValue) => {
          const stringValue = nextValue.join('').trim()
          props.onChange?.(stringValue)

          if (stringValue.length === currentLength.value && !completed.value) {
            completed.value = true
            props.onComplete?.(stringValue)
          } else if (stringValue.length < currentLength.value) {
            completed.value = false
          }
        },
      })

      const currentValue = computed(() =>
        value.value.length !== currentLength.value
          ? createPinArray(currentLength.value, value.value.join(''))
          : value.value,
      )
      const valueToString = computed(() => currentValue.value.join('').trim())

      const validate = (code: string) => {
        const validator =
          props.type instanceof RegExp
            ? props.type
            : props.type && props.type in regex
              ? regex[props.type as keyof typeof regex]
              : null

        return validator?.test(code) ?? true
      }

      const focusInputField = (dir: 'next' | 'prev', index: number) => {
        if (!props.manageFocus) {
          return
        }

        const nextIndex = dir === 'next' ? index + 1 : index - 1

        if (nextIndex >= 0 && nextIndex < currentLength.value) {
          inputsRef.value[nextIndex]?.focus()
        }
      }

      const setFieldValue = (nextChar: string, index: number) => {
        const nextValue = [...currentValue.value]
        nextValue[index] = nextChar
        setValue(nextValue)
        return nextValue
      }

      const handleInput = (event: Event, index: number) => {
        const target = event.target as HTMLInputElement
        const inputValue = target.value

        if (inputValue.length > 1) {
          const isPasteLike = inputValue.length > 2

          if (isPasteLike) {
            if (validate(inputValue)) {
              setValue(createPinArray(currentLength.value, inputValue))
              const filledCount = Math.min(inputValue.length, currentLength.value)

              if (filledCount < currentLength.value) {
                focusInputField('next', filledCount - 1)
              }
            }

            return
          }

          const nextChar = inputValue.split('')[inputValue.length - 1]

          if (validate(nextChar)) {
            setFieldValue(nextChar, index)
            focusInputField('next', index)
          }

          return
        }

        if (inputValue.length === 1) {
          if (validate(inputValue)) {
            setFieldValue(inputValue, index)
            focusInputField('next', index)
          } else {
            setFieldValue('', index)
          }
        } else {
          setFieldValue('', index)
        }
      }

      const handleKeyDown = (event: KeyboardEvent, index: number) => {
        const inputValue = (event.target as HTMLInputElement).value

        if (props.inputMode === 'numeric') {
          const allowedKeys = ['Backspace', 'Tab', 'Control', 'Delete', 'ArrowLeft', 'ArrowRight']
          const isModifierShortcut = event.ctrlKey || event.metaKey
          const isAllowedKey =
            allowedKeys.includes(event.key) ||
            isModifierShortcut ||
            !Number.isNaN(Number(event.key))

          if (!isAllowedKey) {
            event.preventDefault()
            return
          }
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          focusInputField('prev', index)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          focusInputField('next', index)
        } else if (event.key === 'Tab' && event.shiftKey && index > 0 && props.manageFocus) {
          event.preventDefault()
          focusInputField('prev', index)
        } else if (event.key === ' ') {
          event.preventDefault()
          focusInputField('next', index)
        } else if (event.key === 'Delete') {
          event.preventDefault()
          setFieldValue('', index)
        } else if (event.key === 'Backspace') {
          if (inputValue === '') {
            event.preventDefault()
            focusInputField('prev', index)
          } else {
            setFieldValue('', index)

            if (index < currentLength.value - 1) {
              event.preventDefault()
              focusInputField('prev', index)
            }
          }
        } else if (inputValue.length > 0 && event.key === currentValue.value[index]) {
          event.preventDefault()
          focusInputField('next', index)
        }
      }

      const handlePaste = (event: ClipboardEvent) => {
        event.preventDefault()
        const pasteData = event.clipboardData?.getData('text/plain').replace(/[\n\r\s]+/g, '') ?? ''

        if (validate(pasteData.trim())) {
          const pasteArray = createPinArray(currentLength.value, pasteData)
          setValue(pasteArray)
          const filledCount = pasteArray.filter(Boolean).length
          const nextIndex =
            filledCount >= currentLength.value ? currentLength.value - 1 : filledCount
          inputsRef.value[nextIndex]?.focus()
        }
      }

      return () =>
        h('div', { style: { display: 'contents' } }, [
          h(
            Group,
            {
              ...attrs,
              ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
              ref: (node: any) => assignRef(props.rootRef, node?.$el ?? node ?? null),
              role: 'group',
              id: uuid.value,
              gap: props.gap,
              wrap: 'nowrap',
              variant: props.variant,
              dir: 'ltr',
              unstyled: props.unstyled,
            },
            () =>
              currentValue.value.map((char, index) => {
                const pinInputStyles = getStyles('pinInput', {
                  style: {
                    '--input-padding': '0',
                    '--input-text-align': 'center',
                  },
                })
                const customInputProps = props.getInputProps?.(index) ?? {}

                return h(
                  Input as any,
                  {
                    ...pinInputStyles,
                    component: 'input',
                    __staticSelector: 'PinInput',
                    __stylesApiProps: props,
                    key: `${uuid.value}-${index}`,
                    id: `${uuid.value}-${index + 1}`,
                    inputMode: props.inputMode || (props.type === 'number' ? 'numeric' : 'text'),
                    onInput: (event: Event) => handleInput(event, index),
                    onChange: (event: Event) => handleInput(event, index),
                    onKeydown: (event: KeyboardEvent) => handleKeyDown(event, index),
                    onFocus: (event: FocusEvent) => {
                      ;(event.target as HTMLInputElement).select()
                      focusedIndex.value = index
                    },
                    onBlur: () => {
                      focusedIndex.value = -1
                    },
                    onPaste: handlePaste,
                    type:
                      props.inputType ||
                      (props.mask ? 'password' : props.type === 'number' ? 'tel' : 'text'),
                    radius: props.radius,
                    error: props.error,
                    variant: props.variant,
                    disabled: props.disabled,
                    ref: (node: any) => {
                      const input = getInputElement(node)
                      inputsRef.value[index] = input

                      if (index === 0) {
                        assignRef(props.inputRef, input)
                      }
                    },
                    autocomplete: props.oneTimeCode ? 'one-time-code' : 'off',
                    placeholder: focusedIndex.value === index ? '' : props.placeholder,
                    value: char,
                    autofocus: props.autoFocus && index === 0,
                    unstyled: props.unstyled,
                    'aria-label': props.ariaLabel,
                    readonly: props.readOnly,
                    classNames: props.classNames,
                    styles: props.styles,
                    vars: props.vars,
                    size: props.size,
                    ...customInputProps,
                  } as any,
                )
              }),
          ),
          h('input', {
            ...props.hiddenInputProps,
            type: 'hidden',
            name: props.name,
            form: props.form,
            value: valueToString.value,
          }),
        ])
    },
  }),
)

Object.assign(PinInput, { classes: { ...classes, ...InputBase.classes }, varsResolver })
