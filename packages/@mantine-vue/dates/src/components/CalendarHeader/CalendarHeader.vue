<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, getCurrentInstance } from 'vue'
import { AccordionChevron, UnstyledButton } from '@mantine-vue/core'
import type { CalendarHeaderEmits, CalendarHeaderProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'CalendarHeader' })

const props = withDefaults(defineProps<CalendarHeaderProps>(), {
  hasNextLevel: true,
  withNext: true,
  withPrevious: true,
  nextDisabled: false,
  previousDisabled: false,
  nextLabel: 'Next',
  previousLabel: 'Previous',
  fullWidth: false,
  withNativeLevelSelect: false,
  disableNativeLevelSelect: false,
})
const emit = defineEmits<CalendarHeaderEmits>()
const instance = getCurrentInstance()
const hasDateChangeListener = computed(() => {
  const vnodeProps = instance?.vnode.props
  return !!(vnodeProps?.onDateChange || vnodeProps?.['onDate-change'])
})

const displayed = computed(() => (props.date ? dayjs(props.date) : dayjs()))
const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const rawMin =
    props.yearsSelectRange?.[0] ?? (props.minDate ? dayjs(props.minDate).year() : currentYear - 100)
  const rawMax =
    props.yearsSelectRange?.[1] ?? (props.maxDate ? dayjs(props.maxDate).year() : currentYear + 50)
  const min = Math.min(rawMin, rawMax, displayed.value.year())
  const max = Math.max(rawMin, rawMax, displayed.value.year())
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
})
const monthNames = computed(() =>
  Array.from({ length: 12 }, (_, month) =>
    dayjs()
      .locale(props.locale || 'en')
      .month(month)
      .format('MMMM'),
  ),
)
const showsNativeSelect = computed(
  () =>
    props.withNativeLevelSelect &&
    props.date &&
    hasDateChangeListener.value &&
    props.calendarLevel !== 'decade',
)

function updateNativeDate(next: dayjs.Dayjs) {
  let result = next
  if (props.minDate && result.isBefore(dayjs(props.minDate), 'day')) result = dayjs(props.minDate)
  if (props.maxDate && result.isAfter(dayjs(props.maxDate), 'day')) result = dayjs(props.maxDate)
  emit('date-change', result.format('YYYY-MM-DD'))
}

function onMonthChange(event: Event) {
  updateNativeDate(displayed.value.month(Number((event.target as HTMLSelectElement).value)))
}

function onYearChange(event: Event) {
  updateNativeDate(displayed.value.year(Number((event.target as HTMLSelectElement).value)))
}
</script>

<template>
  <div :class="classes.calendarHeader" :data-full-width="props.fullWidth || undefined">
    <UnstyledButton
      v-if="props.withPrevious"
      :class="classes.calendarHeaderControl"
      data-direction="previous"
      :aria-label="props.previousLabel"
      :disabled="props.previousDisabled"
      :data-disabled="props.previousDisabled || undefined"
      @click="emit('previous')"
    >
      <AccordionChevron
        :class="classes.calendarHeaderControlIcon"
        data-direction="previous"
        size="45%"
      />
    </UnstyledButton>

    <div
      v-if="showsNativeSelect"
      :class="classes.calendarHeaderLevel"
      data-static
      data-native-level-select
    >
      <select
        v-if="props.calendarLevel === 'month'"
        :class="classes.calendarHeaderSelect"
        data-select="month"
        :disabled="props.disableNativeLevelSelect"
        :value="displayed.month()"
        :aria-label="props.levelControlAriaLabel"
        @change="onMonthChange"
      >
        <option v-for="(month, index) in monthNames" :key="month" :value="index">
          {{ month }}
        </option>
      </select>
      <select
        :class="classes.calendarHeaderSelect"
        data-select="year"
        :disabled="props.disableNativeLevelSelect"
        :value="displayed.year()"
        :aria-label="props.levelControlAriaLabel"
        @change="onYearChange"
      >
        <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <UnstyledButton
      v-else
      :component="props.hasNextLevel ? 'button' : 'div'"
      :class="classes.calendarHeaderLevel"
      :disabled="!props.hasNextLevel"
      :data-static="!props.hasNextLevel || undefined"
      :aria-label="props.levelControlAriaLabel"
      @click="props.hasNextLevel ? emit('level-click') : undefined"
    >
      {{ props.label }}
    </UnstyledButton>

    <UnstyledButton
      v-if="props.withNext"
      :class="classes.calendarHeaderControl"
      data-direction="next"
      :aria-label="props.nextLabel"
      :disabled="props.nextDisabled"
      :data-disabled="props.nextDisabled || undefined"
      @click="emit('next')"
    >
      <AccordionChevron
        :class="classes.calendarHeaderControlIcon"
        data-direction="next"
        size="45%"
      />
    </UnstyledButton>
  </div>
</template>
