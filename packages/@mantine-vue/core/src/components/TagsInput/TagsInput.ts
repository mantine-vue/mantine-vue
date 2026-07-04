import { computed, defineComponent, h, nextTick, ref, type PropType } from 'vue'
import {
  Combobox,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
  type ComboboxData,
} from '../Combobox'
import { InputBase } from '../InputBase'
import { Pill } from '../Pill'
import { PillsInput } from '../PillsInput'

export interface TagsInputProps {
  modelValue?: string[]
  value?: string[]
  defaultValue?: string[]
  data?: ComboboxData<string>
  onChange?: (value: string[]) => void
  onRemove?: (value: string) => void
  onClear?: () => void
  maxTags?: number
  onMaxTags?: (value: string) => void
  allowDuplicates?: boolean
  onDuplicate?: (value: string) => void
  splitChars?: string[]
  acceptValueOnBlur?: boolean
  isDuplicate?: (value: string, values: string[]) => boolean
  [key: string]: any
}

export function getSplittedTags({
  value,
  splitChars = [','],
  currentTags = [],
  allowDuplicates = false,
  maxTags = Infinity,
  isDuplicate,
  onDuplicate,
}: any): string[] {
  const pattern = new RegExp(
    `[${splitChars.map((char: string) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`,
  )
  const result = [...currentTags]
  value
    .split(pattern)
    .map((tag: string) => tag.trim())
    .filter(Boolean)
    .forEach((tag: string) => {
      const duplicate = isDuplicate
        ? isDuplicate(tag, result)
        : result.some((item) => item.toLowerCase() === tag.toLowerCase())
      if (duplicate) {
        onDuplicate?.(tag)
        if (!allowDuplicates) return
      }
      if (result.length < maxTags) result.push(tag)
    })
  return result
}

