<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, getCurrentInstance, nextTick, ref, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import Calendar from '../Calendar/Calendar.vue'
import { PresetsList } from '../PresetsList'
import QuarterLevelGroup from '../QuarterLevelGroup/QuarterLevelGroup.vue'
import { normalizeQuarterValue } from '../QuartersList/quarters-utils'
import {
  getDefaultClampedDate,
  getNextPickerValue,
  getQuarterStart,
  toDateString,
} from '../../utils'
import type { DatePickerValueType, DatesRangeValue, DateStringValue } from '../../types'
import type {
  QuarterPickerEmits,
  QuarterPickerLevel,
  QuarterPickerProps,
} from './QuarterPicker.types'
import classes from './QuarterPicker.module.css'

defineOptions({ name: 'QuarterPicker', inheritAttrs: false })
const props = withDefaults(defineProps<QuarterPickerProps>(), {
  type: 'default',
  allowDeselect: true,
  sortDates: true,
  maxLevel: 'decade',
  numberOfColumns: 1,
  quartersListFormat: '[Q]Q',
  yearLabelFormat: 'YYYY',
  yearsListFormat: 'YYYY',
  withCellSpacing: true,
  fullWidth: false,
  withNativeLevelSelect: false,
})
const emit = defineEmits<QuarterPickerEmits>()
const attrs = useAttrs()
const instance = getCurrentInstance()
const disableNativeLevelSelect = computed(() => {
  const vnodeProps = instance?.vnode.props
  return (
    props.date !== undefined &&
    !(vnodeProps?.['onUpdate:date'] || vnodeProps?.onDateChange || vnodeProps?.['onDate-change'])
  )
})

const clampLevel = (level: QuarterPickerLevel | undefined): QuarterPickerLevel =>
  props.maxLevel === 'year' ? 'year' : level || 'year'

const finalValue = computed<DatePickerValueType>(() =>
  props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
)

const [value, setValue] = useUncontrolled<DatePickerValueType>({
  value: computed(() =>
    props.modelValue === undefined ? undefined : normalizeQuarterValue(props.modelValue),
  ),
  defaultValue: normalizeQuarterValue(props.defaultValue),
  finalValue: finalValue.value,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})

const [level, setLevel] = useUncontrolled<QuarterPickerLevel>({
  value: computed(() => (props.level === undefined ? undefined : clampLevel(props.level))),
  defaultValue: props.defaultLevel === undefined ? undefined : clampLevel(props.defaultLevel),
  finalValue: 'year',
  onChange: (next) => {
    emit('update:level', next)
    emit('level-change', next)
  },
})

const fallbackDate = getDefaultClampedDate({ minDate: props.minDate, maxDate: props.maxDate })
const [date, setDate] = useUncontrolled<DateStringValue>({
  value: computed(() => toDateString(props.date) || undefined),
  defaultValue: toDateString(props.defaultDate) || undefined,
  finalValue: fallbackDate,
  onChange: (next) => {
    emit('update:date', next)
    emit('date-change', next)
  },
})

const scroll = computed(() => props.columnsToScroll || props.numberOfColumns || 1)
const hovered = ref<DateStringValue | null>(null)
const rootElement = ref<HTMLElement | null>(null)
const quarterGroup = ref<any>(null)
const decadeCalendar = ref<any>(null)

function quarterControlProps(quarter: DateStringValue) {
  const external = props.getQuarterControlProps?.(quarter) || {}
  if (props.type !== 'range' || !Array.isArray(value.value)) return external
  const [start, end] = value.value as DatesRangeValue
  const previewEnd = start && !end ? hovered.value : end
  if (!start || !previewEnd) return external
  const [first, last] = [getQuarterStart(start), getQuarterStart(previewEnd)].sort((a, b) =>
    dayjs(a).isAfter(b, 'day') ? 1 : -1,
  )
  return {
    inRange: !dayjs(quarter).isBefore(first, 'day') && !dayjs(quarter).isAfter(last, 'day'),
    firstInRange: quarter === first,
    lastInRange: quarter === last,
    ...external,
  }
}

function selectQuarter(quarter: DateStringValue) {
  if (
    props.type === 'default' &&
    props.allowDeselect &&
    typeof value.value === 'string' &&
    getQuarterStart(value.value) === quarter
  ) {
    setValue(null)
  } else {
    setValue(getNextPickerValue(value.value, quarter, props.type, props.sortDates))
  }
  hovered.value = null
  emit('quarter-select', quarter)
}

function hoverQuarter(quarter: DateStringValue) {
  const [start, end] = Array.isArray(value.value) ? (value.value as DatesRangeValue) : [null, null]
  if (props.type === 'range' && start && !end) hovered.value = quarter
  emit('quarter-mouse-enter', quarter)
}

let pendingLevelFocus: {
  target: 'level' | 'grid'
  index: number
  level: QuarterPickerLevel
} | null = null

