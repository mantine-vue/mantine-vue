<script lang="ts">
const defaultProps = {
  monthsListFormat: 'MMMM',
  withMonths: true,
} as const

/** Fallback radius of the dropdown, so it follows the schedule radius when one is set. */
const DEFAULT_DROPDOWN_RADIUS = 'var(--schedule-radius, var(--mantine-radius-default))'

export { defaultProps, DEFAULT_DROPDOWN_RADIUS }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import {
  Box,
  createScopedKeydownHandler,
  Popover,
  UnstyledButton,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { getLabel } from '../../../labels'
import { formatDate, getMonthsList, getYearsList } from '../../../utils'
import { HeaderControl } from '../HeaderControl'
import { useScheduleHeaderLabels } from '../ScheduleHeader.context'
import type { MonthYearSelectEmits, MonthYearSelectOwnProps } from './MonthYearSelect.types'
import classes from './MonthYearSelect.module.css'

defineOptions({
  name: 'MonthYearSelect',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MonthYearSelectOwnProps>(), {
  locale: undefined,
  startYear: undefined,
  endYear: undefined,
  yearValue: undefined,
  monthValue: undefined,
  monthsListFormat: undefined,
  labelFormat: undefined,
  radius: undefined,
  getYearControlProps: undefined,
  getMonthControlProps: undefined,
  withMonths: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<MonthYearSelectEmits>()

const attrs = useAttrs()

const props = useProps('MonthYearSelect', defaultProps, rawProps)

const labels = useScheduleHeaderLabels(() => props.labels)

const getStyles = useStyles({
  name: 'MonthYearSelect',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'monthYearSelectTarget',
})

const opened = ref(false)

/** Captured once so the default year range does not shift while the dropdown is open. */
const today = new Date()

const startYear = computed(() => props.startYear ?? today.getFullYear() - 5)
const endYear = computed(() => props.endYear ?? today.getFullYear() + 5)

const selectedDate = computed(
  () => new Date(props.yearValue ?? today.getFullYear(), props.monthValue ?? today.getMonth(), 1),
)

/**
 * When the selected year falls outside the offered range no control can be focused by the
 * roving tabindex, so the first one takes the tab stop instead.
 */
const hasActiveYear = computed(
  () =>
    props.yearValue !== undefined &&
    props.yearValue >= startYear.value &&
    props.yearValue <= endYear.value,
)

const months = computed(() =>
  props.withMonths
    ? getMonthsList({ locale: props.locale || 'en', format: props.monthsListFormat! })
    : [],
)

const years = computed(() => getYearsList({ startYear: startYear.value, endYear: endYear.value }))

const targetLabel = computed(() =>
  formatDate({
    date: selectedDate.value,
    locale: props.locale || 'en',
    format: props.labelFormat || (props.withMonths ? 'MMMM YYYY' : 'YYYY'),
  }),
)

const selectMonth = (month: number) => {
  emit('update:monthValue', month)
  emit('monthChange', month)
}

const selectYear = (year: number) => {
  emit('update:yearValue', year)
  emit('yearChange', year)

  // Without a month list there is nothing left to pick, so the dropdown closes itself.
  if (!props.withMonths) {
    opened.value = false
  }
}

/**
 * Roving focus inside one dropdown list. A handler returned by `getMonthControlProps` or
 * `getYearControlProps` is not composed in here: Vue already merges the two `keydown`
 * listeners and would otherwise call the consumer's twice.
 */
const monthKeydownHandler = createScopedKeydownHandler({
  siblingSelector: '[data-type="month"]:not(:disabled)',
  parentSelector: '[data-list]',
  activateOnFocus: false,
  loop: true,
  orientation: 'vertical',
})

const yearKeydownHandler = createScopedKeydownHandler({
  siblingSelector: '[data-type="year"]:not(:disabled)',
  parentSelector: '[data-list]',
  activateOnFocus: false,
  loop: true,
  orientation: 'vertical',
})

const monthControlProps = (month: number) => props.getMonthControlProps?.(month) ?? {}
const yearControlProps = (year: number) => props.getYearControlProps?.(year) ?? {}
</script>

<template>
  <Popover
    position="bottom-start"
    trap-focus
    :transition-props="{ transition: 'pop', duration: 120 }"
    :radius="props.radius || DEFAULT_DROPDOWN_RADIUS"
    shadow="md"
    :offset="3"
    :width="props.withMonths ? undefined : 'target'"
    :opened="opened"
    @change="opened = $event"
  >
    <Popover.Target>
      <HeaderControl
        v-bind="{ ...attrs, ...getStyles('monthYearSelectTarget') }"
        :radius="props.radius"
        :data-with-months="props.withMonths || undefined"
        @click="opened = !opened"
      >
        {{ targetLabel }}
      </HeaderControl>
    </Popover.Target>

    <Popover.Dropdown
      v-bind="getStyles('monthYearSelectDropdown')"
      :data-with-months="props.withMonths || undefined"
    >
      <Box v-if="props.withMonths" v-bind="getStyles('monthYearSelectList')" data-list>
        <Box v-bind="getStyles('monthYearSelectLabel')">{{ getLabel('month', labels) }}</Box>
        <UnstyledButton
          v-for="month in months"
          :key="month.month"
          v-bind="{
            ...monthControlProps(month.month),
            ...getStyles('monthYearSelectControl', {
              className: monthControlProps(month.month).class,
            }),
          }"
          :mod="{ type: 'month', active: month.month === props.monthValue }"
          :tabindex="month.month === props.monthValue ? 0 : -1"
          :aria-label="`${getLabel('selectMonth', labels)} ${month.name}`"
          @keydown="monthKeydownHandler"
          @click="selectMonth(month.month)"
        >
          {{ month.name }}
        </UnstyledButton>
      </Box>

      <Box v-bind="getStyles('monthYearSelectList')" data-list>
        <Box v-if="props.withMonths" v-bind="getStyles('monthYearSelectLabel')">
          {{ getLabel('year', labels) }}
        </Box>
        <UnstyledButton
          v-for="(year, index) in years"
          :key="year"
          v-bind="{
            ...yearControlProps(year),
            ...getStyles('monthYearSelectControl', { className: yearControlProps(year).class }),
          }"
          :mod="{ type: 'year', active: year === props.yearValue }"
          :tabindex="hasActiveYear ? (year === props.yearValue ? 0 : -1) : index === 0 ? 0 : -1"
          :aria-label="`${getLabel('selectYear', labels)} ${year}`"
          @keydown="yearKeydownHandler"
          @click="selectYear(year)"
        >
          {{ year }}
        </UnstyledButton>
      </Box>
    </Popover.Dropdown>
  </Popover>
</template>
