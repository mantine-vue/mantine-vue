<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useDirection } from '@mantine-vue/core'
import { useDatesContext } from '../DatesProvider'
import PickerControl from '../PickerControl/PickerControl.vue'
import {
  focusAdjacentControl,
  focusGridControl,
  getQuarterStart,
  keyToDirection,
  setGridRef,
} from '../../utils'
import type { DateStringValue, GridDirection } from '../../types'
import type { QuartersListEmits, QuartersListProps } from './QuartersList.types'
import { getQuarterInTabOrder, getQuartersData, isQuarterDisabled } from './quarters-utils'
import classes from './QuartersList.module.css'

defineOptions({ name: 'QuartersList' })
const props = withDefaults(defineProps<QuartersListProps>(), {
  year: () => dayjs().format('YYYY-MM-DD'),
  quartersListFormat: '[Q]Q',
  withCellSpacing: true,
  fullWidth: false,
})
const emit = defineEmits<QuartersListEmits>()
const context = useDatesContext()
const { dir } = useDirection()
const controlRefs: (HTMLElement | null | undefined)[][] = []
const quarters = computed(() => getQuartersData(props.year))

const controlProps = (quarter: DateStringValue) => props.getQuarterControlProps?.(quarter) || {}

function controlAttributes(quarter: DateStringValue) {
  const { onClick, onMouseenter, onMouseEnter, onKeydown, onKeyDown, children, ...rest } =
    controlProps(quarter)
  void onClick
  void onMouseenter
  void onMouseEnter
  void onKeydown
  void onKeyDown
  void children
  return rest
}

const disabled = (quarter: DateStringValue) =>
  isQuarterDisabled({ quarter, minDate: props.minDate, maxDate: props.maxDate }) ||
  !!controlProps(quarter).disabled

const valueSelected = (quarter: DateStringValue) => {
  const value = props.value
  if (Array.isArray(value))
    return (value as (DateStringValue | null)[]).some(
      (item) => !!item && getQuarterStart(item) === quarter,
    )
  return !!value && getQuarterStart(value as DateStringValue) === quarter
}

const selected = (quarter: DateStringValue) =>
  !!(controlProps(quarter).selected ?? valueSelected(quarter))

const tabQuarter = computed(() =>
  getQuarterInTabOrder({
    quarters: quarters.value,
    minDate: props.minDate,
    maxDate: props.maxDate,
    getQuarterControlProps: props.getQuarterControlProps,
    isSelected: valueSelected,
  }),
)

const label = (quarter: DateStringValue) =>
  controlProps(quarter).children ??
  (typeof props.quartersListFormat === 'function'
    ? props.quartersListFormat(quarter)
    : dayjs(quarter)
        .locale(props.locale || context.locale || 'en')
        .format(props.quartersListFormat))

function onClick(quarter: DateStringValue, event: MouseEvent) {
  controlProps(quarter).onClick?.(event)
  if (!disabled(quarter)) emit('quarter-select', quarter)
}

function onMouseEnter(quarter: DateStringValue, event: MouseEvent) {
  const control = controlProps(quarter)
  ;(control.onMouseenter ?? control.onMouseEnter)?.(event)
  emit('quarter-mouse-enter', quarter)
}

function onKeydown(
  quarter: DateStringValue,
  rowIndex: number,
  cellIndex: number,
  event: KeyboardEvent,
) {
  const control = controlProps(quarter)
  ;(control.onKeydown ?? control.onKeyDown)?.(event)
  const direction = keyToDirection(event.key, dir.value)
  if (direction) {
    event.preventDefault()
    const edge = focusAdjacentControl(controlRefs, rowIndex, cellIndex, direction)
    if (edge) emit('edge-cross', { edge, direction, cellIndex })
  }
}

function focusTabControl() {
  const quarter = tabQuarter.value
  if (!quarter) return
  quarters.value.forEach((row, rowIndex) => {
    const cellIndex = row.indexOf(quarter)
    if (cellIndex !== -1) controlRefs[rowIndex]?.[cellIndex]?.focus({ preventScroll: true })
  })
}

defineExpose({
  focusControl: (direction: GridDirection, rowIndex: number | 'last', cellIndex: number | 'last') =>
    focusGridControl(controlRefs, direction, rowIndex, cellIndex),
  focusTabControl,
})
</script>

<template>
  <table :class="classes.quartersList" :data-full-width="props.fullWidth || undefined">
    <tbody>
      <tr v-for="(row, rowIndex) in quarters" :key="rowIndex" :class="classes.quartersListRow">
        <td
          v-for="(quarter, cellIndex) in row"
          :key="quarter"
          :class="classes.quartersListCell"
          :data-with-spacing="props.withCellSpacing || undefined"
        >
          <PickerControl
            v-bind="controlAttributes(quarter)"
            :ref="(node: any) => setGridRef(controlRefs, rowIndex, cellIndex, node)"
            :class="[classes.quartersListControl, controlAttributes(quarter).class]"
            :full-width="props.fullWidth"
            :disabled="disabled(quarter)"
            :selected="selected(quarter)"
            :tabindex="quarter === tabQuarter ? 0 : -1"
            :data-autofocus="selected(quarter) || undefined"
            @click="onClick(quarter, $event)"
            @mouseenter="onMouseEnter(quarter, $event)"
            @keydown="onKeydown(quarter, rowIndex, cellIndex, $event)"
            >{{ label(quarter) }}</PickerControl
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
