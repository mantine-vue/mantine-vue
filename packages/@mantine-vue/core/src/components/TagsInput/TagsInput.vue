<script setup lang="ts">
import { computed, h, nextTick, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import {
  Combobox,
  ComboboxClearButton,
  ComboboxHiddenInput,
  ComboboxTarget,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
} from '../Combobox'
import { Pill, PillGroup } from '../Pill'
import { PillsInput, PillsInputField } from '../PillsInput'
import { getSplittedTags } from './get-splitted-tags'
import type { TagsInputOption, TagsInputProps, TagsInputSlots } from './TagsInput.types'

defineOptions({
  name: 'TagsInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TagsInputProps>(), {
  modelValue: undefined,
  defaultValue: () => [],
  data: () => [],
  maxTags: Infinity,
  allowDuplicates: false,
  splitChars: () => [','],
  acceptValueOnBlur: true,
  searchValue: undefined,
  clearable: false,
  hiddenInputValuesDivider: ',',
  nothingFoundMessage: undefined,
  withScrollArea: true,
  dropdownOpened: undefined,
  defaultDropdownOpened: false,
  openOnFocus: true,
  selectFirstOptionOnDropdownOpen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'update:searchValue': [value: string]
  change: [value: string[]]
  remove: [value: string]
  clear: []
  'max-tags': [value: string]
  duplicate: [value: string]
  'search-change': [value: string]
  'dropdown-open': []
  'dropdown-close': []
  'option-submit': [value: string]
}>()

defineSlots<TagsInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const parsed = computed(() => getParsedComboboxData(props.data))
const lockup = computed(() => getOptionsLockup(parsed.value))

const internal = ref([...props.defaultValue])

const valuesOf = () => props.modelValue ?? internal.value
const controlled = () => props.modelValue !== undefined

const internalSearch = ref(props.defaultSearchValue ?? '')
const search = () => props.searchValue ?? internalSearch.value

function setSearch(value: string) {
  if (props.searchValue === undefined) {
    internalSearch.value = value
  }

  emit('search-change', value)
  emit('update:searchValue', value)
  combobox.resetSelectedOption()
}

function setValue(value: string[]) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
}

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => {
    emit('dropdown-open')

    // The options only exist after the dropdown has rendered.
    if (props.selectFirstOptionOnDropdownOpen) {
      nextTick(combobox.selectFirstOption)
    }
  },
  onDropdownClose: () => {
    emit('dropdown-close')
    combobox.resetSelectedOption()
  },
})

function duplicate(value: string) {
  return props.isDuplicate
    ? props.isDuplicate(value, valuesOf())
    : valuesOf().some((tag) => tag.toLowerCase() === value.toLowerCase())
}

/** Adds a single tag, enforcing the duplicate rule and the `maxTags` limit. */
function submit(raw: string) {
  const value = raw.trim()

  if (!value) {
    return
  }

  if (duplicate(value)) {
    emit('duplicate', value)

    if (!props.allowDuplicates) {
      // The tag is rejected, but the input is still cleared so the user sees it was read.
      setSearch('')
      return
    }
  }

  if (valuesOf().length >= props.maxTags) {
    emit('max-tags', value)
    return
  }

  emit('option-submit', value)
  setValue([...valuesOf(), value])
  setSearch('')
}

function removeAt(index: number) {
  const next = valuesOf().slice()
  const [removed] = next.splice(index, 1)
  setValue(next)
  emit('remove', removed)
}

/** Adds several tags at once, from a paste or from a value containing a split char. */
function split(input: string) {
  const next = getSplittedTags({
    value: input,
    splitChars: props.splitChars,
    currentTags: valuesOf(),
    allowDuplicates: props.allowDuplicates,
    maxTags: props.maxTags,
    isDuplicate: props.isDuplicate,
    onDuplicate: (value) => emit('duplicate', value),
  })

  // Nothing was added and the limit is reached: report it, since no single tag was
  // rejected in a way the caller could observe.
  if (next.length === valuesOf().length && valuesOf().length >= props.maxTags) {
    emit('max-tags', input.trim())
  }

  setValue(next)
  setSearch('')
}

const current = computed(() => valuesOf())
const disabled = computed(() => !!(attrs as any).disabled)
const readOnly = computed(() => !!(attrs as any).readOnly)

const canClear = computed(
  () => props.clearable && current.value.length > 0 && !disabled.value && !readOnly.value,
)

function onClear(event: MouseEvent) {
  // The clear button lives inside the input, whose click opens the dropdown.
  event.stopPropagation()
  setValue([])
  setSearch('')
  emit('clear')
}

const rightSection = computed(() =>
  canClear.value
    ? h(ComboboxClearButton, { ...(attrs as any).clearButtonProps, onClick: onClear })
    : (attrs as any).rightSection,
)

/**
 * These are consumed here – by the hidden input, the right section or the field – so
 * they must not also reach `PillsInput` through the fallthrough attributes.
 */
const forwarded = computed(() => {
  const result: any = { ...attrs }
  ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
    (key) => delete result[key],
  )
  return result
})

const comboboxSize = computed(() => (attrs as any).size ?? 'sm')

