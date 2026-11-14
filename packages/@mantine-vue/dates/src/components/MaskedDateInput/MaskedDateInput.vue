<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, h, ref, useAttrs, watch } from 'vue'
import { CloseButton, InputBase, Popover } from '@mantine-vue/core'
import { useId } from '@mantine-vue/hooks'
import AmPmInput from '../AmPmInput/AmPmInput.vue'
import Calendar from '../Calendar/Calendar.vue'
import { useDatesContext } from '../DatesProvider'
import SpinInput from '../SpinInput/SpinInput.vue'
import { isSameMonth, toDateString } from '../../utils'
import type { DateStringValue } from '../../types'
import { getDaysInMonth } from './masked-date-utils'
import type { MaskedDateInputEmits, MaskedDateInputProps } from './MaskedDateInput.types'
import { useMaskedDateInput, type MaskedDateInputField } from './use-masked-date-input'
import classes from './MaskedDateInput.module.css'

defineOptions({ name: 'MaskedDateInput', inheritAttrs: false })
const props = withDefaults(defineProps<MaskedDateInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  fieldsOrder: () => ['day', 'month', 'year'],
  dateSeparator: '/',
  timeSeparator: ':',
  withTime: false,
  withSeconds: false,
  format: '24h',
  amPmLabels: () => ({ am: 'AM', pm: 'PM' }),
  hoursStep: 1,
  minutesStep: 1,
  secondsStep: 1,
  withDropdown: true,
  clearable: false,
  clearSectionMode: 'both',
  allowDeselect: undefined,
  readOnly: false,
  disabled: false,
  dayInputLabel: 'Day',
  monthInputLabel: 'Month',
  yearInputLabel: 'Year',
  hoursInputLabel: 'Hours',
  minutesInputLabel: 'Minutes',
  secondsInputLabel: 'Seconds',
  amPmInputLabel: 'AM/PM',
  dayPlaceholder: '--',
  monthPlaceholder: '--',
  yearPlaceholder: '----',
  hoursPlaceholder: '--',
  minutesPlaceholder: '--',
  secondsPlaceholder: '--',
  size: 'sm',
  hideOutsideDates: false,
})
const emit = defineEmits<MaskedDateInputEmits>()
const attrs = useAttrs()
const context = useDatesContext()
const fieldId = useId()
const labelId = computed(() => `${fieldId.value}-label`)
const dropdownOpened = ref(false)
let hasFocus = false

const controller = useMaskedDateInput({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
  minDate: () => toDateString(props.minDate) || undefined,
  maxDate: () => toDateString(props.maxDate) || undefined,
  withTime: () => props.withTime,
  withSeconds: () => props.withSeconds,
  format: () => props.format,
  amPmLabels: () => props.amPmLabels,
  clearable: () => props.clearable,
  readOnly: () => props.readOnly,
  disabled: () => props.disabled,
  fieldsOrder: () => props.fieldsOrder,
  pasteSplit: () => props.pasteSplit,
})

const values = controller.values
const allowDeselect = computed(() =>
  props.allowDeselect !== undefined ? props.allowDeselect : props.clearable,
)

const fieldsSequence = computed<MaskedDateInputField[]>(() => {
  const sequence: MaskedDateInputField[] = [...props.fieldsOrder]
  if (props.withTime) {
    sequence.push('hours', 'minutes')
    if (props.withSeconds) sequence.push('seconds')
    if (props.format === '12h') sequence.push('amPm')
  }
  return sequence
})

function focusNext(field: MaskedDateInputField) {
  const index = fieldsSequence.value.indexOf(field)
  const next = fieldsSequence.value[index + 1]
  if (next) controller.focus(next)
}

function focusPrevious(field: MaskedDateInputField) {
  const index = fieldsSequence.value.indexOf(field)
  if (index > 0) controller.focus(fieldsSequence.value[index - 1])
}

const yearComplete = computed(() => values.year.value !== null && values.year.value >= 1000)

const currentDateValue = computed<DateStringValue | null>(() =>
  values.day.value !== null && values.month.value !== null && yearComplete.value
    ? `${String(values.year.value).padStart(4, '0')}-${String(values.month.value).padStart(2, '0')}-${String(values.day.value).padStart(2, '0')}`
    : null,
)

const calendarDate = ref<DateStringValue | undefined>(
  currentDateValue.value || toDateString(props.defaultDate) || undefined,
)
watch(currentDateValue, (next) => {
  if (next !== null) calendarDate.value = next
})

function setCalendarDate(next: DateStringValue) {
  calendarDate.value = next
  emit('update:date', next)
  emit('date-change', next)
}

const dayMax = computed(() =>
  getDaysInMonth(values.month.value, yearComplete.value ? values.year.value : null),
)

const isFirstField = (field: 'day' | 'month' | 'year') => props.fieldsOrder[0] === field

