import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  watch,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { useId } from '@mantine-vue/hooks'
import {
  Combobox,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
  type ComboboxGenericData,
  type OptionsFilter,
} from '../Combobox'
import { InputBase } from '../InputBase'

export type RenderAutocompleteOption = (input: { option: any; checked?: boolean }) => any
export type AutocompleteStylesNames = string
export interface AutocompleteProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  data?: ComboboxGenericData
  dropdownOpened?: boolean
  defaultDropdownOpened?: boolean
  onDropdownOpen?: () => void
  onDropdownClose?: () => void
  selectFirstOptionOnChange?: boolean
  selectFirstOptionOnDropdownOpen?: boolean
  onOptionSubmit?: (value: string) => void
  filter?: OptionsFilter<any>
  limit?: number
  withScrollArea?: boolean
  maxDropdownHeight?: number | string
  comboboxProps?: Record<string, any>
  renderOption?: RenderAutocompleteOption
  scrollAreaProps?: Record<string, any>
  clearable?: boolean
  onClear?: () => void
  autoSelectOnBlur?: boolean
  openOnFocus?: boolean
  [key: string]: any
}
export interface AutocompleteSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
  renderOption?: (input: { option: any; checked?: boolean }) => VNodeChild
  nothingFound?: () => VNodeChild
}

export const Autocomplete = defineComponent({
  name: 'Autocomplete',
  inheritAttrs: false,
  slots: Object as SlotsType<AutocompleteSlots>,
  props: {
    modelValue: { type: String, default: undefined },
    value: { type: String, default: undefined },
    defaultValue: { type: String, default: '' },
    onChange: Function as PropType<(value: string) => void>,
    data: { type: Array as PropType<ComboboxGenericData>, default: () => [] },
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: Boolean,
    onDropdownOpen: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    selectFirstOptionOnChange: Boolean,
    selectFirstOptionOnDropdownOpen: Boolean,
    onOptionSubmit: Function as PropType<(value: string) => void>,
    filter: Function as PropType<any>,
    limit: Number,
    withScrollArea: { type: Boolean, default: true },
    maxDropdownHeight: [Number, String],
    comboboxProps: Object,
    renderOption: Function as PropType<RenderAutocompleteOption>,
    scrollAreaProps: Object,
    clearable: Boolean,
    onClear: Function as PropType<() => void>,
    autoSelectOnBlur: Boolean,
    openOnFocus: { type: Boolean, default: true },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
  },
  setup(props, { attrs, emit, slots }) {
    const internal = ref(props.defaultValue)
    const current = () => props.modelValue ?? props.value ?? internal.value
    const controlled = () => props.modelValue !== undefined || props.value !== undefined
    const change = (value: string) => {
      if (!controlled()) internal.value = value
      props.onChange?.(value)
      emit('update:modelValue', value)
      combobox.resetSelectedOption()
    }
    const parsed = computed(() => getParsedComboboxData(props.data))
    const lockup = computed(() => getOptionsLockup(parsed.value))
    const combobox = useCombobox({
      opened: () => props.dropdownOpened,
      defaultOpened: props.defaultDropdownOpened,
      onDropdownOpen: () => {
        props.onDropdownOpen?.()
        if (props.selectFirstOptionOnDropdownOpen) nextTick(combobox.selectFirstOption)
      },
      onDropdownClose: () => {
        props.onDropdownClose?.()
        setTimeout(combobox.resetSelectedOption)
      },
    })
    watch(
      () => current(),
      () => {
        if (props.selectFirstOptionOnChange) nextTick(combobox.selectFirstOption)
      },
    )
    const id = useId((attrs as any).id)
    const clear = (event?: MouseEvent) => {
      event?.stopPropagation()
      change('')
      props.onClear?.()
    }
    return () => {
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const showClear = props.clearable && !!current() && !disabled && !readOnly
      const rightSection = showClear
        ? h(Combobox.ClearButton, { ...(attrs as any).clearButtonProps, onClick: clear })
        : (attrs as any).rightSection
      const forwarded = { ...attrs }
      delete forwarded.id
      delete forwarded.rightSection
      delete forwarded.clearButtonProps
      return h(
        Combobox,
        {
          store: combobox,
          __staticSelector: 'Autocomplete',
          readOnly,
          size: (attrs as any).size ?? 'sm',
          onOptionSubmit: (value: string) => {
            props.onOptionSubmit?.(value)
            change(lockup.value[value]?.label ?? value)
            combobox.closeDropdown()
          },
          ...props.comboboxProps,
        },
        () => [
          h(
            Combobox.Target,
            { withExpandedAttribute: true, autoComplete: (attrs as any).autoComplete },
            () =>
              h(
                InputBase,
                {
                  ...forwarded,
                  id: id.value,
                  __staticSelector: 'Autocomplete',
                  component: 'input',
                  disabled,
                  readOnly,
                  value: current(),
                  rightSection,
                  rightSectionPointerEvents: showClear ? 'all' : undefined,
                  onInput: (event: Event) => {
                    change((event.currentTarget as HTMLInputElement).value)
                    combobox.openDropdown()
                    if (props.selectFirstOptionOnChange) nextTick(combobox.selectFirstOption)
                  },
                  onFocus: (event: FocusEvent) => {
                    if (props.openOnFocus) combobox.openDropdown()
                    ;(attrs as any).onFocus?.(event)
                  },
                  onBlur: (event: FocusEvent) => {
                    if (props.autoSelectOnBlur) combobox.clickSelectedOption()
                    combobox.closeDropdown()
                    ;(attrs as any).onBlur?.(event)
                  },
                  onClick: (event: MouseEvent) => {
                    combobox.openDropdown()
                    ;(attrs as any).onClick?.(event)
                  },
                },
                slots,
              ),
          ),
          h(
            OptionsDropdown,
            {
              data: parsed.value as any,
              hidden: readOnly || disabled,
              filter: props.filter,
              search: current(),
              limit: props.limit,
              hiddenWhenEmpty: !slots.nothingFound,
              withScrollArea: props.withScrollArea,
              maxDropdownHeight: props.maxDropdownHeight,
              labelId: (attrs as any).label ? `${id.value}-label` : undefined,
              renderOption: props.renderOption,
              scrollAreaProps: props.scrollAreaProps,
            },
            {
              renderOption: slots.renderOption,
              nothingFound: slots.nothingFound,
            },
          ),
        ],
      )
    }
  },
})
Object.assign(Autocomplete, { classes: { ...InputBase.classes, ...Combobox.classes } })
