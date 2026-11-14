<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, getCurrentInstance, nextTick } from 'vue'
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue'
import QuartersList from '../QuartersList/QuartersList.vue'
import type { ControlEdgeCrossPayload, DateStringValue, GridDirection } from '../../types'
import type { QuarterLevelGroupEmits, QuarterLevelGroupProps } from './QuarterLevelGroup.types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'QuarterLevelGroup', inheritAttrs: false })
const props = withDefaults(defineProps<QuarterLevelGroupProps>(), {
  year: () => dayjs().format('YYYY-MM-DD'),
  numberOfColumns: 1,
  yearLabelFormat: 'YYYY',
  quartersListFormat: '[Q]Q',
  hasNextLevel: true,
  withCellSpacing: true,
  fullWidth: false,
  withNativeLevelSelect: false,
  nextDisabled: undefined,
  previousDisabled: undefined,
  disableNativeLevelSelect: false,
})
const emit = defineEmits<QuarterLevelGroupEmits>()
const instance = getCurrentInstance()
const grids: any[] = []

const years = computed(() =>
  Array.from({ length: props.numberOfColumns || 1 }, (_, index) =>
    dayjs(props.year).add(index, 'year').format('YYYY-MM-DD'),
  ),
)

const previousDisabled = computed(() =>
  typeof props.previousDisabled === 'boolean'
    ? props.previousDisabled
    : props.minDate
      ? !dayjs(props.year).startOf('year').isAfter(props.minDate)
      : false,
)

const nextDisabled = computed(() =>
  typeof props.nextDisabled === 'boolean'
    ? props.nextDisabled
    : props.maxDate
      ? !dayjs(years.value[years.value.length - 1])
          .endOf('year')
          .isBefore(props.maxDate)
      : false,
)

const hasDateListener = () => {
  const vnodeProps = instance?.vnode.props
  return !!(vnodeProps?.onDateChange || vnodeProps?.['onDate-change'])
}

const yearLabel = (value: DateStringValue) =>
  typeof props.yearLabelFormat === 'function'
    ? props.yearLabelFormat(value)
    : dayjs(value)
        .locale(props.locale || 'en')
        .format(props.yearLabelFormat)

function handleEdgeCross(column: number, { edge, direction, cellIndex }: ControlEdgeCrossPayload) {
  const vertical = direction === 'up' || direction === 'down'
  const request: [GridDirection, number | 'last', number | 'last'] = [
    direction,
    edge === 'previous' ? 'last' : 0,
    vertical ? cellIndex : edge === 'previous' ? 'last' : 0,
  ]
  const target = edge === 'previous' ? column - 1 : column + 1
  if (target >= 0 && target < years.value.length) {
    grids[target]?.focusControl(...request)
    return
  }

  if (edge === 'previous' ? previousDisabled.value : nextDisabled.value) return
  const year = props.year
  if (edge === 'previous') emit('previous')
  else emit('next')
  nextTick(() => {
    if (props.year === year) return
    grids[edge === 'previous' ? years.value.length - 1 : 0]?.focusControl(...request)
  })
}

defineExpose({ focusTabControl: () => grids[0]?.focusTabControl() })
</script>

<template>
  <div
    v-bind="$attrs"
    :class="[classes.calendar, $attrs.class]"
    :data-full-width="props.fullWidth || undefined"
  >
    <div v-for="(year, column) in years" :key="year" :class="classes.calendarLevel">
      <CalendarHeader
        :label="yearLabel(year)"
        :has-next-level="props.hasNextLevel"
        :with-previous="column === 0"
        :with-next="column === years.length - 1"
        :previous-disabled="previousDisabled"
        :next-disabled="nextDisabled"
        :next-label="props.nextLabel"
        :previous-label="props.previousLabel"
        :level-control-aria-label="props.levelControlAriaLabel"
        :full-width="props.fullWidth"
        :with-native-level-select="props.withNativeLevelSelect"
        :years-select-range="props.yearsSelectRange"
        calendar-level="year"
        :date="year"
        :locale="props.locale"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :disable-native-level-select="props.disableNativeLevelSelect || !hasDateListener()"
        @date-change="emit('date-change', $event)"
        @previous="emit('previous')"
        @next="emit('next')"
        @level-click="emit('level-click')"
      />
      <QuartersList
        :ref="(node: any) => (grids[column] = node)"
        :year="year"
        :value="props.value"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :locale="props.locale"
        :quarters-list-format="props.quartersListFormat"
        :get-quarter-control-props="props.getQuarterControlProps"
        :with-cell-spacing="props.withCellSpacing"
        :full-width="props.fullWidth"
        @quarter-select="emit('quarter-select', $event)"
        @quarter-mouse-enter="emit('quarter-mouse-enter', $event)"
        @edge-cross="handleEdgeCross(column, $event)"
      />
    </div>
  </div>
</template>