function getDayProps(day: DateStringValue) {
  const external = props.getDayProps?.(day) || {}
  return {
    ...external,
    selected: currentDateValue.value !== null && dayjs(currentDateValue.value).isSame(day, 'day'),
    onClick: (event: MouseEvent) => {
      external.onClick?.(event)
      if (
        allowDeselect.value &&
        currentDateValue.value !== null &&
        dayjs(currentDateValue.value).isSame(day, 'day')
      ) {
        controller.clear()
      } else {
        controller.setFromDateString(day)
      }
      dropdownOpened.value = false
    },
  }
}

const getMonthControlProps = (date: DateStringValue) => ({
  selected: currentDateValue.value !== null ? isSameMonth(date, currentDateValue.value) : false,
  ...props.getMonthControlProps?.(date),
})

const getYearControlProps = (date: DateStringValue) => ({
  selected:
    currentDateValue.value !== null ? dayjs(date).isSame(currentDateValue.value, 'year') : false,
  ...props.getYearControlProps?.(date),
})

function handleFocus(event: FocusEvent) {
  if (!hasFocus) {
    hasFocus = true
    emit('focus', event)
  }
}

function handleFocusOut(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    hasFocus = false
    controller.clampToRange()
    emit('blur', event)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') dropdownOpened.value = false
}

function handleTargetClick(event: MouseEvent) {
  ;(attrs as any).onClick?.(event)
  controller.focus(props.fieldsOrder[0])
}

const clearButton = computed(() =>
  h(CloseButton, {
    ...props.clearButtonProps,
    size: props.size,
    onMousedown: (event: MouseEvent) => {
      event.preventDefault()
      props.clearButtonProps?.onMousedown?.(event)
    },
    onClick: (event: MouseEvent) => {
      controller.clear()
      props.clearButtonProps?.onClick?.(event)
    },
  }),
)

const dropdownEnabled = computed(() => props.withDropdown && !props.disabled && !props.readOnly)

function setFieldRef(field: MaskedDateInputField, node: any) {
  controller.elements[field].value = node
}

defineExpose({
  dayInput: controller.elements.day,
  monthInput: controller.elements.month,
  yearInput: controller.elements.year,
  hoursInput: controller.elements.hours,
  minutesInput: controller.elements.minutes,
  secondsInput: controller.elements.seconds,
  amPmInput: controller.elements.amPm,
  clear: controller.clear,
  focus: controller.focus,
})
</script>

