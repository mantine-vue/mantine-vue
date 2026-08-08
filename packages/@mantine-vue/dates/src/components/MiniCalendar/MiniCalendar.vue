<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs } from 'vue'
import { AccordionChevron, Box, UnstyledButton } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useDatesContext } from '../DatesProvider'
import { toDateString } from '../../utils'
import type { DateStringValue, DateValue, MiniCalendarEmits, MiniCalendarProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'MiniCalendar', inheritAttrs: false })
const props = withDefaults(defineProps<MiniCalendarProps>(), {
  numberOfDays: 7,
  monthLabelFormat: 'MMM',
  size: 'sm',
})
const emit = defineEmits<
  MiniCalendarEmits & {
    'update:modelValue': [value: DateValue]
    change: [value: DateValue]
    'update:date': [value: DateStringValue]
    'date-change': [value: DateStringValue]
  }
>()
const attrs = useAttrs(),
  context = useDatesContext()
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
const [date, setDate] = useUncontrolled<DateStringValue>({
  value: computed(() => toDateString(props.date) || undefined),
  defaultValue: toDateString(props.defaultDate) || undefined,
  finalValue: value.value || dayjs().format('YYYY-MM-DD'),
  onChange: (next) => {
    emit('update:date', next)
    emit('date-change', next)
  },
})
const range = computed(() =>
  Array.from({ length: props.numberOfDays }, (_, index) => dayjs(date.value).add(index, 'days')),
)
const previousDisabled = computed(() =>
  props.minDate ? dayjs(date.value).subtract(1, 'day').isBefore(dayjs(props.minDate)) : false,
)
const nextDisabled = computed(() =>
  props.maxDate
    ? dayjs(date.value).add(props.numberOfDays, 'day').isAfter(dayjs(props.maxDate))
    : false,
)
const dayProps = (item: dayjs.Dayjs) => props.getDayProps?.(item.format('YYYY-MM-DD')) || {}
const disabled = (item: dayjs.Dayjs) =>
  !!(
    (props.minDate && item.isBefore(dayjs(props.minDate), 'day')) ||
    (props.maxDate && item.isAfter(dayjs(props.maxDate), 'day'))
  )
function previous() {
  emit('previous')
  setDate(dayjs(date.value).subtract(props.numberOfDays, 'day').format('YYYY-MM-DD'))
}
function next() {
  emit('next')
  setDate(dayjs(date.value).add(props.numberOfDays, 'day').format('YYYY-MM-DD'))
}
function select(item: dayjs.Dayjs, event: MouseEvent) {
  dayProps(item).onClick?.(event)
  setValue(item.format('YYYY-MM-DD'))
}
const previousContent = () => props.previousControlProps?.children
const nextContent = () => props.nextControlProps?.children
</script>

<template>
  <Box v-bind="attrs" :class="[classes.miniCalendarRoot, attrs.class]">
    <UnstyledButton
      v-bind="props.previousControlProps"
      :class="[classes.miniCalendarControl, props.previousControlProps?.class]"
      :disabled="previousDisabled"
      :data-disabled="previousDisabled || undefined"
      data-direction="previous"
      @click="previous"
      ><component
        :is="previousContent"
        v-if="props.previousControlProps?.children" /><AccordionChevron
        v-else
        data-chevron
        :size="props.size"
    /></UnstyledButton>
    <div :class="classes.miniCalendarDays">
      <UnstyledButton
        v-for="item in range"
        :key="item.toString()"
        v-bind="dayProps(item)"
        :class="[classes.miniCalendarDay, dayProps(item).class]"
        :disabled="disabled(item)"
        :aria-label="item.format('YYYY-MM-DD')"
        :data-disabled="disabled(item) || undefined"
        :data-selected="(value && item.isSame(value, 'day')) || undefined"
        @click="select(item, $event)"
        ><span :class="classes.miniCalendarDayMonth">{{
          item.locale(props.locale || context.locale).format(props.monthLabelFormat)
        }}</span
        ><span :class="classes.miniCalendarDayNumber">{{ item.date() }}</span></UnstyledButton
      >
    </div>
    <UnstyledButton
      v-bind="props.nextControlProps"
      :class="[classes.miniCalendarControl, props.nextControlProps?.class]"
      :disabled="nextDisabled"
      :data-disabled="nextDisabled || undefined"
      data-direction="next"
      @click="next"
      ><component :is="nextContent" v-if="props.nextControlProps?.children" /><AccordionChevron
        v-else
        data-chevron
        :size="props.size"
    /></UnstyledButton>
  </Box>
</template>
