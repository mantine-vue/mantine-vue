<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import InlineDateTimePicker from '../InlineDateTimePicker/InlineDateTimePicker.vue'
import PickerInputBase from '../PickerInputBase/PickerInputBase.vue'
import type { DateTimePickerProps } from '../../types'

defineOptions({ name: 'DateTimePicker', inheritAttrs: false })
const props = withDefaults(defineProps<DateTimePickerProps>(), {
  valueFormat: 'MMMM D, YYYY h:mm A',
  clearable: false,
  withSeconds: false,
  size: 'sm',
})
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  change: [value: Date | null]
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
const formatted = computed(() => (value.value ? dayjs(value.value).format(props.valueFormat) : ''))
</script>

<template>
  <PickerInputBase
    v-bind="attrs"
    :formatted-value="formatted"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :required="props.required"
    :error="props.error"
    :label="props.label"
    :placeholder="props.placeholder"
    :size="props.size"
    :variant="props.variant"
    :dropdown-type="props.dropdownType"
    @clear="setValue(null)"
  >
    <template #default="{ close }"
      ><InlineDateTimePicker
        :model-value="value"
        :with-seconds="props.withSeconds"
        :size="props.size"
        :submit-button-props="props.submitButtonProps"
        :full-width="false"
        @change="setValue"
        @submit="close"
    /></template>
  </PickerInputBase>
</template>
