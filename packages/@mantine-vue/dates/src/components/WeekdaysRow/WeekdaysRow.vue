<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useDatesContext } from '../DatesProvider'
import type { WeekdaysRowProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'WeekdaysRow' })

const props = withDefaults(defineProps<WeekdaysRowProps>(), {
  weekdayFormat: 'dd',
  withWeekNumbers: false,
})
const context = useDatesContext()
const days = computed(() => {
  const firstDay = props.firstDayOfWeek ?? context.firstDayOfWeek
  return Array.from({ length: 7 }, (_, index) =>
    dayjs('2024-01-07').add((firstDay + index) % 7, 'day'),
  )
})

function label(date: dayjs.Dayjs) {
  return typeof props.weekdayFormat === 'function'
    ? props.weekdayFormat(date.format('YYYY-MM-DD'))
    : date.locale(props.locale || context.locale).format(props.weekdayFormat)
}
</script>

<template>
  <tr :class="classes.weekdaysRow">
    <th v-if="props.withWeekNumbers" :class="classes.weekday" />
    <th
      v-for="date in days"
      :key="date.day()"
      :class="classes.weekday"
      :data-weekend="(props.weekendDays ?? context.weekendDays).includes(date.day()) || undefined"
    >
      {{ label(date) }}
    </th>
  </tr>
</template>