/** A dropdown option carries a label; the tag stored is that label, not the value. */
function onOptionSubmit(raw: string) {
  submit(lockup.value[raw]?.label ?? raw)
}

function onFieldInput(event: Event) {
  const input = (event.target as HTMLInputElement).value

  if (props.splitChars.some((char) => input.includes(char))) {
    split(input)
  } else {
    setSearch(input)
  }

  combobox.openDropdown()
}

function onFieldPaste(event: ClipboardEvent) {
  if (!event.clipboardData) {
    return
  }

  // Handled manually so a multi-tag paste is split rather than dropped into the field.
  event.preventDefault()
  split(`${search()}${event.clipboardData.getData('text/plain')}`)
  ;(attrs as any).onPaste?.(event)
}

function onFieldFocus(event: FocusEvent) {
  if (props.openOnFocus) {
    combobox.openDropdown()
  }

  ;(attrs as any).onFocus?.(event)
}

function onFieldBlur(event: FocusEvent) {
  if (props.acceptValueOnBlur) {
    submit(search())
  }

  combobox.closeDropdown()
  ;(attrs as any).onBlur?.(event)
}

function onFieldKeydown(event: KeyboardEvent) {
  // An IME composition ends with Enter; committing a tag there would eat the candidate.
  if (event.isComposing) {
    return
  }

  if (event.key === 'Enter' && search().trim()) {
    event.preventDefault()
    submit(search())
  } else if (props.splitChars.includes(event.key) && search().trim()) {
    event.preventDefault()
    split(search())
  } else if (event.key === 'Backspace' && !search() && current.value.length && !readOnly.value) {
    // Backspace on an empty field removes the last tag.
    removeAt(current.value.length - 1)
  }

  ;(attrs as any).onKeydown?.(event)
}

/** Falls back to a synthetic option, since a free-form tag has no option behind it. */
function optionFor(item: string): TagsInputOption {
  return (
    (lockup.value[item] as TagsInputOption | undefined) ?? {
      value: item,
      label: item,
      disabled: false,
    }
  )
}

/** The slot takes precedence over the prop. */
const customPill = computed(() => slots.renderPill ?? props.renderPill)

const renderPill = (item: string, index: number): VNodeChild =>
  customPill.value?.({
    option: optionFor(item),
    value: item,
    onRemove: () => removeAt(index),
    disabled: disabled.value,
  })

/** The placeholder is only shown while nothing is selected, so pills are not covered. */
const fieldPlaceholder = computed(() =>
  current.value.length === 0 ? (attrs as any).placeholder : undefined,
)

const hiddenWhenEmpty = computed(
  () => props.nothingFoundMessage == null && !slots.nothingFoundMessage && !slots.nothingFound,
)
</script>

<template>
  <Combobox
    v-bind="props.comboboxProps"
    :store="combobox"
    :read-only="readOnly"
    :size="comboboxSize"
    __static-selector="TagsInput"
    @option-submit="onOptionSubmit"
  >
    <ComboboxTarget target-type="input" :with-expanded-attribute="true">
      <PillsInput
        v-bind="forwarded"
        __static-selector="TagsInput"
        :disabled="disabled"
        :right-section="rightSection"
        :right-section-pointer-events="canClear ? 'all' : undefined"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>

        <PillGroup>
          <template v-for="(item, index) in current" :key="`${item}-${index}`">
            <component :is="() => renderPill(item, index)" v-if="customPill" />
            <Pill
              v-else
              :with-remove-button="!readOnly"
              :disabled="disabled"
              @remove="() => removeAt(index)"
            >
              {{ item }}
            </Pill>
          </template>

          <PillsInputField
            :model-value="search()"
            :readonly="readOnly"
            :disabled="disabled"
            :placeholder="fieldPlaceholder"
            @input="onFieldInput"
            @paste="onFieldPaste"
            @focus="onFieldFocus"
            @blur="onFieldBlur"
            @click="combobox.openDropdown()"
            @keydown="onFieldKeydown"
          />
        </PillGroup>
      </PillsInput>
    </ComboboxTarget>

    <OptionsDropdown
      :data="parsed as any"
      :hidden="disabled || readOnly"
      :search="search()"
      :filter="props.filter as any"
      :limit="props.limit"
      :hidden-when-empty="hiddenWhenEmpty"
      :nothing-found-message="props.nothingFoundMessage"
      :with-scroll-area="props.withScrollArea"
      :max-dropdown-height="props.maxDropdownHeight"
      :render-option="props.renderOption"
      :scroll-area-props="props.scrollAreaProps"
    >
      <template v-if="slots.renderOption" #renderOption="scope">
        <slot name="renderOption" v-bind="scope" />
      </template>
      <template v-if="slots.nothingFoundMessage || slots.nothingFound" #nothingFound>
        <slot v-if="slots.nothingFoundMessage" name="nothingFoundMessage" />
        <slot v-else name="nothingFound" />
      </template>
    </OptionsDropdown>
  </Combobox>

  <ComboboxHiddenInput
    v-bind="props.hiddenInputProps"
    :value="current"
    :values-divider="props.hiddenInputValuesDivider"
    :name="(attrs as any).name"
    :form="(attrs as any).form"
    :disabled="disabled"
  />
</template>
