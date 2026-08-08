<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Button, CloseButton, Group, InputBase, Popover } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import AmPmInput from '../AmPmInput/AmPmInput.vue'
import SpinInput from '../SpinInput/SpinInput.vue'
import TimeControlsList from '../TimeControlsList/TimeControlsList.vue'
import { clampTime, getParsedTime, getTimeString } from '../../utils'
import type { TimePickerProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'TimePicker', inheritAttrs: false })
const props = withDefaults(defineProps<TimePickerProps>(), {
  type: 'time',
  withSeconds: false,
  format: '24h',
  amPmLabels: () => ({ am: 'AM', pm: 'PM' }),
  hoursStep: 1,
  minutesStep: 1,
  secondsStep: 1,
  clearable: false,
  withDropdown: false,
  disabled: false,
  readOnly: false,
  size: 'sm',
  closeDropdownOnPresetSelect: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string] }>()
const attrs = useAttrs()
const effectiveFormat = computed<'12h' | '24h'>(() =>
  props.type === 'duration' ? '24h' : props.format,
)
const [value, setValue] = useUncontrolled<string>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const parsed = computed(() =>
  getParsedTime({ time: value.value, format: effectiveFormat.value, amPmLabels: props.amPmLabels }),
)
const acceptValueSync = ref(true)
const initialTimeString = getTimeString({
  ...parsed.value,
  format: effectiveFormat.value,
  withSeconds: props.withSeconds,
  amPmLabels: props.amPmLabels,
})
const wasInvalidBefore = ref(!initialTimeString.valid)
const hours = ref(parsed.value.hours),
  minutes = ref(parsed.value.minutes),
  seconds = ref(parsed.value.seconds),
  amPm = ref(parsed.value.amPm)
watch(value, (nextValue) => {
  if (!acceptValueSync.value) {
    acceptValueSync.value = true
    return
  }
  const next = getParsedTime({
    time: nextValue,
    format: effectiveFormat.value,
    amPmLabels: props.amPmLabels,
  })
  hours.value = next.hours
  minutes.value = next.minutes
  seconds.value = next.seconds
  amPm.value = next.amPm
  wasInvalidBefore.value = !getTimeString({
    ...next,
    format: effectiveFormat.value,
    withSeconds: props.withSeconds,
    amPmLabels: props.amPmLabels,
  }).valid
})
const hoursInput = ref<any>(),
  minutesInput = ref<any>(),
  secondsInput = ref<any>(),
  amPmInput = ref<any>()
const element = (target: any) => target?.$el ?? target
function focus(field: 'hours' | 'minutes' | 'seconds' | 'amPm') {
  element(
    field === 'hours'
      ? hoursInput.value
      : field === 'minutes'
        ? minutesInput.value
        : field === 'seconds'
          ? secondsInput.value
          : amPmInput.value,
  )?.focus?.()
}
watch(
  hoursInput,
  (next) => {
    if (props.hoursRef) Reflect.set(props.hoursRef, 'value', element(next))
  },
  { immediate: true },
)
function commit() {
  const result = getTimeString({
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value,
    format: effectiveFormat.value,
    withSeconds: props.withSeconds,
    amPm: amPm.value,
    amPmLabels: props.amPmLabels,
  })
  if (result.valid) {
    acceptValueSync.value = false
    wasInvalidBefore.value = false
    setValue(clampTime(result.value, props.min, props.max))
  } else if (!wasInvalidBefore.value) {
    acceptValueSync.value = false
    wasInvalidBefore.value = true
    setValue('')
  }
}
function setHours(next: number | null) {
  hours.value =
    effectiveFormat.value === '12h' && typeof next === 'number' && next > 12
      ? ((next - 1) % 12) + 1
      : next
  commit()
}
function setMinutes(next: number | null) {
  minutes.value = next
  commit()
}
function setSeconds(next: number | null) {
  seconds.value = next
  commit()
}
function setAmPm(next: string | null) {
  amPm.value = next
  commit()
}
function clear() {
  hours.value = null
  minutes.value = null
  seconds.value = null
  amPm.value = null
  acceptValueSync.value = false
  wasInvalidBefore.value = true
  setValue('')
  focus('hours')
}
const isClearable = computed(
  () =>
    props.clearable &&
    !props.readOnly &&
    !props.disabled &&
    [hours.value, minutes.value, seconds.value, amPm.value].some((item) => item !== null),
)
const opened = ref(false)
function selectPreset(next: string) {
  setValue(next)
  if (props.closeDropdownOnPresetSelect) opened.value = false
}
function paste(event: ClipboardEvent) {
  if (props.readOnly || props.disabled) return
  const raw = event.clipboardData?.getData('text').trim()
  if (!raw || !/^\d+:\d{2}(?::\d{2})?(?:\s+[aApP][mM])?$/.test(raw)) return
  const next = getParsedTime({
    time: raw,
    format: effectiveFormat.value,
    amPmLabels: props.amPmLabels,
  })
  if (
    next.hours === null ||
    next.minutes === null ||
    next.minutes > 59 ||
    (props.withSeconds && (next.seconds === null || next.seconds > 59)) ||
    (props.type === 'time' && effectiveFormat.value === '24h' && next.hours > 23)
  )
    return
  event.preventDefault()
  hours.value = next.hours
  minutes.value = next.minutes
  seconds.value = props.withSeconds ? next.seconds : null
  amPm.value = next.amPm
  const result = getTimeString({
    ...next,
    seconds: props.withSeconds ? next.seconds : null,
    format: effectiveFormat.value,
    withSeconds: props.withSeconds,
    amPmLabels: props.amPmLabels,
  })
  if (result.valid) setValue(clampTime(result.value, props.min, props.max))
}
function openDropdown() {
  if (props.type !== 'duration' && props.withDropdown) opened.value = true
}
function handleTargetClick() {
  focus('hours')
  openDropdown()
}
function focusout(event: FocusEvent) {
  if (
    props.withDropdown &&
    !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)
  )
    opened.value = false
}
</script>

