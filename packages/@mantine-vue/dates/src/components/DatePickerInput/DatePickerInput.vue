<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import PickerInputBase from '../PickerInputBase/PickerInputBase.vue'
import Picker from '../DatePicker/DatePicker.vue'
import { formatValue } from '../../utils'
import type { DatePickerInputProps, DatePickerValueType } from '../../types'

defineOptions({ name: 'DatePickerInput', inheritAttrs: false })
const props = withDefaults(defineProps<DatePickerInputProps>(), {
  type: 'default',
  valueFormat: 'MMMM D, YYYY',
  labelSeparator: '–',
  clearable: false,
  closeOnChange: true,
  sortDates: true,
  allowDeselect: true,
  withCellSpacing: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValueType]
  change: [value: DatePickerValueType]
  'dropdown-open': []
  'dropdown-close': []
}>()
const attrs = useAttrs()
const opened = ref(false)
const finalValue = computed<DatePickerValueType>(() =>
  props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
)
const [value, setValue] = useUncontrolled<DatePickerValueType>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: finalValue.value,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const formatted = computed(() =>
  formatValue(
    value.value,
    props.type,
    props.valueFormat,
    props.locale,
    props.labelSeparator,
    props.valueFormatter,
  ),
)
const pickerProps = computed(() => {
  const {
    modelValue,
    defaultValue,
    valueFormat,
    labelSeparator,
    valueFormatter,
    closeOnChange,
    formattedValue,
    dropdownOpened,
    dropdownType,
    label,
    placeholder,
    clearable,
    disabled,
    required,
    error,
    size,
    variant,
    ...rest
  } = props
  void modelValue
  void defaultValue
  void valueFormat
  void labelSeparator
  void valueFormatter
  void closeOnChange
  void formattedValue
  void dropdownOpened
  void dropdownType
  void label
  void placeholder
  void clearable
  void disabled
  void required
  void error
  void size
  void variant
  return rest
})
function change(next: DatePickerValueType, close: () => void) {
  setValue(next)
  if (props.closeOnChange && props.type === 'default') close()
}
function openDropdown() {
  opened.value = true
  emit('dropdown-open')
}
function closeDropdown() {
  opened.value = false
  emit('dropdown-close')
}
</script>

<template>
  <PickerInputBase
    v-bind="attrs"
    :formatted-value="formatted"
    :label="props.label"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :required="props.required"
    :error="props.error"
    :size="props.size"
    :variant="props.variant"
    :dropdown-type="props.dropdownType"
    :dropdown-opened="opened"
    @dropdown-open="openDropdown"
    @dropdown-close="closeDropdown"
    @clear="setValue(finalValue)"
  >
    <template #default="{ close }"
      ><Picker
        v-bind="pickerProps"
        :type="props.type"
        :model-value="value"
        :sort-dates="props.sortDates"
        @change="change($event, close)"
    /></template>
  </PickerInputBase>
</template>