function changeLevel(nextLevel: QuarterPickerLevel) {
  const root = rootElement.value
  if (root && typeof document !== 'undefined') {
    const activeElement = document.activeElement
    const focusWithin =
      !activeElement || activeElement === document.body || root.contains(activeElement)
    const controls = Array.from(root.querySelectorAll('[data-level-control]'))
    const index = activeElement ? controls.indexOf(activeElement) : -1
    pendingLevelFocus = focusWithin
      ? {
          target: index === -1 ? 'grid' : 'level',
          index: Math.max(index, 0),
          level: level.value,
        }
      : null
  }

  setLevel(clampLevel(nextLevel))

  nextTick(() => {
    const request = pendingLevelFocus
    pendingLevelFocus = null
    if (!request || request.level === level.value || !rootElement.value) return
    let node: HTMLElement | null = null
    if (request.target === 'level') {
      const controls = rootElement.value.querySelectorAll<HTMLElement>('button[data-level-control]')
      node = controls[Math.min(request.index, controls.length - 1)] || null
    }
    if (node) node.focus({ preventScroll: true })
    else if (level.value === 'year') quarterGroup.value?.focusTabControl()
    else decadeCalendar.value?.focusTabControl?.()
  })
}

function selectYear(year: DateStringValue) {
  setDate(year)
  changeLevel('year')
  emit('year-select', year)
}

function moveYears(amount: number) {
  setDate(dayjs(date.value).add(amount, 'year').format('YYYY-MM-DD'))
}

function selectPreset(next: DatePickerValueType) {
  const normalized = normalizeQuarterValue(next)
  const first = Array.isArray(normalized) ? normalized[0] : normalized
  if (first !== undefined) {
    if (first) setDate(first)
    setLevel('year')
    setValue(normalized)
  }
}

function setRootRef(node: any) {
  rootElement.value = node
}
</script>

<template>
  <div
    v-if="props.presets?.length"
    v-bind="attrs"
    :class="[classes.quarterPickerRoot, attrs.class]"
    data-quarter-picker-root
  >
    <PresetsList :presets="props.presets" @preset-select="selectPreset" />
    <div
      :ref="setRootRef"
      data-quarter-picker
      :data-full-width="props.fullWidth || undefined"
      @mouseleave="hovered = null"
    >
      <QuarterLevelGroup
        v-if="level === 'year'"
        ref="quarterGroup"
        :year="date"
        :number-of-columns="props.numberOfColumns"
        :value="value"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :locale="props.locale"
        :quarters-list-format="props.quartersListFormat"
        :year-label-format="props.yearLabelFormat"
        :get-quarter-control-props="quarterControlProps"
        :has-next-level="props.maxLevel !== 'year'"
        :with-cell-spacing="props.withCellSpacing"
        :full-width="props.fullWidth"
        :with-native-level-select="props.withNativeLevelSelect"
        :years-select-range="props.yearsSelectRange"
        :disable-native-level-select="disableNativeLevelSelect"
        :next-label="props.nextLabel"
        :previous-label="props.previousLabel"
        @next="moveYears(scroll)"
        @previous="moveYears(-scroll)"
        @level-click="changeLevel('decade')"
        @date-change="setDate"
        @quarter-select="selectQuarter"
        @quarter-mouse-enter="hoverQuarter"
      />
      <Calendar
        v-else
        ref="decadeCalendar"
        level="decade"
        min-level="year"
        max-level="decade"
        :date="date"
        :value="typeof value === 'string' ? value : null"
        :number-of-columns="props.numberOfColumns"
        :columns-to-scroll="props.columnsToScroll"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :locale="props.locale"
        :years-list-format="props.yearsListFormat"
        :decade-label-format="props.decadeLabelFormat"
        :get-year-control-props="props.getYearControlProps"
        :full-width="props.fullWidth"
        @date-change="setDate"
        @year-select="selectYear"
        @year-mouse-enter="emit('year-mouse-enter', $event)"
      />
    </div>
  </div>
  <div
    v-else
    v-bind="attrs"
    :ref="setRootRef"
    data-quarter-picker
    :data-full-width="props.fullWidth || undefined"
    @mouseleave="hovered = null"
  >
    <QuarterLevelGroup
      v-if="level === 'year'"
      ref="quarterGroup"
      :year="date"
      :number-of-columns="props.numberOfColumns"
      :value="value"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :locale="props.locale"
      :quarters-list-format="props.quartersListFormat"
      :year-label-format="props.yearLabelFormat"
      :get-quarter-control-props="quarterControlProps"
      :has-next-level="props.maxLevel !== 'year'"
      :with-cell-spacing="props.withCellSpacing"
      :full-width="props.fullWidth"
      :with-native-level-select="props.withNativeLevelSelect"
      :years-select-range="props.yearsSelectRange"
      :disable-native-level-select="disableNativeLevelSelect"
      :next-label="props.nextLabel"
      :previous-label="props.previousLabel"
      @next="moveYears(scroll)"
      @previous="moveYears(-scroll)"
      @level-click="changeLevel('decade')"
      @date-change="setDate"
      @quarter-select="selectQuarter"
      @quarter-mouse-enter="hoverQuarter"
    />
    <Calendar
      v-else
      ref="decadeCalendar"
      level="decade"
      min-level="year"
      max-level="decade"
      :date="date"
      :value="typeof value === 'string' ? value : null"
      :number-of-columns="props.numberOfColumns"
      :columns-to-scroll="props.columnsToScroll"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :locale="props.locale"
      :years-list-format="props.yearsListFormat"
      :decade-label-format="props.decadeLabelFormat"
      :get-year-control-props="props.getYearControlProps"
      :full-width="props.fullWidth"
      @date-change="setDate"
      @year-select="selectYear"
      @year-mouse-enter="emit('year-mouse-enter', $event)"
    />
  </div>
</template>
