import { computed, defineComponent, h, nextTick, ref, watch, type PropType } from 'vue'
import type { Primitive } from '../../core'
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

export interface MultiSelectProps<Value extends Primitive = string> {
  modelValue?: Value[]
  value?: Value[]
  defaultValue?: Value[]
  data?: ComboboxData<Value>
  onChange?: (value: Value[]) => void
  onRemove?: (value: Value) => void
  onClear?: () => void
  maxValues?: number
  onMaxValues?: () => void
  searchable?: boolean
  hidePickedOptions?: boolean
  searchValue?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  clearable?: boolean
  clearSearchOnChange?: boolean
  hiddenInputValuesDivider?: string
  [key: string]: any
}

function filterPicked(data: any[], values: Primitive[]): any[] {
  return data
    .map((item) => ('group' in item ? { ...item, items: filterPicked(item.items, values) } : item))
    .filter((item) => 'group' in item || !values.includes(item.value))
}

export const MultiSelect = defineComponent({
  name: 'MultiSelect',
  inheritAttrs: false,
  props: {
    modelValue: Array as PropType<Primitive[]>,
    value: Array as PropType<Primitive[]>,
    defaultValue: { type: Array as PropType<Primitive[]>, default: () => [] },
    data: { type: Array as PropType<ComboboxData<any>>, default: () => [] },
    onChange: Function as PropType<(value: Primitive[]) => void>,
    onRemove: Function as PropType<(value: Primitive) => void>,
    onClear: Function as PropType<() => void>,
    onMaxValues: Function as PropType<() => void>,
    maxValues: { type: Number, default: Infinity },
    searchable: Boolean,
    hidePickedOptions: Boolean,
    searchValue: String,
    defaultSearchValue: String,
    onSearchChange: Function as PropType<(value: string) => void>,
    clearable: Boolean,
    clearSearchOnChange: { type: Boolean, default: true },
    hiddenInputValuesDivider: { type: String, default: ',' },
    nothingFoundMessage: { type: null as unknown as PropType<any>, default: undefined },
    withCheckIcon: { type: Boolean, default: true },
    withAlignedLabels: Boolean,
    checkIconPosition: { type: String as PropType<'left' | 'right'>, default: 'left' },
    filter: Function as PropType<any>,
    limit: Number,
    withScrollArea: { type: Boolean, default: true },
    maxDropdownHeight: [Number, String],
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: Boolean,
    onDropdownOpen: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    onOptionSubmit: Function as PropType<(value: Primitive) => void>,
    comboboxProps: Object,
    hiddenInputProps: Object,
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
    const retained: Record<string, any> = {}
    const internal = ref<Primitive[]>([...props.defaultValue])
    const current = () => props.modelValue ?? props.value ?? internal.value
    const controlled = () => props.modelValue !== undefined || props.value !== undefined
    const searchInternal = ref(props.defaultSearchValue ?? '')
    const search = () => props.searchValue ?? searchInternal.value
    const setSearch = (value: string) => {
      if (props.searchValue === undefined) searchInternal.value = value
      props.onSearchChange?.(value)
      emit('update:searchValue', value)
      combobox.resetSelectedOption()
    }
    const setValue = (value: Primitive[]) => {
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
    watch(
      [() => current(), lockup],
      () =>
        current().forEach((item) => {
          if (lockup.value[String(item)]) retained[String(item)] = lockup.value[String(item)]
        }),
      { immediate: true },
    )
    const remove = (item: Primitive) => {
      setValue(current().filter((value) => value !== item))
      props.onRemove?.(item)
    }
    return () => {
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const values = current()
      const canClear = props.clearable && values.length > 0 && !disabled && !readOnly
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
        : ((attrs as any).rightSection ??
          h(Combobox.Chevron, { size: (attrs as any).size ?? 'sm', error: (attrs as any).error }))
      const options = props.hidePickedOptions
        ? filterPicked(parsed.value as any, values)
        : parsed.value
      const forwarded: any = { ...attrs }
      ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
        (key) => delete forwarded[key],
      )
      return [
        h(
          Combobox,
          {
            store: combobox,
            readOnly,
            size: (attrs as any).size ?? 'sm',
            __staticSelector: 'MultiSelect',
            ...props.comboboxProps,
            onOptionSubmit: (raw: string) => {
              const option = lockup.value[raw]
              if (!option) return
              props.onOptionSubmit?.(option.value)
              if (values.includes(option.value)) remove(option.value)
              else if (values.length >= props.maxValues) props.onMaxValues?.()
              else setValue([...values, option.value])
              if (props.clearSearchOnChange) setSearch('')
            },
          },
          () => [
            h(Combobox.DropdownTarget, null, () =>
              h(
                PillsInput,
                {
                  ...forwarded,
                  __staticSelector: 'MultiSelect',
                  disabled,
                  rightSection,
                  rightSectionPointerEvents: canClear ? 'all' : 'none',
                  onClick: () =>
                    props.searchable ? combobox.openDropdown() : combobox.toggleDropdown(),
                },
                () =>
                  h(Pill.Group, null, () => [
                    ...values.map((item, index) => {
                      const option = lockup.value[String(item)] ??
                        retained[String(item)] ?? { value: item, label: String(item) }
                      const onRemove = () => remove(item)
                      return props.renderPill
                        ? props.renderPill({ option, value: item, onRemove, disabled })
                        : h(
                            Pill,
                            {
                              key: `${String(item)}-${index}`,
                              withRemoveButton: !readOnly && !option.disabled,
                              disabled,
                              onRemove,
                            },
                            () => option.label,
                          )
                    }),
                    h(Combobox.EventsTarget, { withExpandedAttribute: true }, () =>
                      h(PillsInput.Field, {
                        value: search(),
                        readonly: !props.searchable || readOnly,
                        disabled,
                        placeholder: values.length === 0 ? (attrs as any).placeholder : undefined,
                        onInput: (event: Event) => {
                          setSearch((event.target as HTMLInputElement).value)
                          combobox.openDropdown()
                        },
                        onFocus: (event: FocusEvent) => {
                          if (props.openOnFocus && props.searchable) combobox.openDropdown()
                          ;(attrs as any).onFocus?.(event)
                        },
                        onBlur: (event: FocusEvent) => {
                          combobox.closeDropdown()
                          ;(attrs as any).onBlur?.(event)
                        },
                        onKeydown: (event: KeyboardEvent) => {
                          if (event.key === ' ' && !props.searchable) {
                            event.preventDefault()
                            combobox.toggleDropdown()
                          }
                          if (event.key === 'Backspace' && !search() && values.length && !readOnly)
                            remove(values[values.length - 1])
                          ;(attrs as any).onKeydown?.(event)
                        },
                      }),
                    ),
                  ]),
              ),
            ),
            h(OptionsDropdown, {
              data: options as any,
              hidden: disabled || readOnly,
              search: search(),
              filter: props.filter,
              limit: props.limit,
              filterOptions: props.searchable,
              hiddenWhenEmpty: props.nothingFoundMessage == null,
              nothingFoundMessage: props.nothingFoundMessage,
              value: values,
              withCheckIcon: props.withCheckIcon,
              withAlignedLabels: props.withAlignedLabels,
              checkIconPosition: props.checkIconPosition,
              withScrollArea: props.withScrollArea,
              maxDropdownHeight: props.maxDropdownHeight,
              renderOption: props.renderOption,
              scrollAreaProps: props.scrollAreaProps,
            }),
          ],
        ),
        h(Combobox.HiddenInput, {
          value: values,
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
Object.assign(MultiSelect, { classes: { ...InputBase.classes, ...Combobox.classes } })