export const TagsInput = defineComponent({
  name: 'TagsInput',
  inheritAttrs: false,
  props: {
    modelValue: Array as PropType<string[]>,
    value: Array as PropType<string[]>,
    defaultValue: { type: Array as PropType<string[]>, default: () => [] },
    data: { type: Array as PropType<ComboboxData<string>>, default: () => [] },
    onChange: Function as PropType<(value: string[]) => void>,
    onRemove: Function as PropType<(value: string) => void>,
    onClear: Function as PropType<() => void>,
    maxTags: { type: Number, default: Infinity },
    onMaxTags: Function as PropType<(value: string) => void>,
    allowDuplicates: Boolean,
    onDuplicate: Function as PropType<(value: string) => void>,
    splitChars: { type: Array as PropType<string[]>, default: () => [','] },
    acceptValueOnBlur: { type: Boolean, default: true },
    isDuplicate: Function as PropType<(value: string, values: string[]) => boolean>,
    searchValue: String,
    defaultSearchValue: String,
    onSearchChange: Function as PropType<(value: string) => void>,
    clearable: Boolean,
    hiddenInputValuesDivider: { type: String, default: ',' },
    hiddenInputProps: Object,
    nothingFoundMessage: { default: undefined },
    filter: Function as PropType<any>,
    limit: Number,
    withScrollArea: { type: Boolean, default: true },
    maxDropdownHeight: [Number, String],
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: Boolean,
    onDropdownOpen: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    onOptionSubmit: Function as PropType<(value: string) => void>,
    comboboxProps: Object,
    renderOption: Function as PropType<any>,
    renderPill: Function as PropType<any>,
    scrollAreaProps: Object,
    openOnFocus: { type: Boolean, default: true },
    selectFirstOptionOnDropdownOpen: Boolean,
  },
  emits: ['update:modelValue', 'update:searchValue'],
  setup(props, { attrs, emit }) {
    const parsed = computed(() => getParsedComboboxData(props.data))
    const lockup = computed(() => getOptionsLockup(parsed.value))
    const internal = ref([...props.defaultValue])
    const values = () => props.modelValue ?? props.value ?? internal.value
    const controlled = () => props.modelValue !== undefined || props.value !== undefined
    const internalSearch = ref(props.defaultSearchValue ?? '')
    const search = () => props.searchValue ?? internalSearch.value
    const setSearch = (value: string) => {
      if (props.searchValue === undefined) internalSearch.value = value
      props.onSearchChange?.(value)
      emit('update:searchValue', value)
      combobox.resetSelectedOption()
    }
    const setValue = (value: string[]) => {
      if (!controlled()) internal.value = value
      props.onChange?.(value)
      emit('update:modelValue', value)
    }
    const combobox = useCombobox({
      opened: () => props.dropdownOpened,
      defaultOpened: props.defaultDropdownOpened,
      onDropdownOpen: () => {
        props.onDropdownOpen?.()
        if (props.selectFirstOptionOnDropdownOpen) nextTick(combobox.selectFirstOption)
      },
      onDropdownClose: () => {
        props.onDropdownClose?.()
        combobox.resetSelectedOption()
      },
    })
    const duplicate = (value: string) =>
      props.isDuplicate
        ? props.isDuplicate(value, values())
        : values().some((tag) => tag.toLowerCase() === value.toLowerCase())
    const submit = (raw: string) => {
      const value = raw.trim()
      if (!value) return
      if (duplicate(value)) {
        props.onDuplicate?.(value)
        if (!props.allowDuplicates) {
          setSearch('')
          return
        }
      }
      if (values().length >= props.maxTags) {
        props.onMaxTags?.(value)
        return
      }
      props.onOptionSubmit?.(value)
      setValue([...values(), value])
      setSearch('')
    }
    const removeAt = (index: number) => {
      const next = values().slice()
      const [removed] = next.splice(index, 1)
      setValue(next)
      props.onRemove?.(removed)
    }
    const split = (input: string) => {
      const next = getSplittedTags({
        value: input,
        splitChars: props.splitChars,
        currentTags: values(),
        allowDuplicates: props.allowDuplicates,
        maxTags: props.maxTags,
        isDuplicate: props.isDuplicate,
        onDuplicate: props.onDuplicate,
      })
      if (next.length === values().length && values().length >= props.maxTags)
        props.onMaxTags?.(input.trim())
      setValue(next)
      setSearch('')
    }
    return () => {
      const current = values()
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const canClear = props.clearable && current.length > 0 && !disabled && !readOnly
      const forwarded: any = { ...attrs }
      ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
        (key) => delete forwarded[key],
      )
      const rightSection = canClear
        ? h(Combobox.ClearButton, {
            ...(attrs as any).clearButtonProps,
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
              setValue([])
              setSearch('')
              props.onClear?.()
            },
          })
        : (attrs as any).rightSection
      return [
        h(
          Combobox,
          {
            store: combobox,
            readOnly,
            size: (attrs as any).size ?? 'sm',
            __staticSelector: 'TagsInput',
            ...props.comboboxProps,
            onOptionSubmit: (raw: string) => submit(lockup.value[raw]?.label ?? raw),
          },
          () => [
            h(Combobox.Target, { targetType: 'input', withExpandedAttribute: true }, () =>
              h(
                PillsInput,
                {
                  ...forwarded,
                  __staticSelector: 'TagsInput',
                  disabled,
                  rightSection,
                  rightSectionPointerEvents: canClear ? 'all' : undefined,
                },
                () =>
                  h(Pill.Group, null, () => [
                    ...current.map((item, index) => {
                      const onRemove = () => removeAt(index)
                      const option = lockup.value[item] ?? {
                        value: item,
                        label: item,
                        disabled: false,
                      }
                      return props.renderPill
                        ? props.renderPill({ option, value: item, onRemove, disabled })
                        : h(
                            Pill,
                            {
                              key: `${item}-${index}`,
                              withRemoveButton: !readOnly,
                              disabled,
                              onRemove,
                            },
                            () => item,
                          )
                    }),
                    h(PillsInput.Field, {
                      value: search(),
                      readonly: readOnly,
                      disabled,
                      placeholder: current.length === 0 ? (attrs as any).placeholder : undefined,
                      onInput: (event: Event) => {
                        const input = (event.target as HTMLInputElement).value
                        if (props.splitChars.some((char) => input.includes(char))) split(input)
                        else setSearch(input)
                        combobox.openDropdown()
                      },
                      onPaste: (event: ClipboardEvent) => {
                        if (!event.clipboardData) return
                        event.preventDefault()
                        split(`${search()}${event.clipboardData.getData('text/plain')}`)
                        ;(attrs as any).onPaste?.(event)
                      },
                      onFocus: (event: FocusEvent) => {
                        if (props.openOnFocus) combobox.openDropdown()
                        ;(attrs as any).onFocus?.(event)
                      },
                      onBlur: (event: FocusEvent) => {
                        if (props.acceptValueOnBlur) submit(search())
                        combobox.closeDropdown()
                        ;(attrs as any).onBlur?.(event)
                      },
                      onClick: () => combobox.openDropdown(),
                      onKeydown: (event: KeyboardEvent) => {
                        if (event.isComposing) return
                        if (event.key === 'Enter' && search().trim()) {
                          event.preventDefault()
                          submit(search())
                        } else if (props.splitChars.includes(event.key) && search().trim()) {
                          event.preventDefault()
                          split(search())
                        } else if (
                          event.key === 'Backspace' &&
                          !search() &&
                          current.length &&
                          !readOnly
                        )
                          removeAt(current.length - 1)
                        ;(attrs as any).onKeydown?.(event)
                      },
                    }),
                  ]),
              ),
            ),
            h(OptionsDropdown, {
              data: parsed.value as any,
              hidden: disabled || readOnly,
              search: search(),
              filter: props.filter,
              limit: props.limit,
              hiddenWhenEmpty: props.nothingFoundMessage == null,
              nothingFoundMessage: props.nothingFoundMessage,
              withScrollArea: props.withScrollArea,
              maxDropdownHeight: props.maxDropdownHeight,
              renderOption: props.renderOption,
              scrollAreaProps: props.scrollAreaProps,
            }),
          ],
        ),
        h(Combobox.HiddenInput, {
          value: current,
          valuesDivider: props.hiddenInputValuesDivider,
          name: (attrs as any).name,
          form: (attrs as any).form,
          disabled,
          ...props.hiddenInputProps,
        }),
      ]
    }
  },
})
Object.assign(TagsInput, { classes: { ...InputBase.classes, ...Combobox.classes } })