<template>
  <Popover
    :opened="props.type !== 'duration' && props.withDropdown && opened"
    position="bottom-start"
    :transition-props="{ duration: 0 }"
    @update:opened="
      (next) => {
        if (!next) opened = false
      }
    "
  >
    <Popover.Target>
      <InputBase
        v-bind="attrs"
        component="div"
        :size="props.size"
        :disabled="props.disabled"
        :right-section-pointer-events="isClearable ? 'all' : undefined"
        @click="handleTargetClick"
        @mousedown.prevent
        @focusin="openDropdown"
        @focusout="focusout"
      >
        <div :class="classes.timePickerFieldsRoot" dir="ltr">
          <div :class="classes.timePickerFieldsGroup">
            <SpinInput
              ref="hoursInput"
              :class="classes.timePickerField"
              :model-value="hours"
              :min="effectiveFormat === '12h' ? 1 : 0"
              :max="props.type === 'duration' ? Infinity : effectiveFormat === '12h' ? 12 : 23"
              :step="props.hoursStep"
              :allow-temporary-zero="effectiveFormat === '12h'"
              :disable-auto-advance="props.type === 'duration'"
              :read-only="props.readOnly"
              :disabled="props.disabled"
              @next-input="focus('minutes')"
              @paste="paste"
              @change="setHours"
            />
            <span>:</span>
            <SpinInput
              ref="minutesInput"
              :class="classes.timePickerField"
              :model-value="minutes"
              :min="0"
              :max="59"
              :step="props.minutesStep"
              :read-only="props.readOnly"
              :disabled="props.disabled"
              @previous-input="focus('hours')"
              @next-input="focus(props.withSeconds ? 'seconds' : 'amPm')"
              @change="setMinutes"
            />
            <template v-if="props.withSeconds"
              ><span>:</span
              ><SpinInput
                ref="secondsInput"
                :class="classes.timePickerField"
                :model-value="seconds"
                :min="0"
                :max="59"
                :step="props.secondsStep"
                :read-only="props.readOnly"
                :disabled="props.disabled"
                @previous-input="focus('minutes')"
                @next-input="focus('amPm')"
                @change="setSeconds"
            /></template>
            <AmPmInput
              v-if="effectiveFormat === '12h'"
              ref="amPmInput"
              :model-value="amPm"
              :labels="props.amPmLabels"
              :read-only="props.readOnly"
              :disabled="props.disabled"
              @previous-input="focus(props.withSeconds ? 'seconds' : 'minutes')"
              @change="setAmPm"
            />
          </div>
        </div>
        <template v-if="isClearable" #rightSection
          ><CloseButton :size="props.size" @mousedown.prevent @click="clear"
        /></template>
      </InputBase>
    </Popover.Target>
    <Popover.Dropdown :class="classes.timePickerDropdown" @mousedown.prevent>
      <Group v-if="props.presets?.length" :gap="4" :class="classes.timePickerPresetsGroup"
        ><Button
          v-for="preset in props.presets"
          :key="preset.value"
          size="xs"
          variant="light"
          @click="selectPreset(preset.value)"
          >{{ preset.label }}</Button
        ></Group
      >
      <div v-else :class="classes.timePickerControlsListGroup">
        <TimeControlsList
          :min="effectiveFormat === '12h' ? 1 : 0"
          :max="effectiveFormat === '12h' ? 12 : 23"
          :step="props.hoursStep"
          :value="hours"
          @select="setHours"
        /><TimeControlsList
          :min="0"
          :max="59"
          :step="props.minutesStep"
          :value="minutes"
          @select="setMinutes"
        /><TimeControlsList
          v-if="props.withSeconds"
          :min="0"
          :max="59"
          :step="props.secondsStep"
          :value="seconds"
          @select="setSeconds"
        />
      </div>
    </Popover.Dropdown>
  </Popover>
</template>
