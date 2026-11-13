<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, useAttrs, watch } from 'vue'
import { Box, CloseButton, InputBase, Popover } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import Calendar from '../Calendar/Calendar.vue'
import { PresetsList } from '../PresetsList'
import classes from './DateInput.module.css'
import { dateStringParser, isDateValid, isSameDate, toDateString } from '../../utils'
import type { DateInputProps, DateStringValue, DateValue } from '../../types'

defineOptions({ name: 'DateInput', inheritAttrs: false })
const props = withDefaults(defineProps<DateInputProps>(), {
  valueFormat: 'MMMM D, YYYY',
  clearable: false,
  withTime: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: DateValue]; change: [value: DateValue] }>()
const attrs = useAttrs()
const [value, setValue] = useUncontrolled<DateValue>({
  value: computed(() =>
    props.modelValue === undefined ? undefined : toDateString(props.modelValue),
  ),
  defaultValue: toDateString(props.defaultValue),
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const format = (next: DateValue) =>
  next
    ? typeof props.valueFormat === 'function'
      ? props.valueFormat(toDateString(next)!)
      : dayjs(next)
          .locale(props.locale || 'en')
          .format(props.valueFormat)
    : ''
const inputValue = ref(format(value.value))
const opened = ref(false)
watch(value, (next) => {
  if (!opened.value) inputValue.value = format(next)
})
function parse(raw: string) {
  let parsed: string | null
  if (props.dateParser) {
    parsed = props.dateParser(raw)
  } else if (typeof props.valueFormat === 'function') {
    const value = dayjs(raw)
    parsed = value.isValid()
      ? value.format(props.withTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
      : null
  } else {
    const value = dayjs(raw, props.valueFormat, props.locale || 'en', true)
    parsed = value.isValid()
      ? value.format(props.withTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
      : dateStringParser(raw, props.valueFormat, props.locale)
  }
  return parsed && isDateValid({ date: parsed, minDate: props.minDate, maxDate: props.maxDate })
    ? parsed
    : null
}
function commit() {
  opened.value = false
  if (!inputValue.value.trim()) {
    if (props.clearable) setValue(null)
    else inputValue.value = format(value.value)
    return
  }
  const parsed = parse(inputValue.value)
  if (parsed) setValue(parsed)
  else inputValue.value = format(value.value)
}
function select(date: DateStringValue) {
  setValue(date)
  inputValue.value = format(date)
  opened.value = false
}
function clear(event: MouseEvent) {
  event.stopPropagation()
  inputValue.value = ''
  setValue(null)
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') opened.value = false
}
</script>

<template>
  <Box>
    <Popover v-model:opened="opened" position="bottom-start">
      <Popover.Target>
        <InputBase
          v-bind="attrs"
          :model-value="inputValue"
          :right-section-pointer-events="props.clearable && value ? 'all' : undefined"
          @input="inputValue = ($event.target as HTMLInputElement).value"
          @focus="opened = true"
          @click="opened = true"
          @blur="commit"
          @keydown="onKeydown"
        >
          <template v-if="props.clearable && value" #rightSection
            ><CloseButton @mousedown.stop @click="clear"
          /></template>
        </InputBase>
      </Popover.Target>
      <Popover.Dropdown
        :class="classes.dropdown"
        data-dates-dropdown
        :data-with-presets="props.presets?.length ? true : undefined"
        @mousedown.prevent
      >
        <div v-if="props.presets?.length" :class="classes.datePickerRoot">
          <PresetsList
            :presets="props.presets"
            @preset-select="(preset: DateValue) => preset && select(preset)"
          />
          <Calendar
            :default-date="value || undefined"
            :min-date="props.minDate"
            :max-date="props.maxDate"
            :locale="props.locale"
            :get-day-props="
              (date) => ({ selected: isSameDate(date, value), onClick: () => select(date) })
            "
          />
        </div>
        <Calendar
          v-else
          :default-date="value || undefined"
          :min-date="props.minDate"
          :max-date="props.maxDate"
          :locale="props.locale"
          :get-day-props="
            (date) => ({ selected: isSameDate(date, value), onClick: () => select(date) })
          "
        />
      </Popover.Dropdown>
    </Popover>
  </Box>
</template>
