<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs } from 'vue'
import { ActionIcon, CheckIcon } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import DatePicker from '../DatePicker/DatePicker.vue'
import TimePicker from '../TimePicker/TimePicker.vue'
import { assignTime } from '../../utils'
import type { DatePickerValueType, DateTimePickerProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'InlineDateTimePicker', inheritAttrs: false })
const props = withDefaults(defineProps<DateTimePickerProps>(), {
  valueFormat: 'MMMM D, YYYY h:mm A',
  clearable: false,
  withSeconds: false,
  size: 'sm',
})
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  change: [value: Date | null]
  submit: []
}>()
const attrs = useAttrs()
const [value, setValue] = useUncontrolled<Date | null>({
  value: computed(() =>
    props.modelValue === undefined
      ? undefined
      : props.modelValue === null
        ? null
        : new Date(props.modelValue),
  ),
  defaultValue: props.defaultValue ? new Date(props.defaultValue) : null,
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const date = computed(() => (value.value ? dayjs(value.value).format('YYYY-MM-DD') : null))
const time = computed(() =>
  value.value ? dayjs(value.value).format(props.withSeconds ? 'HH:mm:ss' : 'HH:mm') : '',
)
const forwardedHoursRef = { value: null as any }
function updateDate(next: DatePickerValueType) {
  if (!next || Array.isArray(next)) return
  setValue(assignTime(next, `2024-01-01 ${time.value || '00:00'}`))
  forwardedHoursRef.value?.focus?.()
}
function updateTime(next: string) {
  if (date.value) setValue(assignTime(date.value, `2024-01-01 ${next}`))
}
function submit(event: MouseEvent) {
  props.submitButtonProps?.onClick?.(event)
  emit('submit')
}
</script>

<template>
  <div v-bind="attrs" :class="[classes.dateTimePicker, attrs.class]">
    <DatePicker :full-width="props.fullWidth" :model-value="date" @change="updateDate" />
    <div :class="classes.timeWrapper">
      <div :class="classes.timeInput">
        <TimePicker
          :model-value="time"
          :with-seconds="props.withSeconds"
          :size="props.size"
          :hours-ref="forwardedHoursRef"
          @change="updateTime"
        />
      </div>
      <ActionIcon
        variant="default"
        :size="`input-${props.size || 'sm'}`"
        data-mantine-stop-propagation
        v-bind="props.submitButtonProps"
        @click="submit"
        ><CheckIcon size="30%"
      /></ActionIcon>
    </div>
  </div>
</template>
