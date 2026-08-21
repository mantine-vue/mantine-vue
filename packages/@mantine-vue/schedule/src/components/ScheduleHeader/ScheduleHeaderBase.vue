<script lang="ts">
import dayjs from 'dayjs'
import type { ScheduleViewLevel } from '../../types'
import { toDateString } from '../../utils'
import type { ScheduleHeaderNavigationHandlers } from './ScheduleHeaderBase.types'

const DEFAULT_VIEWS: ScheduleViewLevel[] = ['day', 'week', 'month', 'year']

/** Builds the previous/next/today handlers for a view that steps by a single `unit`. */
export function createHeaderNavigation(
  date: Date | string,
  unit: 'day' | 'week' | 'month' | 'year',
): ScheduleHeaderNavigationHandlers {
  return {
    previous: () => toDateString(dayjs(date).subtract(1, unit)),
    next: () => toDateString(dayjs(date).add(1, unit)),
    today: () => toDateString(dayjs()),
  }
}

export { DEFAULT_VIEWS }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, NativeSelect, useProps, useStyles } from '@mantine-vue/core'
import { getLabel } from '../../labels'
import { ScheduleHeader } from './ScheduleHeader'
import type {
  ScheduleHeaderBaseEmits,
  ScheduleHeaderBaseProps,
  ScheduleHeaderBaseSlots,
} from './ScheduleHeaderBase.types'
import classes from './ScheduleHeader.module.css'

defineOptions({
  name: 'ScheduleHeaderBase',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ScheduleHeaderBaseProps>(), {
  labels: undefined,
  previousControlProps: undefined,
  nextControlProps: undefined,
  todayControlProps: undefined,
  viewSelectProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ScheduleHeaderBaseSlots>()

const emit = defineEmits<ScheduleHeaderBaseEmits>()

const attrs = useAttrs()

const props = useProps('ScheduleHeader', null, rawProps)

/**
 * The layout selectors live in the `ScheduleHeader` Styles API, so a view that forwards its
 * `classNames` reaches them through the same names it documents.
 */
const getStyles = useStyles({
  name: 'ScheduleHeader',
  props,
  classes,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'header',
})

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const views = computed(() => props.viewSelectProps?.views ?? DEFAULT_VIEWS)

const compactData = computed(() =>
  views.value.map((view) => ({ value: view, label: getLabel(view, props.labels) })),
)

const changeView = (view: ScheduleViewLevel) => emit('viewChange', view)

const renderTitle = () => props.control.title
</script>

<template>
  <ScheduleHeader v-bind="{ ...attrs, ...stylesApi }" :labels="props.labels">
    <Box v-bind="getStyles('navigationGroup')">
      <ScheduleHeader.Previous
        v-bind="{ ...stylesApi, ...props.previousControlProps }"
        @click="emit('dateChange', props.navigationHandlers.previous())"
      />

      <ScheduleHeader.MonthYearSelect
        v-if="props.control.monthYearSelect"
        v-bind="{ ...stylesApi, ...props.control.monthYearSelect }"
        :labels="props.labels"
      />
      <ScheduleHeader.Control
        v-else
        v-bind="stylesApi"
        :interactive="false"
        :style="props.control.miw === undefined ? undefined : { minWidth: props.control.miw }"
      >
        <component :is="renderTitle" v-if="props.control.title !== undefined" />
        <slot v-else name="title" />
      </ScheduleHeader.Control>

      <ScheduleHeader.Next
        v-bind="{ ...stylesApi, ...props.nextControlProps }"
        @click="emit('dateChange', props.navigationHandlers.next())"
      />
    </Box>

    <Box v-bind="getStyles('todayControl')">
      <ScheduleHeader.Today
        v-bind="{ ...stylesApi, ...props.todayControlProps }"
        @click="emit('dateChange', props.navigationHandlers.today())"
      />
    </Box>

    <NativeSelect
      :class="getStyles('compactViewSelect').class"
      :model-value="props.view"
      size="sm"
      :data="compactData"
      :aria-label="getLabel('viewSelectLabel', props.labels)"
      @change="changeView($event as ScheduleViewLevel)"
    />

    <Box v-bind="getStyles('viewSelect', { style: { marginInlineStart: 'auto' } })">
      <ScheduleHeader.ViewSelect
        v-bind="{ ...stylesApi, ...props.viewSelectProps }"
        :model-value="props.view"
        :labels="props.labels"
        @change="changeView"
      />
    </Box>
  </ScheduleHeader>
</template>