<template>
  <Popover
    :opened="dropdownEnabled && dropdownOpened"
    :trap-focus="false"
    :return-focus="false"
    position="bottom-start"
    :with-roles="false"
    v-bind="props.popoverProps"
    @update:opened="
      (next: boolean) => {
        if (!next) dropdownOpened = false
      }
    "
  >
    <Popover.Target>
      <InputBase
        v-bind="attrs"
        component="div"
        :size="props.size"
        :disabled="props.disabled"
        :label="props.label"
        :label-props="{ htmlFor: fieldId, id: labelId, ...((attrs as any).labelProps || {}) }"
        :right-section="props.rightSection"
        :__clear-section="clearButton"
        :__clearable="controller.isClearable.value"
        :__clear-section-mode="props.clearSectionMode"
        __static-selector="MaskedDateInput"
        @click="handleTargetClick"
        @mousedown.prevent
        @focusin="dropdownOpened = true"
        @focusout="dropdownOpened = false"
      >
        <div :class="classes.fieldsRoot" dir="ltr">
          <div
            :class="classes.fieldsGroup"
            role="group"
            :aria-labelledby="props.label ? labelId : undefined"
            @focusout="handleFocusOut"
            @keydown="handleKeydown"
            @click.capture="dropdownOpened = true"
          >
            <template v-for="(field, index) in props.fieldsOrder" :key="field">
              <span v-if="index > 0" :class="classes.dateSeparator">{{ props.dateSeparator }}</span>
              <SpinInput
                v-if="field === 'day'"
                :id="isFirstField('day') ? fieldId : undefined"
                v-bind="props.dayInputProps"
                :ref="(node: any) => setFieldRef('day', node)"
                :class="[classes.field, props.dayInputProps?.class]"
                :model-value="values.day.value"
                :min="1"
                :max="dayMax"
                :step="1"
                :aria-label="props.dayInputLabel"
                :tabindex="isFirstField('day') ? undefined : -1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                :placeholder="props.dayPlaceholder"
                allow-temporary-zero
                @change="controller.setDay"
                @paste="controller.onPaste"
                @next-input="focusNext('day')"
                @previous-input="focusPrevious('day')"
                @focus="handleFocus"
              />
              <SpinInput
                v-else-if="field === 'month'"
                :id="isFirstField('month') ? fieldId : undefined"
                v-bind="props.monthInputProps"
                :ref="(node: any) => setFieldRef('month', node)"
                :class="[classes.field, props.monthInputProps?.class]"
                :model-value="values.month.value"
                :min="1"
                :max="12"
                :step="1"
                :aria-label="props.monthInputLabel"
                :tabindex="isFirstField('month') ? undefined : -1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                :placeholder="props.monthPlaceholder"
                allow-temporary-zero
                @change="controller.setMonth"
                @paste="controller.onPaste"
                @next-input="focusNext('month')"
                @previous-input="focusPrevious('month')"
                @focus="handleFocus"
              />
              <SpinInput
                v-else
                :id="isFirstField('year') ? fieldId : undefined"
                v-bind="props.yearInputProps"
                :ref="(node: any) => setFieldRef('year', node)"
                :class="[classes.field, props.yearInputProps?.class]"
                :style="[{ width: 'calc(4ch + 0.3em)' }, props.yearInputProps?.style]"
                :model-value="values.year.value"
                :min="1"
                :max="9999"
                :step="1"
                :aria-label="props.yearInputLabel"
                :tabindex="isFirstField('year') ? undefined : -1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                :placeholder="props.yearPlaceholder"
                disable-auto-advance
                :max-digits="4"
                :pad-value="String"
                @change="controller.setYear"
                @paste="controller.onPaste"
                @next-input="focusNext('year')"
                @previous-input="focusPrevious('year')"
                @focus="handleFocus"
              />
            </template>

            <template v-if="props.withTime">
              <span :class="classes.dateSeparator">&nbsp;</span>
              <SpinInput
                v-bind="props.hoursInputProps"
                :ref="(node: any) => setFieldRef('hours', node)"
                :class="[classes.field, props.hoursInputProps?.class]"
                :model-value="values.hours.value"
                :min="props.format === '12h' ? 1 : 0"
                :max="props.format === '12h' ? 12 : 23"
                :allow-temporary-zero="props.format === '12h'"
                :step="props.hoursStep"
                :aria-label="props.hoursInputLabel"
                :tabindex="-1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                :placeholder="props.hoursPlaceholder"
                @change="controller.setHours"
                @paste="controller.onPaste"
                @next-input="focusNext('hours')"
                @previous-input="focusPrevious('hours')"
                @focus="handleFocus"
              />
              <span :class="classes.timeSeparator">{{ props.timeSeparator }}</span>
              <SpinInput
                v-bind="props.minutesInputProps"
                :ref="(node: any) => setFieldRef('minutes', node)"
                :class="[classes.field, props.minutesInputProps?.class]"
                :model-value="values.minutes.value"
                :min="0"
                :max="59"
                :step="props.minutesStep"
                :aria-label="props.minutesInputLabel"
                :tabindex="-1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                :placeholder="props.minutesPlaceholder"
                @change="controller.setMinutes"
                @paste="controller.onPaste"
                @next-input="focusNext('minutes')"
                @previous-input="focusPrevious('minutes')"
                @focus="handleFocus"
              />
              <template v-if="props.withSeconds">
                <span :class="classes.timeSeparator">{{ props.timeSeparator }}</span>
                <SpinInput
                  v-bind="props.secondsInputProps"
                  :ref="(node: any) => setFieldRef('seconds', node)"
                  :class="[classes.field, props.secondsInputProps?.class]"
                  :model-value="values.seconds.value"
                  :min="0"
                  :max="59"
                  :step="props.secondsStep"
                  :aria-label="props.secondsInputLabel"
                  :tabindex="-1"
                  :read-only="props.readOnly"
                  :disabled="props.disabled"
                  :placeholder="props.secondsPlaceholder"
                  @change="controller.setSeconds"
                  @paste="controller.onPaste"
                  @next-input="focusNext('seconds')"
                  @previous-input="focusPrevious('seconds')"
                  @focus="handleFocus"
                />
              </template>
              <AmPmInput
                v-if="props.format === '12h'"
                v-bind="props.amPmSelectProps"
                :class="classes.field"
                :ref="(node: any) => setFieldRef('amPm', node)"
                :model-value="values.amPm.value"
                :labels="props.amPmLabels"
                :aria-label="props.amPmInputLabel"
                :tabindex="-1"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                @change="controller.setAmPm"
                @paste="controller.onPaste"
                @previous-input="focusPrevious('amPm')"
                @focus="handleFocus"
              />
            </template>
          </div>
        </div>

        <input
          type="hidden"
          :name="props.name"
          :form="props.form"
          :value="controller.hiddenInputValue.value"
          v-bind="props.hiddenInputProps"
        />
      </InputBase>
    </Popover.Target>
    <Popover.Dropdown :class="classes.dropdown" data-dates-dropdown @mousedown.prevent>
      <Calendar
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :locale="props.locale || context.locale"
        :first-day-of-week="props.firstDayOfWeek"
        :weekend-days="props.weekendDays"
        :hide-outside-dates="props.hideOutsideDates"
        :exclude-date="props.excludeDate"
        :default-level="props.defaultLevel"
        :max-level="props.maxLevel"
        :date="props.date ?? calendarDate"
        :get-day-props="getDayProps"
        :get-month-control-props="getMonthControlProps"
        :get-year-control-props="getYearControlProps"
        @date-change="setCalendarDate"
      />
    </Popover.Dropdown>
  </Popover>
</template>
