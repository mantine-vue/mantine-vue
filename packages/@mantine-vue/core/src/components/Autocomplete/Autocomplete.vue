<script setup lang="ts">
import { computed, h, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import { useId } from '@mantine-vue/hooks'
import {
  ComboboxClearButton,
  ComboboxTarget,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
} from '../Combobox'
import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import type { AutocompleteProps, AutocompleteSlots } from './Autocomplete.types'

defineOptions({
  name: 'Autocomplete',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AutocompleteProps>(), {
  modelValue: undefined,
  defaultValue: '',
  data: () => [],
  dropdownOpened: undefined,
  defaultDropdownOpened: false,
  selectFirstOptionOnChange: false,
  selectFirstOptionOnDropdownOpen: false,
  withScrollArea: true,
  clearable: false,
  autoSelectOnBlur: false,
  openOnFocus: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'dropdown-open': []
  'dropdown-close': []
  'option-submit': [value: string]
  clear: []
}>()

defineSlots<AutocompleteSlots>()

const slots = useSlots()
const attrs = useAttrs()

const internal = ref(props.defaultValue)

const current = () => props.modelValue ?? internal.value
const controlled = () => props.modelValue !== undefined

function change(value: string) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
  combobox.resetSelectedOption()
}

const parsed = computed(() => getParsedComboboxData(props.data))
const lockup = computed(() => getOptionsLockup(parsed.value))

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
    setTimeout(combobox.resetSelectedOption)
  },
})

watch(
  () => current(),
  () => {
    if (props.selectFirstOptionOnChange) {
      nextTick(combobox.selectFirstOption)
    }
  },
)

const id = useId((attrs as any).id)

function clear(event?: MouseEvent) {
  // The clear button lives inside the input, whose click opens the dropdown.
  event?.stopPropagation()
  change('')
  emit('clear')
}

const disabled = computed(() => !!(attrs as any).disabled)
const readOnly = computed(() => !!(attrs as any).readOnly)

const showClear = computed(
  () => props.clearable && !!current() && !disabled.value && !readOnly.value,
)

const rightSection = computed(() =>
  showClear.value
    ? h(ComboboxClearButton, { ...(attrs as any).clearButtonProps, onClick: clear })
    : (attrs as any).rightSection,
)

/**
 * `id`, `rightSection` and `clearButtonProps` are consumed here, so they must not also
 * reach `InputBase` through the fallthrough attributes.
 */
const forwarded = computed(() => {
  const result = { ...attrs }
  delete result.id
  delete result.rightSection
  delete result.clearButtonProps
  return result
})

const comboboxSize = computed(() => (attrs as any).size ?? 'sm')

function onOptionSubmit(value: string) {
  emit('option-submit', value)
  // The input shows the label, not the value, so the lookup is required.
  change(lockup.value[value]?.label ?? value)
  combobox.closeDropdown()
}

function onInput(event: Event) {
  change((event.currentTarget as HTMLInputElement).value)
  combobox.openDropdown()

  if (props.selectFirstOptionOnChange) {
    nextTick(combobox.selectFirstOption)
  }
}

function onFocus(event: FocusEvent) {
  if (props.openOnFocus) {
    combobox.openDropdown()
  }

  ;(attrs as any).onFocus?.(event)
}

function onBlur(event: FocusEvent) {
  if (props.autoSelectOnBlur) {
    combobox.clickSelectedOption()
  }

  combobox.closeDropdown()
  ;(attrs as any).onBlur?.(event)
}

function onClick(event: MouseEvent) {
  combobox.openDropdown()
  ;(attrs as any).onClick?.(event)
}

const labelId = computed(() => ((attrs as any).label ? `${id.value}-label` : undefined))
</script>

<template>
  <Combobox
    v-bind="props.comboboxProps"
    :store="combobox"
    __static-selector="Autocomplete"
    :read-only="readOnly"
    :size="comboboxSize"
    @option-submit="onOptionSubmit"
  >
    <ComboboxTarget :with-expanded-attribute="true" :auto-complete="(attrs as any).autoComplete">
      <!--
        `InputBase` has to be the direct child: `Combobox.Target` clones the child vnode
        to inject `aria-expanded` and the combobox event handlers, so any wrapper would
        swallow them.
      -->
      <InputBase
        v-bind="forwarded"
        :id="id"
        __static-selector="Autocomplete"
        component="input"
        :disabled="disabled"
        :read-only="readOnly"
        :model-value="current()"
        :right-section="rightSection"
        :right-section-pointer-events="showClear ? 'all' : undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClick"
      >
        <!-- The input level slots are forwarded so `label`, `error` and the sections keep working. -->
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </InputBase>
    </ComboboxTarget>

    <OptionsDropdown
      :data="parsed as any"
      :hidden="readOnly || disabled"
      :filter="props.filter"
      :search="current()"
      :limit="props.limit"
      :hidden-when-empty="!slots.nothingFound"
      :with-scroll-area="props.withScrollArea"
      :max-dropdown-height="props.maxDropdownHeight"
      :label-id="labelId"
      :render-option="props.renderOption"
      :scroll-area-props="props.scrollAreaProps"
    >
      <template v-if="slots.renderOption" #renderOption="scope">
        <slot name="renderOption" v-bind="scope" />
      </template>
      <template v-if="slots.nothingFound" #nothingFound>
        <slot name="nothingFound" />
      </template>
    </OptionsDropdown>
  </Combobox>
</template>
