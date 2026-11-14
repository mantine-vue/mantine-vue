<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import PickerInputBase from '../PickerInputBase/PickerInputBase.vue'
import WeekPicker from '../WeekPicker/WeekPicker.vue'
import { useDatesContext } from '../DatesProvider'
import { getWeekFormatter, normalizeWeekValue } from '../WeekPicker/week-utils'
import { formatValue, getDefaultClampedDate } from '../../utils'
import type { DatePickerValueType } from '../../types'
import type { WeekPickerInputProps } from './WeekPickerInput.types'

defineOptions({ name: 'WeekPickerInput', inheritAttrs: false })
const props = withDefaults(defineProps<WeekPickerInputProps>(), {
  type: 'default',
  valueFormat: 'MMM D, YYYY',
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
const context = useDatesContext()
const firstDayOfWeek = computed(() => props.firstDayOfWeek ?? context.firstDayOfWeek)
const opened = ref(false)
const finalValue = computed<DatePickerValueType>(() =>
  props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
)
const [value, setValue] = useUncontrolled<DatePickerValueType>({
  value: computed(() =>
    props.modelValue === undefined
      ? undefined
      : normalizeWeekValue(props.modelValue, firstDayOfWeek.value),
  ),
  defaultValue: normalizeWeekValue(props.defaultValue, firstDayOfWeek.value),
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
    props.valueFormatter || getWeekFormatter(firstDayOfWeek.value),
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
    withPresets,
    label,
    placeholder,
    clearable,
    disabled,
    required,
    error,
    size,
    variant,
    defaultDate,
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
  void withPresets
  void label
  void placeholder
  void clearable
  void disabled
  void required
  void error
  void size
  void variant
  void defaultDate
  return rest
})
const pickerDefaultDate = computed(
  () =>
    (Array.isArray(value.value) ? value.value[0] : value.value) ||
    props.defaultDate ||
    getDefaultClampedDate({ minDate: props.minDate, maxDate: props.maxDate }),
)
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
    :with-presets="!!props.presets?.length"
    :dropdown-opened="opened"
    @dropdown-open="openDropdown"
    @dropdown-close="closeDropdown"
    @clear="setValue(finalValue)"
  >
    <template #default="{ close }"
      ><WeekPicker
        v-bind="pickerProps"
        :type="props.type"
        :model-value="value"
        :default-date="pickerDefaultDate"
        @change="change($event, close)"
    /></template>
  </PickerInputBase>
</template>
